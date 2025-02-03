import { exec } from 'child_process';
import { promisify } from 'util';
import { portScanner } from './portScanner';

const execAsync = promisify(exec);

interface VulnerabilityResult {
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

interface SecurityReport {
  openPorts: number[];
  vulnerabilities: VulnerabilityResult[];
  recommendations: string[];
  lastScan: Date;
}

export class SecurityScanner {
  async scanDevice(ip: string): Promise<SecurityReport> {
    const openPorts = await portScanner.scanCommonPorts(ip);
    const vulnerabilities: VulnerabilityResult[] = [];
    const recommendations: string[] = [];

    // Check for common vulnerabilities based on open ports
    for (const port of openPorts) {
      switch (port) {
        case 21:
          vulnerabilities.push({
            severity: 'high',
            description: 'FTP service detected - Plain text authentication',
            recommendation: 'Consider using SFTP (port 22) instead'
          });
          break;
        case 23:
          vulnerabilities.push({
            severity: 'high',
            description: 'Telnet service detected - Unencrypted remote access',
            recommendation: 'Replace with SSH (port 22)'
          });
          break;
        case 80:
          vulnerabilities.push({
            severity: 'medium',
            description: 'HTTP service detected - Unencrypted web traffic',
            recommendation: 'Consider implementing HTTPS'
          });
          break;
      }
    }

    // Add general security recommendations
    if (openPorts.length > 10) {
      recommendations.push('Consider reducing the number of open ports');
    }

    if (!openPorts.includes(443) && openPorts.includes(80)) {
      recommendations.push('Implement HTTPS for secure web traffic');
    }

    return {
      openPorts,
      vulnerabilities,
      recommendations,
      lastScan: new Date()
    };
  }
}

export const securityScanner = new SecurityScanner();