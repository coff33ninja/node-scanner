# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

### POST /auth/login
Login endpoint
- **Body**: `{ email: string, password: string }`
- **Response**: User data and token

### POST /auth/register
Registration endpoint
- **Body**: `{ email: string, password: string }`
- **Response**: User data

## Server Management

### POST /server/register-hub
Register as hub server
- **Auth**: Required
- **Response**: Success status

### POST /server/register-node
Register as node server
- **Auth**: Required
- **Body**: `{ hubUrl: string }`
- **Response**: Success status and node token

### GET /server/nodes
Get all connected nodes
- **Auth**: Required
- **Response**: Array of nodes

### POST /server/heartbeat
Send node heartbeat
- **Auth**: Required
- **Body**: `{ nodeId: string, metrics: object }`
- **Response**: Success status

### GET /server/metrics
Get node metrics
- **Auth**: Required
- **Response**: Node performance metrics

### POST /server/failover
Initiate manual failover
- **Auth**: Required
- **Body**: `{ sourceNodeId: string, targetNodeId: string }`
- **Response**: Failover status

## Load Balancer

### GET /server/lb/status
Get load balancer status
- **Auth**: Required
- **Response**: Current load balancer configuration and stats

### PUT /server/lb/config
Update load balancer configuration
- **Auth**: Required
- **Body**: Load balancer configuration
- **Response**: Updated configuration

### GET /server/lb/metrics
Get load balancer metrics
- **Auth**: Required
- **Response**: Current metrics and statistics

## Health Checks

### GET /health
Health check endpoint
- **Response**: Server health status