import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-layer-toggle',
  templateUrl: './layer-toggle.component.html',
  styleUrls: ['./layer-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LayerToggleComponent {
  viewMode = signal<'layer' | 'line'>('layer');
  enabledLines;

  layers = [
    { id: 'trains', name: 'Metro Trains', visible: true },
    { id: 'metro-lines', name: 'Metro Lines', visible: true },
    { id: 'metro-stations', name: 'Metro Stations', visible: true }
  ];

  lines = [
    { code: 'RL', name: 'Red', color: '#BE133C' },
    { code: 'OR', name: 'Orange', color: '#F97A00' },
    { code: 'BL', name: 'Blue', color: '#0050A4' },
    { code: 'SV', name: 'Silver', color: '#A0A0A0' },
    { code: 'YL', name: 'Yellow', color: '#F8D400' },
    { code: 'GR', name: 'Green', color: '#00A85C' }
  ];

  constructor(private mapService: MapService) {
    this.enabledLines = this.mapService.getEnabledLines();
  }

  setViewMode(mode: 'layer' | 'line'): void {
    this.viewMode.set(mode);
  }

  toggleLayer(layerId: string): void {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
      this.mapService.setLayerVisibility(layerId, layer.visible);
    }
  }

  toggleLine(lineCode: string): void {
    const isEnabled = this.enabledLines().has(lineCode);
    this.mapService.setLineEnabled(lineCode, !isEnabled);
  }
}
