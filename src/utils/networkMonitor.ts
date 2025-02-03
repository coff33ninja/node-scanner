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

export interface DeviceMetrics extends NetworkMetrics {
  deviceId: string;
  status: 'online' | 'offline';
  metrics: {
    bandwidth: {
      upload: number;
      download: number;
    };
    latency: number;
  };
  openPorts: number[];
}

export const pollDeviceStatus = async (device: NetworkDevice): Promise<DeviceMetrics> => {
  try {
    const response = await fetch(`/api/network/status/${device.ip}`);
    const data = await response.json();
    
    return {
      deviceId: device.ip,
      status: data.isReachable ? 'online' : 'offline',
      bandwidth: {
        upload: data.bandwidth?.upload || 0,
        download: data.bandwidth?.download || 0,
      },
      latency: data.latency || 0,
      packetsLost: data.packetsLost || 0,
      timestamp: new Date().toISOString(),
      metrics: {
        bandwidth: {
          upload: data.bandwidth?.upload || 0,
          download: data.bandwidth?.download || 0,
        },
        latency: data.latency || 0
      },
      openPorts: data.openPorts || []
    };
  } catch (error) {
    console.error('Error polling device status:', error);
    return {
      deviceId: device.ip,
      status: 'offline',
      bandwidth: { upload: 0, download: 0 },
      latency: 0,
      packetsLost: 0,
      timestamp: new Date().toISOString(),
      metrics: {
        bandwidth: { upload: 0, download: 0 },
        latency: 0
      },
      openPorts: []
    };
  }
};