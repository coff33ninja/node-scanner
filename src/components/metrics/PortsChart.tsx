import { Card } from "@/components/ui/card";
import { DeviceMetrics } from "@/utils/networkMonitor";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PortsChartProps {
  metrics: DeviceMetrics[];
}

export function PortsChart({ metrics }: PortsChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

  return (
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
  );
}