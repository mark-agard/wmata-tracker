import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ServiceAlert } from '@models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts = signal<ServiceAlert[]>([]);
  private lastUpdate = signal<Date | null>(null);
  private isFresh = signal<boolean>(false);
  private pollingSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  getAlerts() {
    return this.alerts.asReadonly();
  }

  getLastUpdate() {
    return this.lastUpdate.asReadonly();
  }

  getIsFresh() {
    return this.isFresh.asReadonly();
  }

  fetchAlerts(): void {
    this.http.get<{ status: string; data: ServiceAlert[]; lastUpdate: string; isFresh: boolean }>('/api/alerts')
      .subscribe({
        next: (response) => {
          if (response.status === 'success' && response.data) {
            this.alerts.set(response.data);
            this.lastUpdate.set(response.lastUpdate ? new Date(response.lastUpdate) : null);
            this.isFresh.set(response.isFresh);
          }
        },
        error: (error) => {
          console.error('Error fetching alerts:', error);
        }
      });
  }

  startPolling(intervalMs: number = 30000): void {
    this.fetchAlerts();
    this.pollingSubscription = interval(intervalMs).subscribe(() => {
      this.fetchAlerts();
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
}
