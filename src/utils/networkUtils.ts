const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface NetworkDevice {
  id?: string;
  name: string;
  ip: string;
  mac: string;
  vendor?: string;
  status: 'online' | 'offline';
  lastSeen: string;
  group?: string;
}

export interface ScanOptions {
  ipRange: string;
  timeout?: number;
  ports?: number[];
}

export const scanNetwork = async (options: ScanOptions): Promise<NetworkDevice[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/network/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
    
    if (!response.ok) {
      throw new Error('Network scan failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scanning network:', error);
    throw error;
  }
};

export const wakeDevice = async (mac: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/network/wake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mac }),
    });
    
    if (!response.ok) {
      throw new Error('Wake-on-LAN failed');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error waking device:', error);
    throw error;
  }
};

export const shutdownDevice = async (ip: string, username?: string, password?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/network/shutdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip, username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Device shutdown failed');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error shutting down device:', error);
    throw error;
  }
};