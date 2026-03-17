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
import Overlay from 'ol/Overlay';
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
  private popupOverlay: Overlay | null = null;
  private popupElement: HTMLElement | null = null;

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

    // Create popup element
    this.popupElement = document.createElement('div');
    this.popupElement.className = 'train-popup';
    this.popupElement.style.cssText = `
      background: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 180px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      display: none;
    `;

    // Create popup overlay
    this.popupOverlay = new Overlay({
      element: this.popupElement,
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    this.map.addOverlay(this.popupOverlay);

    // Add hover detection for train features
    this.map.on('pointermove', (event) => {
      if (!this.map || !this.trainLayer) return;

      const pixel = this.map.getEventPixel(event.originalEvent);
      const feature = this.map.forEachFeatureAtPixel(pixel, (feature) => {
        return feature;
      }, {
        layerFilter: (layer) => layer === this.trainLayer
      });

      if (feature && this.popupElement && this.popupOverlay) {
        const train = feature.get('train') as TrainPosition;
        const line = feature.get('line') as string;
        const coordinates = (feature.getGeometry() as Point).getCoordinates();

        this.popupElement.innerHTML = `
          <div style="background: ${this.getLineColor(line)}; color: white; padding: 8px 12px; font-weight: 600; font-size: 13px;">
            ${line} Line
          </div>
          <div style="padding: 10px 12px; font-size: 12px; color: #444; line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #666;">Train ID</span>
              <span style="font-weight: 500;">${train.id}</span>
            </div>
            ${train.heading !== undefined ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #666;">Heading</span>
                <span>${train.heading}°</span>
              </div>` : ''}
            ${train.speed !== undefined ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #666;">Speed</span>
                <span>${train.speed} m/s</span>
              </div>` : ''}
            ${train.currentStatus ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #666;">Status</span>
                <span>${train.currentStatus}</span>
              </div>` : ''}
            ${train.stopId ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #666;">Stop</span>
                <span>${train.stopId}</span>
              </div>` : ''}
            ${train.congestionLevel ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #666;">Congestion</span>
                <span>${train.congestionLevel}</span>
              </div>` : ''}
            ${train.occupancyPercentage !== undefined ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Occupancy</span>
                <span>${train.occupancyPercentage}%</span>
              </div>` : ''}
            ${train.occupancyStatus && train.occupancyPercentage === undefined ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Occupancy</span>
                <span>${train.occupancyStatus}</span>
              </div>` : ''}
          </div>
        `;
        this.popupElement.style.display = 'block';
        this.popupOverlay.setPosition(coordinates);
      } else if (this.popupElement) {
        this.popupElement.style.display = 'none';
      }
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
    if (this.popupElement && this.popupElement.parentNode) {
      this.popupElement.parentNode.removeChild(this.popupElement);
    }
    this.popupElement = null;
    this.popupOverlay = null;
    
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
    this.trainSource = null;
    this.trainLayer = null;
  }
}
