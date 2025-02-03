# Configuration Guide

## Server Modes

The application can run in three modes:
- **Standalone**: Single server setup (default)
- **Hub**: Central server that receives reports from nodes
- **Node**: Server instance that reports to a hub

### Environment Configuration

Set the server mode in your `.env` file:
```env
SERVER_MODE=standalone  # or 'hub' or 'node'
HUB_URL=http://localhost:5000  # Required if SERVER_MODE=node
```

### Node-Hub Communication
- Nodes report to the hub every 30 seconds
- Metrics include CPU usage, memory usage, and network statistics
- Each node maintains its own database while sending relevant data to the hub

## Security Configuration

### JWT Settings
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### CORS Configuration
```env
CORS_ORIGIN=http://localhost:3000
```