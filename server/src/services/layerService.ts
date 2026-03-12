import { Layer, CreateLayerDto, UpdateLayerDto } from '../models/layer.model';
import { v4 as uuidv4 } from 'uuid';

class LayerService {
  private layers: Layer[] = [];

  getAllLayers(): Layer[] {
    return this.layers;
  }

  getLayerById(id: string): Layer | undefined {
    return this.layers.find(layer => layer.id === id);
  }

  createLayer(dto: CreateLayerDto): Layer {
    const newLayer: Layer = {
      id: uuidv4(),
      name: dto.name,
      type: dto.type,
      source: dto.source,
      visible: dto.visible ?? true,
      opacity: dto.opacity ?? 1,
      zIndex: dto.zIndex,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.layers.push(newLayer);
    return newLayer;
  }

  updateLayer(id: string, dto: UpdateLayerDto): Layer | null {
    const layerIndex = this.layers.findIndex(layer => layer.id === id);
    
    if (layerIndex === -1) {
      return null;
    }

    this.layers[layerIndex] = {
      ...this.layers[layerIndex],
      ...dto,
      updatedAt: new Date()
    };

    return this.layers[layerIndex];
  }

  deleteLayer(id: string): boolean {
    const initialLength = this.layers.length;
    this.layers = this.layers.filter(layer => layer.id !== id);
    return this.layers.length < initialLength;
  }
}

export default new LayerService();
