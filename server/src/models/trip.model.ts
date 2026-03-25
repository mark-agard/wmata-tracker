export interface StopTimeUpdate {
  stopId: string;
  stopSequence: number;
  arrival?: {
    time: number;
    delay?: number;
    uncertainty?: number;
  };
  departure?: {
    time: number;
    delay?: number;
    uncertainty?: number;
  };
  scheduleRelationship: 'SCHEDULED' | 'SKIPPED' | 'NO_DATA';
}

export interface TripUpdate {
  tripId: string;
  routeId: string;
  startTime?: string;
  startDate?: string;
  scheduleRelationship: 'SCHEDULED' | 'ADDED' | 'UNSCHEDULED' | 'CANCELED' | 'DUPLICATED' | 'DELETED';
  vehicleId?: string;
  stopTimeUpdates: StopTimeUpdate[];
  timestamp: number;
  delay?: number;
}

export interface StationArrival {
  tripId: string;
  routeId: string;
  vehicleId?: string;
  stopId: string;
  stopSequence: number;
  arrivalTime: number;
  arrivalDelay?: number;
  direction?: string;
}
