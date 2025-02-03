# Installation Guide

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **SQLite3**
- **Git**
- **Python** (if using any Python scripts)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/coff33ninja/alttab.git
cd alttab
```

### 2. Set Up SQLite3

- Install SQLite3 if you haven't already
- No additional service needs to be running for SQLite3 as it is file-based

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend/nodejs
npm install
```

Create a `.env` file in the `backend/nodejs` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# SQLite Configuration
DATABASE_FILE=./database.sqlite

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security
CORS_ORIGIN=http://localhost:3000
```

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```