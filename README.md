## Project Overview

This project is designed to provide network utilities using both Python and Node.js. It features functionalities such as network scanning and Wake-on-LAN (WOL).

## Installation Requirements

To run this application, ensure you have the following installed:

- **Python**: Version 3.x
- **Node.js**: Version 14.x or higher

## Installation Instructions

### 1. Install Python Packages

To install the required Python packages, you can use the provided installation script or install them manually:

#### Using the Installation Script

Run the following command in your terminal:

```sh
python backend/python/install_requirements.py
```

#### Manually Install Packages

Alternatively, you can install the required packages using pip:

```sh
pip install scapy netifaces
```

### 2. Install Node.js Dependencies

Navigate to the Node.js backend directory and install the dependencies:

```sh
# Navigate to the nodejs backend directory
cd backend/nodejs

# Install dependencies (if not already installed)
npm install
```

## Running the Application

To run this application, you'll need to start both the frontend and backend servers.

### 1. Start the Backend Server

In the `backend/nodejs` directory, start the Node.js server:

```sh
# Start the backend server
node server.js
```

The backend server will run on [http://localhost:3001](http://localhost:3001).

### 2. Start the Frontend Development Server

In a new terminal window, from the project root directory:

```sh
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on [http://localhost:8080](http://localhost:8080).

## What Technologies Are Used for This Project?

This project is built with:

- Vite
- TypeScript
- React
- Tailwind CSS

### Backend Implementation

This project includes two backend implementations for network utilities:

**Python Backend**
- Located in `backend/python/network_utils.py`
- Features:
  - Network scanning using ARP requests
  - Wake-on-LAN (WOL) functionality
  - Remote device shutdown capabilities

**Node.js Backend**
- Located in `backend/nodejs/networkUtils.js`
- Uses built-in Node.js modules (`dgram`, `net`)
- Features:
  - Network scanning using TCP connections
  - Wake-on-LAN (WOL) functionality
  - Remote device shutdown capabilities

## Optional Run Method

To quickly launch both the backend and frontend servers, you can use the following commands in separate terminal windows:

```sh
# Start the backend server
cd backend/nodejs && node server.js &

# Start the frontend development server
cd .. && npm run dev
```

## How Can I Deploy This Project?

Simply follow the deployment instructions for your chosen platform.
