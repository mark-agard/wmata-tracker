import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import trainRoutes from './routes/trainRoutes';

dotenv.config();

// Inline error handler
const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  console.error('Error:', err);

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Inline 404 handler
const notFoundHandler = (req: any, res: any, next: any) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
};

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/trains', trainRoutes);


if (isProduction) {
  const distPath = path.join(__dirname, '../../dist/browser');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(notFoundHandler);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
