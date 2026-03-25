import { ServiceAlert, AlertCause, AlertEffect } from '../models/alert.model';
import { FeedMessage } from '../generated/gtfs-realtime';

class AlertService {
  private alerts: ServiceAlert[] = [];
  private lastUpdate: Date | null = null;

  private extractLineFromRoute(routeId: string): string {
    const lineMap: Record<string, string> = {
      'RED': 'RL',
      'ORANGE': 'OR',
      'BLUE': 'BL',
      'SILVER': 'SV',
      'YELLOW': 'YL',
      'GREEN': 'GR',
      'NR': 'NR'
    };

    return lineMap[routeId] || routeId;
  }

  private formatCause(cause: number): string {
    const causes: Record<number, string> = {
      1: 'UNKNOWN_CAUSE',
      2: 'OTHER_CAUSE',
      3: 'TECHNICAL_PROBLEM',
      4: 'STRIKE',
      5: 'DEMONSTRATION',
      6: 'ACCIDENT',
      7: 'HOLIDAY',
      8: 'WEATHER',
      9: 'MAINTENANCE',
      10: 'CONSTRUCTION',
      11: 'POLICE_ACTIVITY',
      12: 'MEDICAL_EMERGENCY'
    };

    return causes[cause] || 'UNKNOWN_CAUSE';
  }

  private formatEffect(effect: number): string {
    const effects: Record<number, string> = {
      1: 'NO_SERVICE',
      2: 'REDUCED_SERVICE',
      3: 'SIGNIFICANT_DELAYS',
      4: 'DETOUR',
      5: 'ADDITIONAL_SERVICE',
      6: 'MODIFIED_SERVICE',
      7: 'STOP_MOVED',
      8: 'OTHER_EFFECT',
      9: 'UNKNOWN_EFFECT',
      10: 'NO_EFFECT',
      11: 'ACCESSIBILITY_ISSUE'
    };

    return effects[effect] || 'UNKNOWN_EFFECT';
  }

  private getTextFromTranslatedString(translatedString: any): string {
    if (!translatedString || !translatedString.translation || translatedString.translation.length === 0) {
      return '';
    }
    return translatedString.translation[0].text || '';
  }

  private isAlertActive(alert: any): boolean {
    const now = Date.now();

    if (!alert.activePeriod || alert.activePeriod.length === 0) {
      return true;
    }

    return alert.activePeriod.some((period: any) => {
      const start = period.start ? Number(period.start) * 1000 : 0;
      const end = period.end ? Number(period.end) * 1000 : Infinity;
      return now >= start && now <= end;
    });
  }

  async fetchAlerts(): Promise<ServiceAlert[]> {
    try {
      const response = await fetch('https://api.wmata.com/gtfs/rail-gtfsrt-alerts.pb', {
        headers: {
          'api_key': process.env.WMATA_API_KEY || '',
          'Accept': 'application/x-protobuf'
        }
      });

      if (!response.ok) {
        throw new Error(`WMATA API error: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const feedMessage = FeedMessage.fromBinary(new Uint8Array(buffer));

      this.alerts = feedMessage.entity
        .filter(entity => entity.alert && this.isAlertActive(entity.alert))
        .map(entity => {
          const alert = entity.alert!;
          const affectedLines = alert.informedEntity
            ?.filter((e: any) => e.routeId)
            .map((e: any) => this.extractLineFromRoute(e.routeId!)) || [];

          const activePeriods = alert.activePeriod?.map((period: any) => ({
            start: period.start ? new Date(Number(period.start) * 1000).toISOString() : '',
            end: period.end ? new Date(Number(period.end) * 1000).toISOString() : undefined
          })) || [];

          return {
            id: entity.id,
            header: this.getTextFromTranslatedString(alert.headerText),
            description: this.getTextFromTranslatedString(alert.descriptionText),
            url: this.getTextFromTranslatedString(alert.url),
            affectedLines: [...new Set(affectedLines)],
            cause: this.formatCause(alert.cause || 0),
            effect: this.formatEffect(alert.effect || 0),
            activePeriods,
            timestamp: new Date().toISOString()
          };
        });

      this.lastUpdate = new Date();
      return this.alerts;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return this.alerts;
    }
  }

  getAlerts(): ServiceAlert[] {
    return this.alerts;
  }

  getLastUpdateTime(): Date | null {
    return this.lastUpdate;
  }

  isDataFresh(): boolean {
    if (!this.lastUpdate) return false;
    const now = new Date();
    const diffMs = now.getTime() - this.lastUpdate.getTime();
    return diffMs < 60000;
  }
}

export default new AlertService();
