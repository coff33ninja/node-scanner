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

export const serverPairingConfig = {
  heartbeatInterval: 30000, // 30 seconds
  timeoutThreshold: 90000,  // 90 seconds
  retryAttempts: 3,
  retryDelay: 5000,        // 5 seconds
};