import { ServerNode } from '../config/server.pairing.config';
import { serverPairingConfig } from '../config/server.pairing.config';
import db from '../config/database';
import { networkScanner } from '../utils/networkScanner';
import { EventEmitter } from 'events';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.NODE_JWT_SECRET || 'node-secret-key';

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
        metrics TEXT,
        auth_token TEXT
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

    const authToken = this.generateAuthToken(nodeInfo.id);
    await this.updateNodeStatus({ ...nodeInfo, authToken });
    this.startHeartbeat();
    return authToken;
  }

  private generateAuthToken(nodeId: string): string {
    return jwt.sign({ nodeId }, JWT_SECRET, { expiresIn: '7d' });
  }

  async authenticateNode(nodeId: string): Promise<string> {
    const node = await this.getNodeById(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }
    
    const authToken = this.generateAuthToken(nodeId);
    await this.updateNodeStatus({ ...node, authToken });
    return authToken;
  }

  private async updateNodeStatus(node: ServerNode & { authToken?: string }) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO server_nodes 
      (id, name, host, port, is_hub, hub_url, last_seen, status, metrics, auth_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      JSON.stringify(node.metrics || {}),
      node.authToken || null
    );

    this.nodes.set(node.id, node);
    this.emit('nodeUpdated', node);
  }

  async getNodeById(nodeId: string): Promise<ServerNode | null> {
    const stmt = db.prepare('SELECT * FROM server_nodes WHERE id = ?');
    const row = stmt.get(nodeId);
    if (!row) return null;
    
    return {
      ...row,
      isHub: Boolean(row.is_hub),
      metrics: row.metrics ? JSON.parse(row.metrics) : undefined
    };
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
          const node = this.nodes.values().next().value;
          
          const response = await fetch(`${this.hubUrl}/api/heartbeat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${node.authToken}`
            },
            body: JSON.stringify({
              nodeId: node.id,
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