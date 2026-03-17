export interface TrainPosition {
  id: string;
  line: string;
  latitude: number;
  longitude: number;
  heading?: number;
  timestamp: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  projection?: string;
}
