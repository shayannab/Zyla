import express from 'express';
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import plaidRoutes from './routes/plaid.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

// CRITICAL: Validate environment variables
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'PLAID_CLIENT_ID', 'PLAID_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ FATAL: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Copy .env.example to .env and fill in the values!');
  process.exit(1); // Stop server if config is missing
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET is too short! Use at least 32 characters for security.');
}

console.log('✅ Environment variables validated successfully');


const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Rate limiting - FREE tier friendly
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Zyla AI Financial Assistant API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});



// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', error);
  
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zyla Backend Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Plaid Environment: ${process.env.PLAID_ENVIRONMENT || 'sandbox'}`);
});

export default app;