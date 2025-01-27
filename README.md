# AltTab - Network Management Dashboard

A comprehensive network management dashboard with device control, user authentication, and network utilities.

## Project Overview

This project provides a modern web interface for network management, featuring:

- User authentication and account management
- Network scanning and device discovery
- Wake-on-LAN (WOL) functionality
- Device monitoring and control
- Multi-user access with role-based permissions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
- **Python**: Version 3.x
- **MongoDB**: Version 4.x or higher
- **npm** or **yarn** package manager

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/coff33ninja/alttab.git
cd alttab
```

### 2. Environment Setup

Create a `.env` file in the `backend/nodejs` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alttab
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

#### Backend Dependencies

```bash
# Install Node.js backend dependencies
cd backend/nodejs
npm install

# Install Python dependencies
cd ../python
python install_requirements.py
# Or manually: pip install scapy netifaces
```

#### Frontend Dependencies

```bash
# From project root
npm install
```

### 4. Database Setup

1. Install MongoDB if you haven't already:
   - [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

## Running the Application

### 1. Start the Backend Servers

```bash
# Start Node.js backend (from backend/nodejs directory)
npm run dev

# The server will start on http://localhost:5000
```

### 2. Start the Frontend Development Server

```bash
# From project root
npm run dev

# The frontend will start on http://localhost:3000
```

## Features

### Authentication System
- User registration with email verification
- Secure login with JWT tokens
- Password recovery
- Two-factor authentication (optional)
- Session management

### Network Utilities
- Network scanning using ARP requests (Python)
- TCP-based device discovery (Node.js)
- Wake-on-LAN (WOL) functionality
- Remote device shutdown capabilities

### User Interface
- Modern, responsive design
- Dark/light theme support
- Real-time device status updates
- Interactive network topology view

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI components
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Python for network utilities
- WebSocket for real-time updates

## Development

### Code Structure

backend/
└── nodejs/
    ├── src/
    │   ├── config/
    │   │   ├── passport.ts        # Passport configuration
    │   │   └── database.ts        # Database configuration
    │   ├── controllers/
    │   │   ├── auth.controller.ts # Authentication controller
    │   │   └── user.controller.ts # User management controller
    │   ├── middleware/
    │   │   ├── auth.middleware.ts # Authentication middleware
    │   │   ├── errorHandler.ts    # Error handling middleware
    │   │   └── validate.ts        # Request validation middleware
    │   ├── models/
    │   │   └── User.ts           # User model
    │   ├── routes/
    │   │   ├── auth.routes.ts    # Authentication routes
    │   │   └── user.routes.ts    # User management routes
    │   ├── utils/
    │   │   ├── logger.ts         # Logging utility
    │   │   └── validators.ts     # Input validation utility
    │   └── server.ts             # Main application file
    ├── package.json
    └── tsconfig.json
frontend/
└── 
