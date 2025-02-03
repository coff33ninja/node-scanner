export interface ServerNode {
  id: string;
  name: string;
  host: string;
  port: number;
  isHub: boolean;
  hubUrl?: string;
  lastSeen?: string;
  status: 'active' | 'inactive';
  metrics?: {
    cpuUsage: number;
    memoryUsage: number;
    networkLoad: number;
  };
}