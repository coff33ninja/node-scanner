# Development Guide

## Project Structure

### Frontend
- `src/components/` - React components
  - `ui/` - Reusable UI components using shadcn/ui
  - `device-settings/` - Device configuration components
  - `metrics/` - Performance and network metrics visualization
  - `network-scan/` - Network scanning and device discovery
  - `ServerStatusDashboard.tsx` - Real-time server monitoring
  - `NetworkTopology.tsx` - Network topology visualization
  - `NodeManagement.tsx` - Server node management interface

### Backend
- `backend/nodejs/src/`
  - `config/` - Configuration files
  - `controllers/` - Request handlers
  - `routes/` - API routes
  - `services/` - Business logic
  - `utils/` - Helper functions
  - `models/` - Data models
  - `middleware/` - Express middleware

## Key Features
1. Server Node Management
   - Real-time node status monitoring
   - Node authentication
   - Performance metrics visualization
   - Network topology mapping
   - Load balancing and failover
   - Health monitoring

2. Device Management
   - Network device discovery
   - Device status monitoring
   - Wake-on-LAN support
   - Device grouping

3. Security
   - JWT-based node authentication
   - Secure hub-node communication
   - Rate limiting
   - SSL/TLS support (planned)

4. Load Balancing
   - Multiple load balancing algorithms
   - Automatic failover
   - Health checks
   - Connection tracking
   - Node scaling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## Load Balancer Configuration

The load balancer supports three algorithms:
- Round Robin: Distributes requests evenly across all nodes
- Least Connections: Routes to the node with the fewest active connections
- Weighted Round Robin: Routes based on node capacity weights

Configure the load balancer in `server.load.config.ts`:
```typescript
{
  algorithm: 'round-robin' | 'least-connections' | 'weighted-round-robin',
  healthCheckInterval: 30000, // Health check frequency in ms
  failoverTimeout: 5000,      // Failover timeout in ms
  maxRetries: 3               // Maximum retry attempts
}
```

## Failover Mechanism

The system automatically handles node failures by:
1. Detecting failed nodes through regular health checks
2. Marking failed nodes as inactive
3. Redistributing connections to healthy nodes
4. Attempting to restore failed nodes
5. Logging all failover events

## Monitoring

Monitor your node cluster through:
- Real-time dashboard
- Performance metrics
- Connection statistics
- Health status
- Failover logs