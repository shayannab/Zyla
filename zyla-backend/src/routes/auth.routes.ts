import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// JWT Helper
const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
      return; // Stop execution
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Register error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }
    
    // Add more specific error logging for debugging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
        error: 'Registration failed', 
        message: 'Unable to create account. Please try again.',
        detail: errorMessage
    });
  }
  return;
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    // Generate token
    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: 'Login successful', user: userWithoutPassword, token, expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.issues });
    }

    res.status(500).json({ error: 'Login failed', message: 'Unable to authenticate. Please try again.' });
  }
  return;

});

/**
 * POST /api/auth/verify
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required', message: 'Please provide a token to verify' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, plaidAccessToken: true, createdAt: true }
    });

    if (!user) return res.status(401).json({ error: 'Invalid token', message: 'User not found' });

    res.json({ message: 'Token valid', user, hasPlaidConnection: !!user.plaidAccessToken });
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token', message: 'Please log in again' });
    }
    res.status(500).json({ error: 'Verification failed', message: 'Unable to verify token' });
  }
  return;

});

/**
 * GET /api/auth/me
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided', message: 'Please include authentication token' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, plaidAccessToken: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found', message: 'User account no longer exists' });

    const userWithoutSensitive = { id: user.id, name: user.name, email: user.email, hasPlaidConnection: !!user.plaidAccessToken, createdAt: user.createdAt };
    res.json({ message: 'User data retrieved successfully', user: userWithoutSensitive });
  } catch (error) {
    console.error('Get user error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token', message: 'Please log in again' });
    }
    res.status(500).json({ error: 'Failed to get user data', message: 'Unable to retrieve user information' });
  }
  return;
});

export default router;
