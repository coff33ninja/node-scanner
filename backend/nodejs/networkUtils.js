import { deviceDiscovery } from './utils/deviceDiscovery';
import { portScanner } from './utils/portScanner';
import { networkMetrics } from './utils/networkMetrics';
import { powerManager } from './utils/powerManager';

export class NetworkScanner {
  constructor() {
    this.deviceDiscovery = deviceDiscovery;
    this.portScanner = portScanner;
    this.networkMetrics = networkMetrics;
    this.powerManager = powerManager;
  }

  async scanNetwork(ipRange) {
    try {
      if (!ipRange) {
        ipRange = await this.deviceDiscovery.getLocalNetwork();
      }

      const [baseIp, subnet] = ipRange.split('/');
      const baseIpParts = baseIp.split('.');
      const hosts = Math.pow(2, 32 - parseInt(subnet));
      
      const devices = [];
      
      // Scan network in parallel with batching
      const batchSize = 10;
      for (let i = 0; i < hosts; i += batchSize) {
        const batch = Array.from({ length: Math.min(batchSize, hosts - i) }, (_, j) => {
          const ip = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i + j + 1}`;
          return this.scanDevice(ip);
        });
        
        const results = await Promise.all(batch);
        devices.push(...results.filter(Boolean));
      }

      return devices;
    } catch (error) {
      console.error('Network scan error:', error);
      throw error;
    }
  }

  async scanDevice(ip) {
    const isReachable = await this.deviceDiscovery.pingHost(ip);
    if (!isReachable) return null;

    const [mac, hostname, openPorts] = await Promise.all([
      this.deviceDiscovery.getMacAddress(ip),
      this.deviceDiscovery.getHostname(ip),
      this.portScanner.scanCommonPorts(ip)
    ]);

    if (!mac && openPorts.length === 0) return null;

    return {
      ip,
      mac: mac || 'Unknown',
      name: hostname || `Device (${ip})`,
      status: 'online',
      lastSeen: new Date().toISOString(),
      openPorts
    };
  }

  async getDeviceMetrics(ip) {
    return this.networkMetrics.collectMetrics(ip);
  }

  async wakeOnLan(macAddress) {
    return this.powerManager.wakeOnLan(macAddress);
  }

  async shutdownDevice(ip, username, password) {
    return this.powerManager.shutdownDevice(ip, username, password);
  }
}

export const networkScanner = new NetworkScanner();