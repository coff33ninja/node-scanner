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

## Devices

### GET /devices
List all devices
- **Auth**: Required
- **Response**: Array of devices

### POST /devices/wake
Wake a device
- **Auth**: Required
- **Body**: `{ mac: string }`
- **Response**: Success status

## Server Management

### POST /server/register-hub
Register as hub server
- **Auth**: Required
- **Response**: Success status

### POST /server/register-node
Register as node server
- **Auth**: Required
- **Body**: `{ hubUrl: string }`
- **Response**: Success status

### GET /server/nodes
Get all connected nodes
- **Auth**: Required
- **Response**: Array of nodes