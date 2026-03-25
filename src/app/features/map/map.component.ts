import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { LayerToggleComponent } from './components/layer-toggle/layer-toggle.component';
import { AlertFeedComponent } from './components/alert-feed/alert-feed.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapViewerComponent, LayerToggleComponent, AlertFeedComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {}
