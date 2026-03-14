import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@core/services/map.service';
import { Layer } from '@models/layer.model';

@Component({
  selector: 'app-layer-panel',
  imports: [CommonModule],
  templateUrl: './layer-panel.component.html',
  styleUrl: './layer-panel.component.scss'
})
export class LayerPanelComponent {
  layers = computed(() => this.mapService.getLayers()());

  constructor(private mapService: MapService) {}

  toggleVisibility(layerId: string): void {
    this.mapService.toggleLayerVisibility(layerId);
  }

  updateOpacity(layerId: string, event: Event): void {
    const opacity = parseFloat((event.target as HTMLInputElement).value);
    this.mapService.updateLayerOpacity(layerId, opacity);
  }

  removeLayer(layerId: string): void {
    this.mapService.removeLayer(layerId);
  }
}
