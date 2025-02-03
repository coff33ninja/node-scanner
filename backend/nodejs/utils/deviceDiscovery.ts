import { networkInterfaces } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import dns from 'dns';
import { ping } from 'net-ping';

const execAsync = promisify(exec);
const dnsResolve = promisify(dns.reverse);

export class DeviceDiscovery {
  async getLocalNetwork(): Promise<string> {
    const interfaces = networkInterfaces();
    for (const [name, nets] of Object.entries(interfaces)) {
      for (const net of nets || []) {
        if (!net.internal && net.family === 'IPv4') {
          const parts = net.address.split('.');
          return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
        }
      }
    }
    throw new Error('No suitable network interface found');
  }

  async pingHost(ip: string): Promise<boolean> {
    try {
      const session = ping.createSession();
      return new Promise((resolve) => {
        session.pingHost(ip, (error) => {
          session.close();
          resolve(!error);
        });
      });
    } catch {
      return false;
    }
  }

  async getMacAddress(ip: string): Promise<string | null> {
    try {
      const cmd = process.platform === 'win32'
        ? `arp -a ${ip}`
        : `arp -n ${ip}`;
      
      const { stdout } = await execAsync(cmd);
      const macMatch = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
      return macMatch ? macMatch[0] : null;
    } catch {
      return null;
    }
  }

  async getHostname(ip: string): Promise<string | null> {
    try {
      const hostnames = await dnsResolve(ip);
      return hostnames[0] || null;
    } catch {
      return null;
    }
  }

  async getVendor(mac: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.macvendors.com/${mac}`);
      if (response.ok) {
        return await response.text();
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const deviceDiscovery = new DeviceDiscovery();