import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '@core/services/trip.service';
import { StationArrival } from '@models/trip.model';

@Component({
  selector: 'app-station-arrivals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './station-arrivals.component.html',
  styleUrls: ['./station-arrivals.component.scss']
})
export class StationArrivalsComponent implements OnInit, OnDestroy {
  @Input() stationId: string | null = null;
  @Input() stationName: string | null = null;
  isOpen = signal(false);
  arrivals = signal<StationArrival[]>([]);

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.tripService.startPolling();
  }

  ngOnDestroy(): void {
    this.tripService.stopPolling();
  }

  openStation(stationId: string, stationName: string): void {
    this.stationId = stationId;
    this.stationName = stationName;
    this.isOpen.set(true);
    this.refreshArrivals();
  }

  close(): void {
    this.isOpen.set(false);
  }

  refreshArrivals(): void {
    if (this.stationId) {
      this.tripService.fetchArrivalsForStation(this.stationId);
      setTimeout(() => {
        this.arrivals.set(this.tripService.getArrivalsForStation(this.stationId!));
      }, 100);
    }
  }

  getLineColor(routeId: string): string {
    const colors: Record<string, string> = {
      'RL': '#BE133C',
      'OR': '#F97A00',
      'BL': '#0050A4',
      'SV': '#A0A0A0',
      'YL': '#F8D400',
      'GR': '#00A85C'
    };
    return colors[routeId] || '#666666';
  }

  formatArrivalTime(timestamp: number): string {
    return this.tripService.formatArrivalTime(timestamp);
  }
}
