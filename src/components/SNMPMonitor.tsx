import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { NetworkDevice } from '@/utils/networkUtils';

interface SNMPMetrics {
  deviceName: string;
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  interfaceStats: {
    name: string;
    bytesIn: number;
    bytesOut: number;
  }[];
}

export const SNMPMonitor = ({ device }: { device: NetworkDevice }) => {
  const [metrics, setMetrics] = useState<SNMPMetrics | null>(null);
  const [community, setCommunity] = useState('public');
  const [monitoring, setMonitoring] = useState(false);

  const startMonitoring = () => {
    setMonitoring(true);
    // Simulate SNMP monitoring
    const interval = setInterval(() => {
      setMetrics({
        deviceName: device.name,
        uptime: '3 days, 2 hours',
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        interfaceStats: [
          {
            name: 'eth0',
            bytesIn: Math.floor(Math.random() * 1000000),
            bytesOut: Math.floor(Math.random() * 1000000)
          }
        ]
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  const stopMonitoring = () => {
    setMonitoring(false);
    toast({
      title: "SNMP Monitoring Stopped",
      description: `Stopped monitoring ${device.name}`
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">SNMP Monitor</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Community String"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
          />
          <Button onClick={monitoring ? stopMonitoring : startMonitoring}>
            {monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
        
        {metrics && (
          <div className="space-y-2">
            <div>Uptime: {metrics.uptime}</div>
            <div>CPU Usage: {metrics.cpuUsage.toFixed(2)}%</div>
            <div>Memory Usage: {metrics.memoryUsage.toFixed(2)}%</div>
            {metrics.interfaceStats.map((iface, index) => (
              <div key={index} className="p-2 bg-secondary rounded">
                <div>Interface: {iface.name}</div>
                <div>Bytes In: {iface.bytesIn}</div>
                <div>Bytes Out: {iface.bytesOut}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};