import { Injectable, signal } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { Zoom, Attribution, defaults as defaultControls } from 'ol/control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Circle, Fill, Stroke, Text } from 'ol/style';
import { TrainPosition, MapConfig } from '@models/train.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: Map | null = null;
  private trainLayer: VectorLayer<VectorSource> | null = null;
  private trainSource: VectorSource | null = null;
  private trains = signal<TrainPosition[]>([]);

  initializeMap(target: string, config?: MapConfig): Map {
    const defaultConfig: MapConfig = {
      center: [-77.0365, 38.9072], // DC coordinates
      zoom: 12,
      projection: 'EPSG:3857'
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Create vector source for trains
    this.trainSource = new VectorSource();
    
    // Create vector layer for trains
    this.trainLayer = new VectorLayer({
      source: this.trainSource,
      style: (feature) => {
        const line = feature.get('line');
        const color = this.getLineColor(line);
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color: color
            }),
            stroke: new Stroke({
              color: 'white',
              width: 2
            })
          })
        });
      }
    });

    this.map = new Map({
      target: target,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            attributions: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          })
        }),
        this.trainLayer
      ],
      view: new View({
        center: fromLonLat(finalConfig.center),
        zoom: finalConfig.zoom
      }),
      controls: defaultControls({
        zoom: false,
        attribution: false,
        rotate: false
      }).extend([
        new Zoom({
          target: 'zoom-target'
        }),
        new Attribution({
          target: 'attribution-target'
        })
      ])
    });

    return this.map;
  }

  getMap(): Map | null {
    return this.map;
  }

  getTrains() {
    return this.trains.asReadonly();
  }

  updateTrainPositions(trainPositions: TrainPosition[]): void {
    this.trains.set(trainPositions);
    
    if (!this.trainSource) return;

    // Clear existing train features
    this.trainSource.clear();

    // Add new train features
    trainPositions.forEach(train => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([train.longitude, train.latitude])),
        train: train
      });
      
      feature.set('line', train.line);
      feature.set('id', train.id);
      
      this.trainSource!.addFeature(feature);
    });
  }

  private getLineColor(line: string): string {
    const colors: Record<string, string> = {
      'RL': '#BE133C', // Red Line
      'OR': '#F97A00', // Orange Line
      'BL': '#0050A4', // Blue Line
      'SV': '#A0A0A0', // Silver Line - proper silver/gray
      'YL': '#F8D400', // Yellow Line
      'GR': '#00A85C'  // Green Line
    };
    return colors[line] || '#666666';
  }

  setLayerVisibility(layerId: string, visible: boolean): void {
    if (layerId === 'trains' && this.trainLayer) {
      this.trainLayer.setVisible(visible);
    }
  }

  destroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
    this.trainSource = null;
    this.trainLayer = null;
  }
}
