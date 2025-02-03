import { useEffect, useState } from 'react';
import { NetworkDevice } from '@/utils/networkUtils';
import { DeviceMetrics } from '@/utils/networkMonitor';
import { useToast } from '@/hooks/use-toast';
import { MetricsHeader } from './MetricsHeader';
import { BandwidthChart } from './BandwidthChart';
import { PortsChart } from './PortsChart';

interface PerformanceMetricsProps {
  devices: NetworkDevice[];
}

export function PerformanceMetrics({ devices }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<DeviceMetrics[]>([]);
  const [history, setHistory] = useState<DeviceMetrics[][]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const newMetrics = await Promise.all(
          devices.map(device => 
            fetch(`/api/network/metrics/${device.ip}`)
              .then(res => res.json())
          )
        );
        setMetrics(newMetrics);
        setHistory(prev => [...prev.slice(-12), newMetrics]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast({
          title: "Error",
          description: "Failed to fetch network metrics",
          variant: "destructive",
        });
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [devices, toast]);

  const totalBandwidth = metrics.reduce(
    (acc, m) => ({
      upload: acc.upload + (m?.metrics?.bandwidth?.upload || 0),
      download: acc.download + (m?.metrics?.bandwidth?.download || 0),
    }),
    { upload: 0, download: 0 }
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <MetricsHeader devices={devices} totalBandwidth={totalBandwidth} />
      <div className="grid gap-4 md:grid-cols-2">
        <BandwidthChart history={history} />
        <PortsChart metrics={metrics} />
      </div>
    </div>
  );
}