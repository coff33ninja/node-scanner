import React from 'react';
import { NetworkDevice } from '@/utils/networkUtils';
import { Card } from './ui/card';
import { NetworkTopologyGraph } from './NetworkTopologyGraph';
import { DNSManager } from './DNSManager';
import { SecurityScanner } from './SecurityScanner';
import { SNMPMonitor } from './SNMPMonitor';

interface NetworkTopologyProps {
  devices: NetworkDevice[];
}

export const NetworkTopology = ({ devices }: NetworkTopologyProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Network Topology</h2>
        <NetworkTopologyGraph devices={devices} />
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DNSManager />
        <SecurityScanner devices={devices} />
      </div>
      
      {devices.map(device => (
        <SNMPMonitor key={device.ip} device={device} />
      ))}
    </div>
  );
};