export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
  source: LayerSource;
  zIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum LayerType {
  TILE = 'tile',
  VECTOR = 'vector',
  IMAGE = 'image',
  WMS = 'wms',
  WFS = 'wfs'
}

export interface LayerSource {
  type: string;
  url?: string;
  params?: Record<string, any>;
  attribution?: string;
}

export interface CreateLayerDto {
  name: string;
  type: LayerType;
  source: LayerSource;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
}

export interface UpdateLayerDto {
  name?: string;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
}
