import React, { useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { NetworkDevice } from '@/utils/networkUtils';

interface NetworkTopologyGraphProps {
  devices: NetworkDevice[];
}

export const NetworkTopologyGraph = ({ devices }: NetworkTopologyGraphProps) => {
  const graphData = {
    nodes: devices.map(device => ({
      id: device.ip,
      name: device.name,
      val: 1,
      color: device.status === 'online' ? '#10B981' : '#EF4444'
    })),
    links: devices.map((device, index) => ({
      source: device.ip,
      target: devices[(index + 1) % devices.length].ip,
      value: 1
    }))
  };

  const handleNodeClick = useCallback((node: any) => {
    console.log('Clicked node:', node);
  }, []);

  return (
    <div className="h-[400px] w-full border rounded-lg bg-background">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        onNodeClick={handleNodeClick}
        width={800}
        height={400}
      />
    </div>
  );
};