import mongoose from 'mongoose';
import { serverConfig } from './server.config';

mongoose.connect(serverConfig.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default mongoose.connection;