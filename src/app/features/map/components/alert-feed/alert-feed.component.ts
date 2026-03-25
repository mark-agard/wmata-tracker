import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '@core/services/alert.service';
import { ServiceAlert } from '@models/alert.model';

@Component({
  selector: 'app-alert-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-feed.component.html',
  styleUrls: ['./alert-feed.component.scss']
})
export class AlertFeedComponent implements OnInit, OnDestroy {
  alerts;
  lastUpdate;
  isFresh;
  isCollapsed = signal(false);
  expandedAlertId = signal<string | null>(null);

  constructor(private alertService: AlertService) {
    this.alerts = this.alertService.getAlerts();
    this.lastUpdate = this.alertService.getLastUpdate();
    this.isFresh = this.alertService.getIsFresh();
  }

  ngOnInit(): void {
    this.alertService.startPolling(30000);
  }

  ngOnDestroy(): void {
    this.alertService.stopPolling();
  }

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  toggleAlert(id: string): void {
    this.expandedAlertId.update(current => current === id ? null : id);
  }

  getLineColor(line: string): string {
    const colors: Record<string, string> = {
      'RL': '#BE133C',
      'OR': '#F97A00',
      'BL': '#0050A4',
      'SV': '#A0A0A0',
      'YL': '#F8D400',
      'GR': '#00A85C'
    };
    return colors[line] || '#666666';
  }

  getEffectClass(effect: string): string {
    const effectClasses: Record<string, string> = {
      'NO_SERVICE': 'effect-critical',
      'SIGNIFICANT_DELAYS': 'effect-warning',
      'REDUCED_SERVICE': 'effect-warning',
      'DETOUR': 'warning',
      'MODIFIED_SERVICE': 'info',
      'ACCESSIBILITY_ISSUE': 'info'
    };
    return effectClasses[effect] || 'info';
  }

  formatEffect(effect: string): string {
    return effect.replace(/_/g, ' ').toLowerCase();
  }

  refresh(): void {
    this.alertService.fetchAlerts();
  }
}
