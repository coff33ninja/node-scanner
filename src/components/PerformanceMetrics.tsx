import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { NetworkDevice } from '@/utils/networkUtils';
import { DeviceMetrics } from '@/utils/networkMonitor';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useToast } from './ui/use-toast';

interface PerformanceMetricsProps {
  devices: NetworkDevice[];
}

export const PerformanceMetrics = ({ devices }: PerformanceMetricsProps) => {
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
        setHistory(prev => [...prev.slice(-12), newMetrics]); // Keep last hour of data (5-min intervals)
      } catch (error) {
        console.error('Error fetching metrics:', error);
        toast({
          title: "Error",
          description: "Failed to fetch network metrics",
          variant: "destructive",
        });
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [devices, toast]);

  const onlineDevices = metrics.filter(m => m?.status === 'online').length;
  const totalBandwidth = metrics.reduce(
    (acc, m) => ({
      upload: acc.upload + (m?.metrics?.bandwidth?.upload || 0),
      download: acc.download + (m?.metrics?.bandwidth?.download || 0),
    }),
    { upload: 0, download: 0 }
  );

  const portData = metrics.flatMap(m => 
    (m?.openPorts || []).map(port => ({
      port,
      count: metrics.filter(d => d?.openPorts?.includes(port)).length
    }))
  ).reduce((acc, { port, count }) => {
    if (!acc.find(x => x.port === port)) {
      acc.push({ port, count });
    }
    return acc;
  }, [] as { port: number; count: number }[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Online Devices</h3>
          <p className="text-2xl font-bold">{onlineDevices} / {devices.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Upload</h3>
          <p className="text-2xl font-bold">{(totalBandwidth.upload / 1024 / 1024).toFixed(2)} MB/s</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Download</h3>
          <p className="text-2xl font-bold">{(totalBandwidth.download / 1024 / 1024).toFixed(2)} MB/s</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Network Bandwidth Usage</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history.flat()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="metrics.bandwidth.download" 
                  stroke="#10B981" 
                  name="Download"
                />
                <Line 
                  type="monotone" 
                  dataKey="metrics.bandwidth.upload" 
                  stroke="#3B82F6" 
                  name="Upload"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Open Ports Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portData}
                  dataKey="count"
                  nameKey="port"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {portData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};