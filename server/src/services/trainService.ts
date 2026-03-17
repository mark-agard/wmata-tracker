import { TrainPosition } from '../models/train.model.js';
import { FeedMessage } from '../generated/gtfs-realtime.js';

class TrainService {
  private trainPositions: TrainPosition[] = [];
  private lastUpdate: Date | null = null;

  private extractLineFromRoute(routeId: string): string {
    // WMATA route IDs are full names like "RED", "ORANGE", "BLUE", etc.
    const lineMap: Record<string, string> = {
      'RED': 'RL',
      'ORANGE': 'OR',
      'BLUE': 'BL',
      'SILVER': 'SV',
      'YELLOW': 'YL',
      'GREEN': 'GR',
      'NR': 'NR' // Keep as-is for now, seems to be a special service
    };
    
    return lineMap[routeId] || 'Unknown';
  }

  async fetchTrainPositions(): Promise<TrainPosition[]> {
    try {
      console.log('Fetching train positions from WMATA API...');
      
      const response = await fetch('https://api.wmata.com/gtfs/rail-gtfsrt-vehiclepositions.pb', {
        headers: {
          'api_key': process.env.WMATA_API_KEY || '',
          'Accept': 'application/x-protobuf'
        }
      });

      console.log('WMATA API response status:', response.status);

      if (!response.ok) {
        throw new Error(`WMATA API error: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      console.log('Received buffer size:', buffer.byteLength, 'bytes');
      
      // Decode protobuf data
      const feedMessage = FeedMessage.fromBinary(new Uint8Array(buffer));
      console.log('Decoded feed message entities:', feedMessage.entity.length);
      
      // Transform GTFS RT data to our TrainPosition format
      this.trainPositions = feedMessage.entity
        .filter(entity => entity.vehicle && entity.vehicle.position)
        .map(entity => {
          const vehicle = entity.vehicle!;
          const position = vehicle.position!;
          const trip = vehicle.trip;
          const vehicleDesc = vehicle.vehicle;
          
          const train = {
            id: vehicleDesc?.id || vehicleDesc?.label || 'unknown',
            line: this.extractLineFromRoute(trip?.routeId || ''),
            latitude: position.latitude || 0,
            longitude: position.longitude || 0,
            heading: position.bearing,
            timestamp: new Date().toISOString(),
            debugRouteId: trip?.routeId // Temporary debug field
          };
          console.log('Processed train:', train);
          return train;
        });

      console.log('Final train positions:', this.trainPositions.length);
      this.lastUpdate = new Date();
      return this.trainPositions;
    } catch (error) {
      console.error('Error fetching train positions:', error);
      // Return cached data if available, otherwise empty array
      return this.trainPositions;
    }
  }

  getTrainPositions(): TrainPosition[] {
    return this.trainPositions;
  }

  getLastUpdateTime(): Date | null {
    return this.lastUpdate;
  }

  isDataFresh(): boolean {
    if (!this.lastUpdate) return false;
    const now = new Date();
    const diffMs = now.getTime() - this.lastUpdate.getTime();
    return diffMs < 30000; // Fresh if less than 30 seconds old
  }
}

export default new TrainService();
