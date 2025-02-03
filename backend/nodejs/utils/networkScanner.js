import { deviceDiscovery } from './deviceDiscovery';
import { portScanner } from './portScanner';
import { networkMetrics } from './networkMetrics';
import { powerManager } from './powerManager';
import { securityScanner } from './securityScanner';
import { dnsManager } from './dnsManager';
import { createSNMPCollector } from './snmpCollector';

export class NetworkScanner {
  constructor() {
    this.deviceDiscovery = deviceDiscovery;
    this.portScanner = portScanner;
    this.networkMetrics = networkMetrics;
    this.powerManager = powerManager;
    this.securityScanner = securityScanner;
    this.dnsManager = dnsManager;
  }

  async scanNetwork(ipRange) {
    try {
      if (!ipRange) {
        ipRange = await this.deviceDiscovery.getLocalNetwork();
      }
      return await this.deviceDiscovery.scanRange(ipRange);
    } catch (error) {
      console.error('Network scan error:', error);
      throw error;
    }
  }

  async scanDevice(ip) {
    return await this.deviceDiscovery.scanDevice(ip);
  }

  async getDeviceMetrics(ip) {
    return await this.networkMetrics.collectMetrics(ip);
  }

  async scanSecurity(ip) {
    return await this.securityScanner.scanDevice(ip);
  }

  async checkDNSHealth(domain) {
    return await this.dnsManager.checkHealth(domain);
  }

  async wakeOnLan(macAddress) {
    return await this.powerManager.wakeOnLan(macAddress);
  }

  async shutdownDevice(ip, username, password) {
    return await this.powerManager.shutdownDevice(ip, username, password);
  }
}

export const networkScanner = new NetworkScanner();