import { Component } from '@angular/core';
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
  layers = [
    { id: 'trains', name: 'Metro Trains', visible: true }
  ];

  constructor(private mapService: MapService) {}

  toggleLayer(layerId: string): void {
    const layer = this.layers.find(l => l.id === layerId);
    if (layer) {
      layer.visible = !layer.visible;
      this.mapService.setLayerVisibility(layerId, layer.visible);
    }
  }
}
