import dgram from 'dgram';
import { exec } from 'child_process';

export class PowerManager {
  async wakeOnLan(macAddress: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const MAC_REPEAT = 16;
      const MAC_LENGTH = 6;
      const BROADCAST_ADDR = '255.255.255.255';
      const WOL_PORT = 9;

      try {
        const macBuffer = Buffer.from(macAddress.replace(/[:\-]/g, ''), 'hex');
        const magicPacket = Buffer.alloc(6 + MAC_LENGTH * MAC_REPEAT);

        // Fill first 6 bytes with 0xFF
        for (let i = 0; i < 6; i++) {
          magicPacket[i] = 0xFF;
        }

        // Repeat MAC address 16 times
        for (let i = 0; i < MAC_REPEAT; i++) {
          macBuffer.copy(magicPacket, 6 + i * MAC_LENGTH);
        }

        const socket = dgram.createSocket('udp4');
        socket.send(magicPacket, 0, magicPacket.length, WOL_PORT, BROADCAST_ADDR, (err) => {
          socket.close();
          if (err) reject(err);
          else resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async shutdownDevice(ip: string, username?: string, password?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const cmd = process.platform === 'win32'
        ? `shutdown /s /m \\\\${ip} /t 0`
        : `ssh ${username}@${ip} "sudo shutdown -h now"`;

      exec(cmd, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }
}

export const powerManager = new PowerManager();