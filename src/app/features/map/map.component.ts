import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { LayerPanelComponent } from './components/layer-panel/layer-panel.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapViewerComponent, LayerPanelComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {}
