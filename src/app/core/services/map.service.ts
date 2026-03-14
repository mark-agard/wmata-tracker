import { Injectable, signal } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Layer, MapConfig } from '@models/layer.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: Map | null = null;
  private layers = signal<Layer[]>([]);

  initializeMap(target: string, config?: MapConfig): Map {
    const defaultConfig: MapConfig = {
      center: [-98.5795, 39.8283],
      zoom: 4,
      projection: 'EPSG:3857'
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.map = new Map({
      target: target,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(finalConfig.center),
        zoom: finalConfig.zoom
      })
    });

    return this.map;
  }

  getMap(): Map | null {
    return this.map;
  }

  getLayers() {
    return this.layers.asReadonly();
  }

  addLayer(layer: Layer): void {
    this.layers.update(layers => [...layers, layer]);
  }

  removeLayer(layerId: string): void {
    this.layers.update(layers => layers.filter(l => l.id !== layerId));
  }

  toggleLayerVisibility(layerId: string): void {
    this.layers.update(layers =>
      layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
    );
  }

  updateLayerOpacity(layerId: string, opacity: number): void {
    this.layers.update(layers =>
      layers.map(l => l.id === layerId ? { ...l, opacity } : l)
    );
  }

  destroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
  }
}
