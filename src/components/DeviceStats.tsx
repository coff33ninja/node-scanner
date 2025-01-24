import { Card } from "@/components/ui/card";
import { BarChart, Activity, Wifi } from "lucide-react";

export const DeviceStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Wifi className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Online Devices</p>
            <h3 className="text-2xl font-bold">12/15</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Network Health</p>
            <h3 className="text-2xl font-bold">98%</h3>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
            <h3 className="text-2xl font-bold">4</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};