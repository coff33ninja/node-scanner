import React from 'react';
import { Card } from './ui/card';
import { NetworkDevice } from '@/utils/networkUtils';
import { DeviceManagement } from './DeviceManagement';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AlertCircle, Wifi } from 'lucide-react';

interface MonitoringDashboardProps {
  devices: NetworkDevice[];
}

export const MonitoringDashboard = ({ devices }: MonitoringDashboardProps) => {
  // Sample data for the chart - in a real app this would come from your metrics
  const networkData = [
    { time: '00:00', bandwidth: 400 },
    { time: '04:00', bandwidth: 300 },
    { time: '08:00', bandwidth: 600 },
    { time: '12:00', bandwidth: 800 },
    { time: '16:00', bandwidth: 500 },
    { time: '20:00', bandwidth: 400 },
  ];

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <div>
              <h3 className="text-sm font-medium">Online Devices</h3>
              <p className="text-2xl font-bold">{onlineDevices}/{totalDevices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="text-sm font-medium">Alerts</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Network Bandwidth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={networkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="bandwidth" 
                stroke="#10B981" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {devices.map((device) => (
          <DeviceManagement 
            key={device.ip} 
            device={device}
            onWake={() => console.log('Wake', device.mac)}
            onShutdown={() => console.log('Shutdown', device.ip)}
          />
        ))}
      </div>
    </div>
  );
};