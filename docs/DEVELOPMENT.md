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