import { NetworkDevice } from './networkUtils';

export interface NetworkMetrics {
  bandwidth: {
    upload: number;
    download: number;
  };
  latency: number;
  packetsLost: number;
  timestamp: string;
  openPorts: number[];
}

export const monitorDevice = async (device: NetworkDevice): Promise<NetworkMetrics> => {
  try {
    const response = await fetch(`/api/network/metrics/${device.ip}`);
    const data = await response.json();
    
    return {
      bandwidth: {
        upload: data.bandwidth?.upload || 0,
        download: data.bandwidth?.download || 0,
      },
      latency: data.latency || 0,
      packetsLost: data.packetsLost || 0,
      timestamp: new Date().toISOString(),
      openPorts: data.openPorts || []
    };
  } catch (error) {
    console.error('Error monitoring device:', error);
    return {
      bandwidth: { upload: 0, download: 0 },
      latency: 0,
      packetsLost: 0,
      timestamp: new Date().toISOString(),
      openPorts: []
    };
  }
};

export const scheduleOperation = async (
  deviceId: string,
  operation: 'wake' | 'shutdown',
  schedule: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/network/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, operation, schedule })
    });
    return response.ok;
  } catch (error) {
    console.error('Error scheduling operation:', error);
    return false;
  }
};