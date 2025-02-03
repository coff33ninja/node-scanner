import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config';
import { setupPassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter, securityHeaders, validateRequest } from './services/securityEnhancer';
import { auditLogger } from './services/auditLogger';
import { authRoutes } from './routes/auth.routes';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(securityHeaders);
app.use(auditLogger);

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});

const PORT = serverConfig.port || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
