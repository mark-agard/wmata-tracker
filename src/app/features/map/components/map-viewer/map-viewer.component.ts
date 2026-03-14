import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-map-viewer',
  imports: [CommonModule],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.scss'
})
export class MapViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map', {
      center: [-98.5795, 39.8283],
      zoom: 4
    });
  }

  ngOnDestroy(): void {
    this.mapService.destroy();
  }
}
