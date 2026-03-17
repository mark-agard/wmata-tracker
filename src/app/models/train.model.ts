export interface TrainPosition {
  id: string;
  line: string;
  latitude: number;
  longitude: number;
  heading?: number;
  timestamp: string;
  speed?: number;
  currentStatus?: string;
  stopId?: string;
  congestionLevel?: string;
  occupancyStatus?: string;
  occupancyPercentage?: number;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  projection?: string;
}
