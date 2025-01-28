# WOL (Wake-on-LAN) Project

A web application for managing and waking devices on your network using Wake-on-LAN functionality.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v16 or higher)
- MongoDB Community Server
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/coff33ninja/wol.git
cd wol
```

### 2. Set Up MongoDB

1. Download and install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Make sure the MongoDB service is running:
   - On Windows: Check Services (services.msc) for "MongoDB"
   - On Linux: `sudo systemctl status mongodb`

### 3. Backend Setup

```bash
cd backend/nodejs
npm install
```

Create a `.env` file in the `backend/nodejs` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wol

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npx ts-node -r tsconfig-paths/register src/server.ts
```

The backend should now be running on `http://localhost:5000`

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend  # or the root directory if frontend is there
npm install
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## Usage

### 1. Registration

1. Open `http://localhost:5173` in your browser
2. Click on the Register link
3. Fill in the registration form:
   - Username (3-20 characters, letters, numbers, underscores, hyphens)
   - Strong password
   - Valid email address
   - Full name
   - Accept terms and conditions
4. Submit the form

### 2. Login

1. Go to the login page
2. Enter your username and password
3. Optionally check "Remember me" to stay logged in
4. Click Login

### 3. Account Security

- After 5 failed login attempts, your account will be temporarily locked for 15 minutes
- Use a strong password that includes:
  - At least 8 characters
  - Mix of uppercase and lowercase letters
  - Numbers
  - Special characters

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check MongoDB connection string in `.env`
   - Ensure MongoDB port (27017) is not blocked

2. **Port Already in Use**
   - Change the PORT in `.env`
   - Check if another service is using port 5000

### Frontend Issues

1. **Login/Register Not Working**
   - Verify backend is running
   - Check browser console for errors
   - Ensure CORS_ORIGIN in backend `.env` matches frontend URL

2. **Network Errors**
   - Check if backend URL is correct
   - Verify network connectivity
   - Check browser console for CORS errors

## Development

### Backend Structure
