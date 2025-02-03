import React from 'react';
import { NetworkDevice } from '@/utils/networkUtils';
import { Card } from './ui/card';

interface NetworkTopologyProps {
  devices: NetworkDevice[];
}

export const NetworkTopology = ({ devices }: NetworkTopologyProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Network Topology</h2>
      <div className="text-muted-foreground">
        Network topology visualization coming soon...
      </div>
    </Card>
  );
};