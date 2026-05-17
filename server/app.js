import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './src/routes/index.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
