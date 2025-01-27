# Wake-on-LAN Web Interface

A modern web interface for managing Wake-on-LAN devices, built with React, TypeScript, and Tailwind CSS.

## 🚧 Project Status: Early Development

**Note: This project is currently in early development and contains several known issues:**

- Login page rendering issues
- Path resolution problems with imports
- Authentication flow needs improvement
- Component loading issues
- Route protection implementation incomplete

These issues are being actively worked on and will be resolved in upcoming updates.

## Features (Planned)

- User authentication and authorization
- Device management
- Wake-on-LAN functionality
- Network scanning
- Device statistics
- Profile management
- Dark/Light theme support

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Router v6
- React Query
- Vite

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Known Issues and Limitations

1. Authentication:
   - Login page may show blank initially
   - Session management needs improvement
   - Protected routes implementation incomplete

2. UI/UX:
   - Theme switching might not persist
   - Layout issues on certain screen sizes
   - Loading states need refinement

3. Development:
   - Path aliases (@/) not working consistently
   - Component hot reloading issues
   - TypeScript type definitions need enhancement

## Contributing

This project is currently in active development. Contributions are welcome but please note that the codebase is subject to significant changes.

## License

MIT