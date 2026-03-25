import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '@core/services/map.service';
import { HttpClient } from '@angular/common/http';
import { interval, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-map-viewer',
  imports: [CommonModule],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.scss'
})
export class MapViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private destroy$ = new Subject<void>();

  constructor(
    private mapService: MapService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Fetch train data every 1 second for near real-time updates
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchTrainPositions();
      });

    // Initial fetch
    this.fetchTrainPositions();
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap('map', {
      center: [-77.0365, 38.9072], // DC coordinates
      zoom: 12
    });

    // Load static metro layers from GeoJSON
    this.mapService.addMetroLinesLayer();
    this.mapService.addMetroStationsLayer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mapService.destroy();
  }

  private fetchTrainPositions(): void {
    this.http.get<any>('/api/trains')
      .subscribe({
        next: (response) => {
          if (response.status === 'success' && response.data) {
            this.mapService.updateTrainPositions(response.data);
          }
        },
        error: (error) => {
          console.error('Error fetching train positions:', error);
        }
      });
  }
}
