import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { StationArrival, StationArrivalsResponse } from '@models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly API_URL = '/api/trips';
  private readonly POLL_INTERVAL = 30000; // 30 seconds

  private arrivals = signal<Map<string, StationArrival[]>>(new Map());
  private pollingSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  startPolling(): void {
    this.stopPolling();
    this.pollingSubscription = interval(this.POLL_INTERVAL).subscribe(() => {
      this.fetchTrips();
    });
    // Initial fetch
    this.fetchTrips();
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
  }

  private fetchTrips(): void {
    this.http.get(`${this.API_URL}`).subscribe({
      next: () => {
        // Data fetched from WMATA and cached on backend
        this.refreshAllArrivals();
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
      }
    });
  }

  private refreshAllArrivals(): void {
    // Refresh all cached stop IDs
    const currentArrivals = this.arrivals();
    const stopIds = Array.from(currentArrivals.keys());
    
    for (const stopId of stopIds) {
      this.fetchArrivalsForStation(stopId);
    }
  }

  fetchArrivalsForStation(stopId: string): void {
    this.http.get<StationArrivalsResponse>(`${this.API_URL}/station/${stopId}`).subscribe({
      next: (response) => {
        this.arrivals.update(map => {
          const newMap = new Map(map);
          newMap.set(stopId, response.data);
          return newMap;
        });
      },
      error: (error) => {
        console.error(`Error fetching arrivals for station ${stopId}:`, error);
      }
    });
  }

  getArrivalsForStation(stopId: string): StationArrival[] {
    return this.arrivals().get(stopId) || [];
  }

  formatArrivalTime(timestamp: number): string {
    const now = Date.now() / 1000;
    const diffSeconds = timestamp - now;
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 1) {
      return 'Arriving';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}
