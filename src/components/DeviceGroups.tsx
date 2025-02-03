import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

export const DeviceGroups = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Device Groups</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>
      <div className="text-muted-foreground">
        Device grouping functionality coming soon...
      </div>
    </Card>
  );
};