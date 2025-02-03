import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface NetworkMetrics {
  bandwidth: {
    upload: number;
    download: number;
  };
  latency: number;
  packetsLost: number;
  timestamp: string;
}

export class NetworkMetricsCollector {
  async measureLatency(host: string): Promise<number> {
    try {
      const cmd = process.platform === 'win32'
        ? `ping -n 4 ${host}`
        : `ping -c 4 ${host}`;
      
      const { stdout } = await execAsync(cmd);
      const avgMatch = stdout.match(/Average = (\d+)ms|avg.*= .*\/([\d.]+)\//);
      return avgMatch ? parseFloat(avgMatch[1] || avgMatch[2]) : 0;
    } catch {
      return 0;
    }
  }

  async measurePacketLoss(host: string): Promise<number> {
    try {
      const cmd = process.platform === 'win32'
        ? `ping -n 10 ${host}`
        : `ping -c 10 ${host}`;
      
      const { stdout } = await execAsync(cmd);
      const lossMatch = stdout.match(/(\d+)%\s+packet\s+loss/);
      return lossMatch ? parseFloat(lossMatch[1]) : 0;
    } catch {
      return 0;
    }
  }

  async getBandwidthMetrics(host: string): Promise<{ upload: number; download: number }> {
    // In a real implementation, this would use iperf3 or similar tools
    // For now, return simulated values
    return {
      upload: Math.random() * 100,
      download: Math.random() * 100
    };
  }

  async collectMetrics(host: string): Promise<NetworkMetrics> {
    const [latency, packetsLost, bandwidth] = await Promise.all([
      this.measureLatency(host),
      this.measurePacketLoss(host),
      this.getBandwidthMetrics(host)
    ]);

    return {
      bandwidth,
      latency,
      packetsLost,
      timestamp: new Date().toISOString()
    };
  }
}

export const networkMetrics = new NetworkMetricsCollector();