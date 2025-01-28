import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/user.routes';
import networkRoutes from './routes/network.routes';
import './config/database'; // This will initialize the database

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/network', networkRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});