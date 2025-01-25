# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3c3d0ade-900a-4491-a1a3-2c2074e5511b

## Running the Application

To run this application, you'll need to start both the frontend and backend servers.

### 1. Start the Backend Server

First, navigate to the backend directory and start the Node.js server:

```sh
# Navigate to the nodejs backend directory
cd backend/nodejs

# Install dependencies (if not already installed)
npm install

# Start the backend server
node server.js
```

The backend server will run on http://localhost:3001

### 2. Start the Frontend Development Server

In a new terminal window, from the project root directory:

```sh
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on http://localhost:8080

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3c3d0ade-900a-4491-a1a3-2c2074e5511b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend Implementation

This project includes two backend implementations for network utilities:

**Python Backend**
- Located in `backend/python/network_utils.py`
- Requirements: `scapy`, `netifaces`
- Features:
  - Network scanning using ARP requests
  - Wake-on-LAN (WOL) functionality
  - Remote device shutdown capabilities
- Installation:
```sh
pip install scapy netifaces
```

**Node.js Backend**
- Located in `backend/nodejs/networkUtils.js`
- Uses built-in Node.js modules (`dgram`, `net`)
- Features:
  - Network scanning using TCP connections
  - Wake-on-LAN (WOL) functionality
  - Remote device shutdown capabilities
- Installation:
```sh
npm install
```

To use either backend:
1. Choose your preferred implementation (Python or Node.js)
2. Set up an API server (Flask/FastAPI for Python, Express for Node.js)
3. Create endpoints that utilize the network utility functions
4. Update the `API_BASE_URL` in `src/utils/networkUtils.ts` to point to your API server

Example API endpoints:
```
POST /api/network/scan - Scan network for devices
POST /api/network/wake - Wake a device using WOL
POST /api/network/shutdown - Shutdown a device
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3c3d0ade-900a-4491-a1a3-2c2074e5511b) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)