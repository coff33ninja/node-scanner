import dgram from 'dgram';
import net from 'net';
import { exec } from 'child_process';
import os from 'os';

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

  async scanNetwork(ipRange) {
    return new Promise((resolve, reject) => {
      const devices = [];
      const [baseIp, subnet] = ipRange.split('/');
      const baseIpParts = baseIp.split('.');
      const hosts = Math.pow(2, 32 - parseInt(subnet));

      let completed = 0;

      for (let i = 1; i < hosts - 1; i++) {
        const ip = `${baseIpParts[0]}.${baseIpParts[1]}.${baseIpParts[2]}.${i}`;
        const socket = new net.Socket();

        socket.setTimeout(1000);

        socket.on('connect', () => {
          devices.push({
            ip,
            status: 'online',
            lastSeen: new Date().toISOString(),
          });
          socket.destroy();
        });

        socket.on('error', () => {
          socket.destroy();
        });

        socket.on('timeout', () => {
          socket.destroy();
        });

        socket.on('close', () => {
          completed++;
          if (completed === hosts - 2) {
            resolve(devices);
          }
        });

        socket.connect(80, ip);
      }
    });
  }

  wakeOnLan(macAddress) {
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
