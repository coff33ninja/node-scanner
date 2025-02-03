import { exec } from 'child_process';
import { promisify } from 'util';
import { networkInterfaces } from 'os';

const execAsync = promisify(exec);

export class DeviceScanner {
  async getDefaultInterface() {
    const interfaces = networkInterfaces();
    for (const [name, addrs] of Object.entries(interfaces)) {
      const ipv4 = addrs.find(addr => addr.family === 'IPv4' && !addr.internal);
      if (ipv4) return name;
    }
    return null;
  }

  async scanPorts(ip: string, startPort = 1, endPort = 1024): Promise<number[]> {
    const openPorts: number[] = [];
    const scanPromises = [];

    for (let port = startPort; port <= endPort; port++) {
      scanPromises.push(
        new Promise<void>(resolve => {
          const socket = new (require('net')).Socket();
          socket.setTimeout(500);
          
          socket.on('connect', () => {
            openPorts.push(port);
            socket.destroy();
            resolve();
          });
          
          socket.on('error', () => {
            socket.destroy();
            resolve();
          });
          
          socket.on('timeout', () => {
            socket.destroy();
            resolve();
          });
          
          socket.connect(port, ip);
        })
      );
    }

    await Promise.all(scanPromises);
    return openPorts;
  }

  async getMacFromArp(ip: string): Promise<string | null> {
    try {
      const cmd = process.platform === 'win32' 
        ? `arp -a ${ip}` 
        : `arp -n ${ip}`;

      const { stdout } = await execAsync(cmd);
      const match = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
      return match ? match[0] : null;
    } catch (error) {
      console.error('Error getting MAC:', error);
      return null;
    }
  }
}

export const deviceScanner = new DeviceScanner();