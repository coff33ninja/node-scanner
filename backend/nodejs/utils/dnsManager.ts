import dns from 'dns';
import { promisify } from 'util';

const resolveDns = promisify(dns.resolve);
const reverse = promisify(dns.reverse);

interface DNSRecord {
  name: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  value: string;
  ttl?: number;
}

interface DNSHealth {
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastCheck: Date;
  issues: string[];
}

export class DNSManager {
  async validateRecord(record: DNSRecord): Promise<boolean> {
    try {
      switch (record.type) {
        case 'A':
          // Validate IPv4 format
          return /^(\d{1,3}\.){3}\d{1,3}$/.test(record.value);
        case 'AAAA':
          // Basic IPv6 format validation
          return /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(record.value);
        case 'CNAME':
          // Validate domain name format
          return /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(record.value);
        default:
          return true;
      }
    } catch {
      return false;
    }
  }

  async checkHealth(domain: string): Promise<DNSHealth> {
    const startTime = Date.now();
    const issues: string[] = [];

    try {
      await resolveDns(domain);
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime > 1000 ? 'warning' : 'healthy',
        responseTime,
        lastCheck: new Date(),
        issues
      };
    } catch (error) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        issues: [(error as Error).message]
      };
    }
  }

  async reverseLookup(ip: string): Promise<string[]> {
    try {
      return await reverse(ip);
    } catch {
      return [];
    }
  }
}

export const dnsManager = new DNSManager();