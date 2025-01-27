# Wake-on-LAN Web Interface

A modern web interface for managing Wake-on-LAN devices, built with React, TypeScript, and Tailwind CSS. This application allows you to remotely wake up computers on your network using the Wake-on-LAN protocol.

## 🚧 Project Status: Early Development

This project consists of two main parts:
- Frontend: React + TypeScript application with Shadcn/UI components
- Backend: Node.js + Express + TypeScript server

## Features

### Currently Implemented
- Modern UI with Shadcn/UI components
- Dark/Light theme support
- Basic routing setup
- Authentication foundation

### Coming Soon
- User authentication and authorization
- Device management
  - Add/Remove devices
  - Wake-on-LAN functionality
  - Device status monitoring
- Network scanning
- Device statistics
- Profile management

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui Components
- React Router v6
- React Query for data fetching
- React Hook Form for form handling
- Zod for validation

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Winston for logging
- Express-validator and Zod for validation

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MongoDB (for backend)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wol.git
cd wol
```

2. Frontend Setup:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

3. Backend Setup:
```bash
cd backend/nodejs
npm install
npm run dev
```

## Known Issues and Limitations

1. Authentication:
   - Login flow needs implementation
   - Session management to be added
   - Protected routes to be implemented

2. UI/UX:
   - Theme persistence needs implementation
   - Responsive design improvements needed
   - Loading states to be added

3. Development:
   - Path aliases configuration needs fixing
   - Environment variables setup required
   - API integration pending

## Contributing

This project is currently in active development. While contributions are welcome, please note that the codebase is subject to significant changes. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Security

This project implements several security measures:
- CORS protection
- Rate limiting
- Helmet for HTTP headers
- JWT for authentication
- Password hashing with bcrypt

## License

MIT

## Contact

If you have any questions or suggestions, please open an issue in the GitHub repository.