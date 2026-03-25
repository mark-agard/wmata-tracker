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

export interface StationArrivalsResponse {
  status: string;
  data: StationArrival[];
  stopId: string;
  lastUpdate: string;
}
