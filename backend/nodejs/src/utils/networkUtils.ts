import { exec } from 'child_process';
import wol from 'wake-on-lan';
import util from 'util';
import os from 'os';
import { networkInterfaces } from 'os';

const execAsync = util.promisify(exec);

const wolSend = (macAddress: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        wol(macAddress, {}, (error: Error | null) => {
            if (error) reject(error);
            else resolve();
        });
    });
};

interface NetworkDevice {
    ipAddress: string;
    macAddress: string;
    vendor?: string;
}

interface NetworkInterfaceInfo {
    name: string;
    ip: string;
    netmask: string;
    mac: string;
    internal: boolean;
}

class NetworkUtils {
    async scanNetwork(): Promise<NetworkDevice[]> {
        try {
            const { interfaceName, interfaceInfo } = this.getDefaultInterface();
            if (!interfaceName || !interfaceInfo) {
                throw new Error('No suitable network interface found');
            }

            // Different commands for different operating systems
            let command: string;
            if (process.platform === 'win32') {
                // On Windows, use ARP -a
                command = 'arp -a';
            } else {
                // On Linux/Mac, use arp-scan if available
                command = `arp-scan --localnet --interface=${interfaceName}`;
            }

            const { stdout } = await execAsync(command);
            return this.parseArpOutput(stdout, process.platform);

        } catch (error) {
            console.error('Network scan error:', error);
            throw new Error('Failed to scan network');
        }
    }

    async wakeDevice(macAddress: string): Promise<void> {
        try {
            // Validate MAC address format
            if (!this.isValidMacAddress(macAddress)) {
                throw new Error('Invalid MAC address format');
            }

            // Send WOL packet
            await wolSend(macAddress);
        } catch (error) {
            console.error('Wake-on-LAN error:', error);
            throw new Error('Failed to send Wake-on-LAN packet');
        }
    }

    private getDefaultInterface(): { interfaceName: string | null; interfaceInfo: NetworkInterfaceInfo | null } {
        try {
            const interfaces = networkInterfaces();
            for (const [name, addrs] of Object.entries(interfaces)) {
                for (const addr of addrs as os.NetworkInterfaceInfo[]) {
                    if (addr.family === 'IPv4' && !addr.internal) {
                        return {
                            interfaceName: name,
                            interfaceInfo: {
                                name,
                                ip: addr.address,
                                netmask: addr.netmask,
                                mac: addr.mac || '',
                                internal: addr.internal
                            }
                        };
                    }
                }
            }
            return { interfaceName: null, interfaceInfo: null };
        } catch (error) {
            console.error('Error getting network interface:', error);
            return { interfaceName: null, interfaceInfo: null };
        }
    }

    private parseArpOutput(output: string, platform: string): NetworkDevice[] {
        const devices: NetworkDevice[] = [];
        const lines = output.split('\n');

        if (platform === 'win32') {
            // Windows ARP output format
            // Interface: 192.168.1.2 --- 0x4
            //   Internet Address      Physical Address      Type
            //   192.168.1.1          00-11-22-33-44-55     dynamic
            const regex = /\s+(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F-]{17})/;
            for (const line of lines) {
                const match = line.match(regex);
                if (match) {
                    devices.push({
                        ipAddress: match[1],
                        macAddress: this.standardizeMacAddress(match[2])
                    });
                }
            }
        } else {
            // Linux/Mac ARP-SCAN output format
            // 192.168.1.1	00:11:22:33:44:55	Router
            const regex = /(\d+\.\d+\.\d+\.\d+)\s+([0-9a-fA-F:]{17})/;
            for (const line of lines) {
                const match = line.match(regex);
                if (match) {
                    devices.push({
                        ipAddress: match[1],
                        macAddress: this.standardizeMacAddress(match[2])
                    });
                }
            }
        }

        return devices;
    }

    private isValidMacAddress(mac: string): boolean {
        // Support both : and - as separators
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        return macRegex.test(mac);
    }

    private standardizeMacAddress(mac: string): string {
        // Convert to uppercase and standardize format to use colons
        return mac.toUpperCase().replace(/-/g, ':');
    }

    async pingDevice(ipAddress: string): Promise<boolean> {
        try {
            const command = process.platform === 'win32'
                ? `ping -n 1 -w 1000 ${ipAddress}`
                : `ping -c 1 -W 1 ${ipAddress}`;

            await execAsync(command);
            return true;
        } catch {
            return false;
        }
    }
}

export const networkUtils = new NetworkUtils();