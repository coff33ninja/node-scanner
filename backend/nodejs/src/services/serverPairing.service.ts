import { ServerNode } from '../config/server.pairing.config';
import { serverPairingConfig } from '../config/server.pairing.config';
import db from '../config/database';
import { networkScanner } from '../utils/networkScanner';
import { EventEmitter } from 'events';

class ServerPairingService extends EventEmitter {
  private nodes: Map<string, ServerNode> = new Map();
  private isHub: boolean = false;
  private hubUrl?: string;

  constructor() {
    super();
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS server_nodes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER NOT NULL,
        is_hub BOOLEAN DEFAULT 0,
        hub_url TEXT,
        last_seen TEXT,
        status TEXT DEFAULT 'inactive',
        metrics TEXT
      );
    `);
  }

  async registerAsHub() {
    this.isHub = true;
    await this.updateNodeStatus({
      id: 'hub',
      name: 'Main Hub',
      host: 'localhost',
      port: Number(process.env.PORT) || 5000,
      isHub: true,
      status: 'active'
    });
  }

  async registerAsNode(hubUrl: string) {
    this.isHub = false;
    this.hubUrl = hubUrl;
    
    const nodeInfo: ServerNode = {
      id: `node-${Date.now()}`,
      name: `Node-${Math.random().toString(36).substring(7)}`,
      host: 'localhost',
      port: Number(process.env.PORT) || 5000,
      isHub: false,
      hubUrl,
      status: 'active'
    };

    await this.updateNodeStatus(nodeInfo);
    this.startHeartbeat();
  }

  private async updateNodeStatus(node: ServerNode) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO server_nodes 
      (id, name, host, port, is_hub, hub_url, last_seen, status, metrics)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      node.id,
      node.name,
      node.host,
      node.port,
      node.isHub ? 1 : 0,
      node.hubUrl || null,
      new Date().toISOString(),
      node.status,
      JSON.stringify(node.metrics || {})
    );

    this.nodes.set(node.id, node);
    this.emit('nodeUpdated', node);
  }

  async getNodes(): Promise<ServerNode[]> {
    const stmt = db.prepare('SELECT * FROM server_nodes');
    const rows = stmt.all();
    return rows.map(row => ({
      ...row,
      isHub: Boolean(row.is_hub),
      metrics: row.metrics ? JSON.parse(row.metrics) : undefined
    }));
  }

  private startHeartbeat() {
    setInterval(async () => {
      if (!this.isHub && this.hubUrl) {
        try {
          const metrics = await this.collectMetrics();
          const response = await fetch(`${this.hubUrl}/api/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nodeId: this.nodes.values().next().value?.id,
              metrics
            })
          });

          if (!response.ok) {
            console.error('Failed to send heartbeat to hub');
          }
        } catch (error) {
          console.error('Heartbeat error:', error);
        }
      }
    }, serverPairingConfig.heartbeatInterval);
  }

  private async collectMetrics() {
    const networkInfo = await networkScanner.scanNetwork();
    return {
      timestamp: new Date().toISOString(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
      networkDevices: networkInfo.length,
      networkLoad: Math.random() * 100 // Replace with actual network load measurement
    };
  }
}

export const serverPairingService = new ServerPairingService();