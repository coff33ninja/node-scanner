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
    console.log('Starting network scan with options:', options);
    
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
    console.log('Scanned devices:', devices);
    
    // Store devices in database
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.warn('No user ID found, skipping device storage');
      return devices;
    }

    for (const device of devices) {
      if (!device.mac) {
        console.warn('Device missing MAC address:', device);
        continue;
      }

      const deviceData = {
        name: device.name || `Device (${device.ip})`,
        mac_address: device.mac,
        ip_address: device.ip,
        user_id: userId,
        last_scan: new Date().toISOString(),
        vendor: device.vendor,
        hostname: device.hostname,
        open_ports: device.openPorts || []
      };

      console.log('Storing device data:', deviceData);

      const { data: existingDevice, error: queryError } = await supabase
        .from('devices')
        .select()
        .eq('mac_address', device.mac)
        .eq('user_id', userId)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        console.error('Error checking existing device:', queryError);
        continue;
      }

      if (existingDevice) {
        const { error: updateError } = await supabase
          .from('devices')
          .update(deviceData)
          .eq('id', existingDevice.id);

        if (updateError) {
          console.error('Error updating device:', updateError);
        }
      } else {
        const { error: insertError } = await supabase
          .from('devices')
          .insert(deviceData);

        if (insertError) {
          console.error('Error inserting device:', insertError);
        }
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