import { exec } from 'child_process';
import { promisify } from 'util';
import { createSocket } from 'dgram';
import { networkInterfaces } from 'os';

const execAsync = promisify(exec);

class NetworkUtils {
  private createMagicPacket(macAddress: string): Buffer {
    // Remove any special characters from MAC address
    const mac = macAddress.replace(/[:-]/g, '');
    
    // Create buffer
    const buffer = Buffer.alloc(102);
    
    // First 6 bytes of 0xFF
    for (let i = 0; i < 6; i++) {
      buffer[i] = 0xFF;
    }
    
    // Repeat MAC address 16 times
    for (let i = 1; i <= 16; i++) {
      for (let j = 0; j < 6; j++) {
        buffer[i * 6 + j] = parseInt(mac.substr(j * 2, 2), 16);
      }
    }
    
    return buffer;
  }

  async wakeDevice(macAddress: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = createSocket('udp4');
      const magicPacket = this.createMagicPacket(macAddress);
      
      socket.bind(() => {
        socket.setBroadcast(true);
        socket.send(magicPacket, 0, magicPacket.length, 9, '255.255.255.255', (error) => {
          socket.close();
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  }

  async scanNetwork(): Promise<Array<{ ipAddress: string; macAddress: string; hostname?: string }>> {
    try {
      // Get local network interface
      const interfaces = networkInterfaces();
      let localNetwork = '';
      
      for (const [name, nets] of Object.entries(interfaces)) {
        for (const net of nets || []) {
          // Skip internal and non-IPv4 addresses
          if (!net.internal && net.family === 'IPv4') {
            // Get the network prefix (e.g., 192.168.1)
            localNetwork = net.address.split('.').slice(0, 3).join('.');
            break;
          }
        }
        if (localNetwork) break;
      }

      if (!localNetwork) {
        throw new Error('No suitable network interface found');
      }

      // Scan network using arp-scan or similar tool
      const command = process.platform === 'win32'
        ? `arp -a`
        : `sudo arp-scan --localnet`;

      const { stdout } = await execAsync(command);
      
      // Parse the output
      const devices = [];
      const lines = stdout.split('\n');
      
      for (const line of lines) {
        if (process.platform === 'win32') {
          // Parse Windows ARP output
          const match = line.match(/\s+(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F-]{17})/);
          if (match) {
            devices.push({
              ipAddress: match[1],
              macAddress: match[2]
            });
          }
        } else {
          // Parse Linux arp-scan output
          const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:]{17})/);
          if (match) {
            devices.push({
              ipAddress: match[1],
              macAddress: match[2]
            });
          }
        }
      }

      return devices;
    } catch (error) {
      console.error('Network scan error:', error);
      throw error;
    }
  }
}

export const networkUtils = new NetworkUtils();