# WOL (Wake-on-LAN) Project

A web application for managing and waking devices on your network using Wake-on-LAN functionality, with support for distributed server nodes reporting to a central hub.

## Server Modes

The application can run in three modes:
- **Standalone**: Single server setup (default)
- **Hub**: Central server that receives reports from nodes
- **Node**: Server instance that reports to a hub

### Configuration

Set the server mode in your `.env` file:
```env
SERVER_MODE=standalone  # or 'hub' or 'node'
HUB_URL=http://localhost:5000  # Required if SERVER_MODE=node
```

### Node-Hub Communication
- Nodes report to the hub every 30 seconds
- Metrics include CPU usage, memory usage, and network statistics
- Each node maintains its own database while sending relevant data to the hub

## Default Admin Credentials (Development Only)

⚠️ **WARNING: These are default development credentials. Change them before deploying to production!**

```
Username: admin
Password: abcd1234!
Email: admin@abcd.1234
```

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **SQLite3**
- **Git**
- **Python** (if using any Python scripts)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/coff33ninja/alttab.git
cd alttab
```

### 2. Set Up SQLite3

- Install SQLite3 if you haven’t already. You can download it from the [SQLite Download Page](https://sqlite.org/download.html).
- No additional service needs to be running for SQLite3 as it is file-based.

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

Start the backend server:

```bash
npx ts-node -r tsconfig-paths/register src/server.ts
```

The backend should now be running on `http://localhost:5000`.

### 4. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running on `http://localhost:3000`.

---

## Usage

### 1. Initial Setup

1. After installation, use the default admin credentials to log in:
   - Username: `admin`
   - Password: `abcd1234!`
   - Email: `admin@abcd.1234`
2. **IMPORTANT**: Immediately change these credentials after first login
3. Create additional user accounts as needed

### 2. Registration

1. Open `http://localhost:3000` in your browser.
2. Click on the **Register** link.
3. Fill in the registration form:
   - Username (3-20 characters, letters, numbers, underscores, hyphens)
   - Strong password
   - Valid email address
   - Full name
   - Accept terms and conditions
4. Submit the form.

### 3. Login

1. Go to the login page.
2. Enter your username and password.
3. Optionally check **Remember me** to stay logged in.
4. Click **Login**.

### 4. Account Security

- After **5 failed login attempts**, your account will be temporarily locked for 15 minutes.
- Use a strong password that includes:
  - At least 8 characters
  - Mix of uppercase and lowercase letters
  - Numbers
  - Special characters

---

## Troubleshooting

### Backend Issues

#### SQLite Connection Failed

- Verify the database file path in `.env`.
- Ensure the SQLite file is accessible and not locked.

#### Port Already in Use

- Change the `PORT` in `.env`.
- Check if another service is using port 5000.

### Frontend Issues

#### Login/Register Not Working

- Verify the backend is running.
- Check the browser console for errors.
- Ensure `CORS_ORIGIN` in the backend `.env` matches the frontend URL.

#### Network Errors

- Check if the backend URL is correct.
- Verify network connectivity.
- Check the browser console for CORS errors.

---

## Development

### Backend Structure

- `backend/nodejs/src/config/`: Configuration files for the application.
- `backend/nodejs/src/controllers/`: Controllers for handling requests.
- `backend/nodejs/src/models/`: Database models.
- `backend/nodejs/src/routes/`: API routes.
- `backend/nodejs/src/services/`: Services for database interactions.
- `backend/python/`: Python scripts for additional functionality (if any).

### Frontend Structure

- `frontend/src/`: Main source directory for the frontend application.
- `frontend/src/components/`: React components.
- `frontend/src/pages/`: Page components for routing.
- `frontend/src/services/`: Services for API interactions.

## Project Structure

### Reference Files
The project includes comprehensive reference files that document the structure and patterns used throughout the codebase:

- `backend/nodejs/src/reference.json`: Contains backend patterns, imports, and type definitions
- `src/reference.json`: Contains frontend patterns, component structures, and common code snippets

These files serve as documentation and guidelines for:
- Import patterns
- Type definitions
- Controller patterns
- Middleware configurations
- Database operations
- Component structures
- Common code patterns
- Error handling
- Security implementations

Developers should consult these files when:
- Adding new features
- Following project patterns
- Understanding type definitions
- Implementing security measures
- Setting up new components

---

