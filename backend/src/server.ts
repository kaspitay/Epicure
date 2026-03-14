import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import recipeRoutes from './routes/recipe';
import userRoutes from './routes/user';
import tagRoutes from './routes/tag';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// CORS
app.use(cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
});

// Test route
app.get('/test-compression', (_req: Request, res: Response) => {
  res.send('A'.repeat(100000));
});

// Routes
app.use('/api/recipe', recipeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tags', tagRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.send('Epicure API - TypeScript Edition');
});

// Connect to database
console.log('Connecting to MongoDB...');
mongoose
  .connect(MONGO, {
    dbName: 'Epicure',
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
