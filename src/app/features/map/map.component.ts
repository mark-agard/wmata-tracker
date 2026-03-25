import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { LayerToggleComponent } from './components/layer-toggle/layer-toggle.component';
import { AlertFeedComponent } from './components/alert-feed/alert-feed.component';
import { StationArrivalsComponent } from './components/station-arrivals/station-arrivals.component';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapViewerComponent, LayerToggleComponent, AlertFeedComponent, StationArrivalsComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @ViewChild(StationArrivalsComponent) stationArrivals!: StationArrivalsComponent;

  constructor(private mapService: MapService) {}

  onStationClick(stationId: string, stationName: string): void {
    this.stationArrivals?.openStation(stationId, stationName);
  }
}
