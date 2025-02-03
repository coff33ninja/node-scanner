import { Card } from "@/components/ui/card";
import { DeviceMetrics } from "@/utils/networkMonitor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface BandwidthChartProps {
  history: DeviceMetrics[][];
}

export function BandwidthChart({ history }: BandwidthChartProps) {
  return (
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
  );
}