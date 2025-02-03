import { deviceScanner } from './utils/deviceScanner';
import { powerManager } from './utils/powerManager';
import { networkMonitor } from './utils/networkMonitor';

export class NetworkScanner {
  constructor() {
    this.deviceScanner = deviceScanner;
    this.powerManager = powerManager;
    this.networkMonitor = networkMonitor;
  }

  async scanNetwork(ipRange) {
    try {
      const devices = [];
      const [baseIp, subnet] = ipRange.split('/');
      const baseIpParts = baseIp.split('.');
      const hosts = Math.pow(2, 32 - parseInt(subnet));
      
      // Ping sweep for faster initial discovery
      const activeIps = [];
      for (let i = 1; i < hosts - 1; i++) {
        const ip = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i}`;
        const isReachable = await this.deviceScanner.pingHost(ip);
        if (isReachable) {
          activeIps.push(ip);
        }
      }

      // Detailed scan for active IPs
      for (const ip of activeIps) {
        const mac = await this.deviceScanner.getMacFromArp(ip);
        const openPorts = await this.deviceScanner.scanPorts(ip);
        
        if (openPorts.length > 0 || mac) {
          devices.push({
            ip,
            mac: mac || 'Unknown',
            status: 'online',
            name: `Device (${ip})`,
            lastSeen: new Date().toISOString(),
            openPorts
          });
        }
      }

      return devices;
    } catch (error) {
      console.error('Network scan error:', error);
      throw error;
    }
  }

  async wakeOnLan(macAddress) {
    return this.powerManager.wakeOnLan(macAddress);
  }

  async shutdownDevice(ip, username, password) {
    return this.powerManager.shutdownDevice(ip, username, password);
  }

  async getDeviceMetrics(ip) {
    return this.networkMonitor.getDeviceMetrics(ip);
  }
}

export const networkScanner = new NetworkScanner();