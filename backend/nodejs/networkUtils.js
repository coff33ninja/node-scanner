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
      const batchSize = 25; // Increased batch size for better performance
      
      for (let i = 0; i < hosts; i += batchSize) {
        const batch = Array.from({ length: Math.min(batchSize, hosts - i) }, (_, j) => {
          const ip = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i + j + 1}`;
          return this.scanDevice(ip);
        });
        
        const results = await Promise.all(batch);
        const validDevices = results.filter(Boolean);
        
        // Enhance device information with vendor data
        for (const device of validDevices) {
          if (device.mac) {
            device.vendor = await this.deviceDiscovery.getVendor(device.mac);
          }
        }
        
        devices.push(...validDevices);
      }

      return devices;
    } catch (error) {
      console.error('Network scan error:', error);
      throw error;
    }
  }

  async scanDevice(ip) {
    console.log(`Scanning device: ${ip}`);
    const isReachable = await this.deviceDiscovery.pingHost(ip);
    if (!isReachable) {
      console.log(`Device ${ip} is not reachable`);
      return null;
    }

    const [mac, hostname, openPorts] = await Promise.all([
      this.deviceDiscovery.getMacAddress(ip),
      this.deviceDiscovery.getHostname(ip),
      this.portScanner.scanCommonPorts(ip)
    ]);

    if (!mac && openPorts.length === 0) {
      console.log(`No MAC or open ports found for ${ip}`);
      return null;
    }

    const device = {
      ip,
      mac: mac || 'Unknown',
      name: hostname || `Device (${ip})`,
      status: 'online',
      lastSeen: new Date().toISOString(),
      openPorts,
      vendor: null // Will be populated later
    };

    console.log(`Device found:`, device);
    return device;
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
