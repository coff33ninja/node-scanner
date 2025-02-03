import React from 'react';
import { Card } from './ui/card';
import { NetworkDevice } from '@/utils/networkUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface NetworkMetricsProps {
  devices: NetworkDevice[];
}

export const NetworkMetrics = ({ devices }: NetworkMetricsProps) => {
  // Placeholder data for the chart
  const data = [
    { name: '00:00', value: 400 },
    { name: '04:00', value: 300 },
    { name: '08:00', value: 600 },
    { name: '12:00', value: 800 },
    { name: '16:00', value: 500 },
    { name: '20:00', value: 400 },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Network Performance</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};