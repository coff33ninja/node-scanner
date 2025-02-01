import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';
import { supabase } from '@/integrations/supabase/client';

export interface NetworkDevice {
  id?: string;
  name: string;
  ip: string;
  mac: string;
  vendor?: string;
  status: 'online' | 'offline';
  lastSeen: string;
  hostname?: string;
  openPorts?: number[];
}

export interface ScanOptions {
  ipRange: string;
  timeout?: number;
  ports?: number[];
}

export const scanNetwork = async (options: ScanOptions): Promise<NetworkDevice[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.NETWORK_SCAN, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify(options),
    });
    
    if (!response.ok) {
      throw new Error('Network scan failed');
    }
    
    const devices = await response.json();
    
    // Store devices in database
    for (const device of devices) {
      const { data: existingDevice } = await supabase
        .from('devices')
        .select()
        .eq('mac_address', device.mac)
        .single();

      if (existingDevice) {
        // Update existing device
        await supabase
          .from('devices')
          .update({
            name: device.name,
            ip_address: device.ip,
            last_scan: new Date().toISOString(),
            vendor: device.vendor,
            hostname: device.hostname,
            open_ports: device.openPorts || []
          })
          .eq('mac_address', device.mac);
      } else {
        // Insert new device
        await supabase
          .from('devices')
          .insert({
            name: device.name,
            mac_address: device.mac,
            ip_address: device.ip,
            last_scan: new Date().toISOString(),
            vendor: device.vendor,
            hostname: device.hostname,
            open_ports: device.openPorts || []
          });
      }
    }
    
    return devices;
  } catch (error) {
    console.error('Error scanning network:', error);
    throw error;
  }
};

export const wakeDevice = async (mac: string): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.NETWORK_WAKE, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
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
    const response = await fetch(API_ENDPOINTS.NETWORK_SHUTDOWN, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
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