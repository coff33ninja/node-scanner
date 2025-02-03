import { ServerNode } from '../config/server.pairing.config';
import { loadBalancerConfig } from '../config/server.load.config';
import { EventEmitter } from 'events';

class LoadBalancerService extends EventEmitter {
  private nodes: Map<string, ServerNode> = new Map();
  private currentNodeIndex: number = 0;
  private connectionCounts: Map<string, number> = new Map();

  constructor() {
    super();
    this.startHealthChecks();
  }

  private startHealthChecks(): void {
    setInterval(() => {
      this.checkNodesHealth();
    }, loadBalancerConfig.healthCheckInterval);
  }

  private async checkNodesHealth(): Promise<void> {
    for (const [nodeId, node] of this.nodes.entries()) {
      try {
        const response = await fetch(`${node.host}:${node.port}/health`);
        if (!response.ok) {
          this.handleNodeFailure(nodeId);
        }
      } catch (error) {
        this.handleNodeFailure(nodeId);
      }
    }
  }

  private handleNodeFailure(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.status = 'inactive';
      this.emit('nodeFailure', node);
      this.initiateFailover(nodeId);
    }
  }

  private async initiateFailover(failedNodeId: string): Promise<void> {
    const failedNode = this.nodes.get(failedNodeId);
    if (!failedNode) return;

    const activeNodes = Array.from(this.nodes.values())
      .filter(node => node.status === 'active' && node.id !== failedNodeId);

    if (activeNodes.length === 0) {
      console.error('No active nodes available for failover');
      return;
    }

    // Select the node with the least connections
    const targetNode = activeNodes.reduce((prev, curr) => {
      const prevConnections = this.connectionCounts.get(prev.id) || 0;
      const currConnections = this.connectionCounts.get(curr.id) || 0;
      return prevConnections <= currConnections ? prev : curr;
    });

    this.emit('failover', { from: failedNode, to: targetNode });
  }

  public addNode(node: ServerNode): void {
    this.nodes.set(node.id, node);
    this.connectionCounts.set(node.id, 0);
  }

  public removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    this.connectionCounts.delete(nodeId);
  }

  public getNextNode(): ServerNode | null {
    const activeNodes = Array.from(this.nodes.values())
      .filter(node => node.status === 'active');

    if (activeNodes.length === 0) return null;

    switch (loadBalancerConfig.algorithm) {
      case 'round-robin':
        this.currentNodeIndex = (this.currentNodeIndex + 1) % activeNodes.length;
        return activeNodes[this.currentNodeIndex];

      case 'least-connections':
        return activeNodes.reduce((prev, curr) => {
          const prevConnections = this.connectionCounts.get(prev.id) || 0;
          const currConnections = this.connectionCounts.get(curr.id) || 0;
          return prevConnections <= currConnections ? prev : curr;
        });

      case 'weighted-round-robin':
        // Implementation for weighted round-robin algorithm
        return activeNodes[this.currentNodeIndex];

      default:
        return activeNodes[0];
    }
  }

  public incrementConnections(nodeId: string): void {
    const current = this.connectionCounts.get(nodeId) || 0;
    this.connectionCounts.set(nodeId, current + 1);
  }

  public decrementConnections(nodeId: string): void {
    const current = this.connectionCounts.get(nodeId) || 0;
    if (current > 0) {
      this.connectionCounts.set(nodeId, current - 1);
    }
  }
}

export const loadBalancerService = new LoadBalancerService();