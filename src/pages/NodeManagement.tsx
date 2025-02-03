import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Power, RefreshCw } from "lucide-react";
import { ServerNode } from "@/types/server";
import { API_ENDPOINTS, getAuthHeaders } from "@/config/api";
import { toast } from "@/components/ui/use-toast";

export default function NodeManagement() {
  const { data: nodes, isLoading, refetch } = useQuery({
    queryKey: ["nodes"],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/server/nodes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch nodes");
      return response.json() as Promise<ServerNode[]>;
    },
  });

  const handleAuthenticate = async (nodeId: string) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/server/nodes/${nodeId}/authenticate`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Authentication failed");
      toast({
        title: "Success",
        description: "Node authenticated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate node",
        variant: "destructive",
      });
    }
  };

  const handleRestart = async (nodeId: string) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/server/nodes/${nodeId}/restart`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error("Restart failed");
      toast({
        title: "Success",
        description: "Node restart initiated",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restart node",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Node Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Badge variant="outline">
                  Total Nodes: {nodes?.length || 0}
                </Badge>
                <Badge variant="outline" className="bg-green-100">
                  Active: {nodes?.filter((n) => n.status === "active").length || 0}
                </Badge>
                <Badge variant="outline" className="bg-red-100">
                  Inactive:{" "}
                  {nodes?.filter((n) => n.status === "inactive").length || 0}
                </Badge>
              </div>
              <Button onClick={() => refetch()} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes?.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>{node.name}</TableCell>
                      <TableCell>
                        {node.host}:{node.port}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={node.status === "active" ? "default" : "destructive"}
                        >
                          {node.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {node.lastSeen
                          ? new Date(node.lastSeen).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAuthenticate(node.id)}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Auth
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestart(node.id)}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            Restart
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}