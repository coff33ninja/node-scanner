import socket
import struct
import subprocess
from typing import List, Dict
import scapy.all as scapy
import netifaces

class NetworkScanner:
    def __init__(self):
        self.interface = self._get_default_interface()

    def _get_default_interface(self) -> str:
        gateways = netifaces.gateways()
        return gateways['default'][netifaces.AF_INET][1]

    def scan_network(self, ip_range: str) -> List[Dict]:
        """
        Scan network for active devices
        Example: scanner.scan_network('192.168.1.0/24')
        """
        arp_request = scapy.ARP(pdst=ip_range)
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast/arp_request
        answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]

        devices = []
        for element in answered_list:
            device = {
                'ip': element[1].psrc,
                'mac': element[1].hwsrc,
                'status': 'online',
                'lastSeen': 'now'
            }
            try:
                hostname = socket.gethostbyaddr(device['ip'])[0]
                device['name'] = hostname
            except:
                device['name'] = f"Unknown Device ({device['ip']})"
            
            devices.append(device)
        
        return devices

    def wake_on_lan(self, mac_address: str) -> bool:
        """
        Send Wake-on-LAN packet to device
        Example: scanner.wake_on_lan('00:11:22:33:44:55')
        """
        try:
            mac_bytes = bytes.fromhex(mac_address.replace(':', ''))
            magic_packet = b'\xff' * 6 + mac_bytes * 16
            
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            sock.sendto(magic_packet, ('255.255.255.255', 9))
            return True
        except Exception as e:
            print(f"Error sending WOL packet: {e}")
            return False

    def shutdown_device(self, ip: str, username: str = None, password: str = None) -> bool:
        """
        Attempt to shutdown a device (requires proper authentication)
        Example: scanner.shutdown_device('192.168.1.100', 'username', 'password')
        """
        try:
            if sys.platform == 'win32':
                cmd = f'shutdown /s /m \\\\{ip} /t 0'
                if username and password:
                    # Use psexec or similar tool for authenticated shutdown
                    pass
            else:
                cmd = f'ssh {username}@{ip} "sudo shutdown -h now"'
            
            subprocess.run(cmd, shell=True, check=True)
            return True
        except Exception as e:
            print(f"Error shutting down device: {e}")
            return False