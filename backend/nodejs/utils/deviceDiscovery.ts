import { networkInterfaces } from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      const cmd = process.platform === 'win32'
        ? `ping -n 1 -w 1000 ${ip}`
        : `ping -c 1 -W 1 ${ip}`;
      
      await execAsync(cmd);
      return true;
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
      const { stdout } = await execAsync(`nslookup ${ip}`);
      const nameMatch = stdout.match(/name\s*=\s*([^\s]+)/i);
      return nameMatch ? nameMatch[1] : null;
    } catch {
      return null;
    }
  }
}

export const deviceDiscovery = new DeviceDiscovery();