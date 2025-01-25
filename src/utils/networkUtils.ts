// Network scanning and WOL utilities
export interface NetworkDevice {
  name: string;
  ip: string;
  mac: string;
  vendor?: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

export interface ScanOptions {
  ipRange: string;
  timeout?: number;
  ports?: number[];
}

// Example implementation of how frontend would call these utilities
export const scanNetwork = async (options: ScanOptions): Promise<NetworkDevice[]> => {
  console.log('Scanning network with options:', options);
  // In a real implementation, this would call your backend API
  return [];
};

export const wakeDevice = async (mac: string): Promise<boolean> => {
  console.log('Sending WOL packet to:', mac);
  // In a real implementation, this would call your backend API
  return true;
};

export const shutdownDevice = async (ip: string): Promise<boolean> => {
  console.log('Sending shutdown command to:', ip);
  // In a real implementation, this would call your backend API
  return true;
};