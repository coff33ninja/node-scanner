import { exec } from 'child_process';
import { promisify } from 'util';
import net from 'net';

const execAsync = promisify(exec);

export class PortScanner {
  async scanPort(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    });
  }

  async scanCommonPorts(host: string): Promise<number[]> {
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 5432];
    const openPorts: number[] = [];

    for (const port of commonPorts) {
      const isOpen = await this.scanPort(host, port);
      if (isOpen) {
        openPorts.push(port);
      }
    }

    return openPorts;
  }

  async getServiceName(port: number): Promise<string> {
    const commonServices: { [key: number]: string } = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      465: 'SMTPS',
      587: 'SMTP',
      993: 'IMAPS',
      995: 'POP3S',
      3306: 'MySQL',
      5432: 'PostgreSQL'
    };

    return commonServices[port] || 'Unknown';
  }
}

export const portScanner = new PortScanner();