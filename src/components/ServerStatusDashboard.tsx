import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { ServerNode } from "@/types/server";
import { Activity, Server, Wifi } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ServerStatusDashboard = () => {
  const { data: nodes, isLoading } = useQuery({
    queryKey: ["server-nodes"],
    queryFn: async () => {
      const response = await fetch("/api/server/nodes");
      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }
      return response.json() as Promise<ServerNode[]>;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const activeNodes = nodes?.filter((node) => node.status === "active") || [];
  const inactiveNodes = nodes?.filter((node) => node.status === "inactive") || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Nodes
            </h3>
          </div>
          <p className="text-2xl font-bold">{nodes?.length || 0}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Nodes
            </h3>
          </div>
          <p className="text-2xl font-bold">{activeNodes.length}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Inactive Nodes
            </h3>
          </div>
          <p className="text-2xl font-bold">{inactiveNodes.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Node Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={nodes?.map((node) => ({
                name: node.name,
                cpu: node.metrics?.cpuUsage || 0,
                memory: node.metrics?.memoryUsage || 0,
                network: node.metrics?.networkLoad || 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#3b82f6"
                name="CPU Usage"
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#10b981"
                name="Memory Usage"
              />
              <Line
                type="monotone"
                dataKey="network"
                stroke="#f59e0b"
                name="Network Load"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};