export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
  source: LayerSource;
  zIndex?: number;
}

export enum LayerType {
  TILE = 'tile',
  VECTOR = 'vector',
  IMAGE = 'image'
}

export interface LayerSource {
  type: string;
  url?: string;
  params?: Record<string, any>;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  projection?: string;
}
