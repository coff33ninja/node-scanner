import dgram from 'dgram';
import net from 'net';
import { exec } from 'child_process';
import os from 'os';
import { spawn } from 'child_process';

export class NetworkScanner {
  constructor() {
    this.interface = this.getDefaultInterface();
  }

  getDefaultInterface() {
    const interfaces = os.networkInterfaces();
    for (const [name, addrs] of Object.entries(interfaces)) {
      const ipv4 = addrs.find(addr => addr.family === 'IPv4' && !addr.internal);
      if (ipv4) return name;
    }
    return null;
  }

  async getMacFromArp(ip) {
    return new Promise((resolve) => {
      const cmd = process.platform === 'win32' 
        ? `arp -a ${ip}` 
        : `arp -n ${ip}`;

      exec(cmd, (error, stdout) => {
        if (error) {
          console.error('Error getting MAC for %s:', ip, error);
          resolve(null);
          return;
        }

        const lines = stdout.split('\n');
        for (const line of lines) {
          const match = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
          if (match) {
            resolve(match[0]);
            return;
          }
        }
        resolve(null);
      });
    });
  }

  async scanNetwork(ipRange) {
    try {
      console.log('Starting network scan...');
      const devices = [];
      const [baseIp, subnet] = ipRange.split('/');
      const baseIpParts = baseIp.split('.');
      const hosts = Math.pow(2, 32 - parseInt(subnet));

      // Ping sweep for faster initial discovery
      const pingPromises = [];
      for (let i = 1; i < hosts - 1; i++) {
        const ip = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i}`;
        const cmd = process.platform === 'win32'
          ? `ping -n 1 -w 100 ${ip}`
          : `ping -c 1 -W 1 ${ip}`;

        pingPromises.push(
          new Promise((resolve) => {
            exec(cmd, async (error, stdout) => {
              if (!error && (stdout.includes('TTL=') || stdout.includes('ttl='))) {
                // Get MAC address and hostname for responding IPs
                const mac = await this.getMacFromArp(ip);
                let hostname = '';
                try {
                  hostname = await new Promise((resolve) => {
                    exec(`nslookup ${ip}`, (error, stdout) => {
                      if (!error) {
                        const match = stdout.match(/name\s*=\s*([^\s]+)/i);
                        resolve(match ? match[1].replace(/\.$/, '') : '');
                      } else {
                        resolve('');
                      }
                    });
                  });
                } catch (err) {
                  console.error(`Error getting hostname for ${ip}:`, err);
                }

                if (mac) {
                  devices.push({
                    ip,
                    mac,
                    name: hostname || `Device (${ip})`,
                    status: 'online',
                    lastSeen: new Date().toISOString(),
                    hostname
                  });
                }
              }
              resolve();
            });
          })
        );
      }

      await Promise.all(pingPromises);
      console.log('Scan completed, found devices:', devices);
      return devices;
    } catch (error) {
      console.error('Network scan failed:', error);
      throw error;
    }
  }

  async wakeOnLan(macAddress) {
    return new Promise((resolve, reject) => {
      const MAC_REPEAT = 16;
      const MAC_LENGTH = 6;
      const BROADCAST_ADDR = '255.255.255.255';
      const WOL_PORT = 9;

      const macBuffer = Buffer.from(macAddress.replace(/[:\-]/g, ''), 'hex');
      const magicPacket = Buffer.alloc(6 + MAC_LENGTH * MAC_REPEAT);

      for (let i = 0; i < 6; i++) {
        magicPacket[i] = 0xFF;
      }

      for (let i = 0; i < MAC_REPEAT; i++) {
        macBuffer.copy(magicPacket, 6 + i * MAC_LENGTH);
      }

      const socket = dgram.createSocket('udp4');

      socket.send(magicPacket, 0, magicPacket.length, WOL_PORT, BROADCAST_ADDR, (err) => {
        socket.close();
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  async shutdownDevice(ip, username, password) {
    return new Promise((resolve, reject) => {
      let cmd;

      if (process.platform === 'win32') {
        cmd = `shutdown /s /m \\\\${ip} /t 0`;
      } else {
        cmd = `ssh ${username}@${ip} "sudo shutdown -h now"`;
      }

      exec(cmd, (error) => {
        if (error) {
          console.error(`Error: ${error}`);
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }
}
