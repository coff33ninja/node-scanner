import { logger } from '../utils/logger';

export interface AuditEvent {
  type: 'auth' | 'node' | 'security' | 'system';
  action: string;
  userId?: string;
  nodeId?: string;
  details: Record<string, any>;
  timestamp: string;
}

class AuditLogger {
  private events: AuditEvent[] = [];

  log(event: Omit<AuditEvent, 'timestamp'>) {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    this.events.push(auditEvent);
    logger.info(`[AUDIT] ${auditEvent.type.toUpperCase()}: ${auditEvent.action}`, auditEvent);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  getEvents(filters?: Partial<AuditEvent>): AuditEvent[] {
    return this.events.filter(event => {
      if (!filters) return true;
      return Object.entries(filters).every(([key, value]) => 
        event[key as keyof AuditEvent] === value
      );
    });
  }
}

export const auditLogger = new AuditLogger();
