import { TripUpdate, StationArrival } from '../models/trip.model';
import { FeedMessage } from '../generated/gtfs-realtime';

class TripService {
  private trips: TripUpdate[] = [];
  private lastUpdate: Date | null = null;

  private extractLineFromRoute(routeId: string): string {
    const lineMap: Record<string, string> = {
      'RED': 'RL',
      'ORANGE': 'OR',
      'BLUE': 'BL',
      'SILVER': 'SV',
      'YELLOW': 'YL',
      'GREEN': 'GR'
    };

    return lineMap[routeId] || routeId;
  }

  private getDirectionFromStopSequence(trip: TripUpdate, currentStopSequence: number): string {
    // Find the first and last stops in this trip to determine direction
    const sequences = trip.stopTimeUpdates.map(s => s.stopSequence).filter(s => s > 0);
    if (sequences.length === 0) return '';

    const minSeq = Math.min(...sequences);
    const maxSeq = Math.max(...sequences);
    const midpoint = (minSeq + maxSeq) / 2;

    // Direction labels by line
    const directionMap: Record<string, { outbound: string, inbound: string }> = {
      'RL': { outbound: 'Shady Grove', inbound: 'Glenmont' },
      'OR': { outbound: 'Vienna', inbound: 'New Carrollton' },
      'BL': { outbound: 'Franconia-Springfield', inbound: 'Largo' },
      'SV': { outbound: 'Ashburn', inbound: 'Largo' },
      'YL': { outbound: 'Greenbelt', inbound: 'Huntington' },
      'GR': { outbound: 'Greenbelt', inbound: 'Branch Ave' }
    };

    const directions = directionMap[trip.routeId];
    if (!directions) return '';

    // If current stop is in first half of trip, train is heading toward end (outbound)
    // If in second half, train is heading toward beginning (inbound)
    return currentStopSequence < midpoint ? directions.outbound : directions.inbound;
  }

  async fetchTrips(): Promise<TripUpdate[]> {
    try {
      const response = await fetch('https://api.wmata.com/gtfs/rail-gtfsrt-tripUpdates.pb', {
        headers: {
          'api_key': process.env.WMATA_API_KEY || '',
          'Accept': 'application/x-protobuf'
        }
      });

      if (!response.ok) {
        throw new Error(`WMATA API error: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const feedMessage = FeedMessage.fromBinary(new Uint8Array(buffer));

      this.trips = feedMessage.entity
        .filter(entity => entity.tripUpdate)
        .map(entity => {
          const trip = entity.tripUpdate!;
          const tripInfo = trip.trip || {};

          const stopTimeUpdates = trip.stopTimeUpdate?.map((stop: any) => {
            return {
              stopId: stop.stopId || '',
              stopSequence: stop.stopSequence || 0,
              arrival: stop.arrival ? {
                time: Number(stop.arrival.time),
                delay: stop.arrival.delay,
                uncertainty: stop.arrival.uncertainty
              } : undefined,
              departure: stop.departure ? {
                time: Number(stop.departure.time),
                delay: stop.departure.delay,
                uncertainty: stop.departure.uncertainty
              } : undefined,
              scheduleRelationship: stop.scheduleRelationship || 'SCHEDULED'
            };
          }) || [];

          return {
            tripId: tripInfo.tripId || entity.id,
            routeId: this.extractLineFromRoute(tripInfo.routeId || ''),
            startTime: tripInfo.startTime,
            startDate: tripInfo.startDate,
            scheduleRelationship: (tripInfo.scheduleRelationship || 'SCHEDULED') as TripUpdate['scheduleRelationship'],
            vehicleId: trip.vehicle?.id,
            stopTimeUpdates,
            timestamp: Number(trip.timestamp) || Date.now() / 1000,
            delay: trip.delay
          };
        });

      this.lastUpdate = new Date();
      return this.trips;
    } catch (error) {
      console.error('Error fetching trips:', error);
      return this.trips;
    }
  }

  getTrips(): TripUpdate[] {
    return this.trips;
  }

  getArrivalsForStation(stopId: string): StationArrival[] {
    const now = Date.now() / 1000;
    const arrivals: StationArrival[] = [];

    for (const trip of this.trips) {
      for (const stopUpdate of trip.stopTimeUpdates) {
        // Match station code (e.g., "E03" matches "PF_E03_C", "PF_E03_D")
        const stopMatches = stopUpdate.stopId.includes(`_${stopId}_`) || 
                           stopUpdate.stopId.endsWith(`_${stopId}`) ||
                           stopUpdate.stopId === stopId;
        
        if (!stopMatches || !stopUpdate.arrival) continue;

        // Only show future arrivals
        if (stopUpdate.arrival.time < now - 60) continue;

        arrivals.push({
          tripId: trip.tripId,
          routeId: trip.routeId,
          vehicleId: trip.vehicleId,
          stopId: stopUpdate.stopId,
          stopSequence: stopUpdate.stopSequence,
          arrivalTime: stopUpdate.arrival.time,
          arrivalDelay: stopUpdate.arrival.delay,
          direction: this.getDirectionFromStopSequence(trip, stopUpdate.stopSequence)
        });
      }
    }

    arrivals.sort((a, b) => a.arrivalTime - b.arrivalTime);

    return arrivals;
  }

  getLastUpdateTime(): Date | null {
    return this.lastUpdate;
  }

  isDataFresh(): boolean {
    if (!this.lastUpdate) return false;
    const now = new Date();
    const diffMs = now.getTime() - this.lastUpdate.getTime();
    return diffMs < 60000;
  }
}

export default new TripService();
