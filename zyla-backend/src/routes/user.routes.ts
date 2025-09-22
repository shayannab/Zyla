import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const setBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthlyLimit: z.number().min(0, 'Budget must be positive')
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional()
});

/**
 * GET /api/user/dashboard
 * Main dashboard data with overview
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get all user data in parallel
    const [
      accounts,
      recentTransactions,
      monthlyTransactions,
      budgets,
      recentInsights
    ] = await Promise.all([
      // Accounts with balances
      prisma.account.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          type: true,
          subtype: true,
          currentBalance: true,
          availableBalance: true,
          updatedAt: true
        }
      }),
      
      // Recent transactions (last 30 days)
      prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: thirtyDaysAgo }
        },
        include: { account: { select: { name: true } } },
        orderBy: { date: 'desc' },
        take: 10
      }),

      // Current month transactions for spending summary
      prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: startOfMonth }
        },
        select: {
          amount: true,
          aiCategory: true,
          date: true
        }
      }),

      // User budgets
      prisma.budget.findMany({
        where: { userId, isActive: true },
        orderBy: { category: 'asc' }
      }),

      // Recent AI insights
      prisma.insight.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Calculate financial summary
    const totalBalance = accounts.reduce((sum, account) => 
      sum + (account.currentBalance || 0), 0
    );

    const monthlySpending = monthlyTransactions.reduce((sum, transaction) => 
      sum + (transaction.amount > 0 ? transaction.amount : 0), 0
    );

    const monthlyIncome = monthlyTransactions.reduce((sum, transaction) => 
      sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0), 0
    );

    // Spending by category (current month)
    const categorySpending: Record<string, number> = {};
    monthlyTransactions.forEach(transaction => {
      if (transaction.amount > 0) { // Only outflows
        const category = transaction.aiCategory || 'Other';
        categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
      }
    });

    // Budget progress
    const budgetProgress = budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
      
      return {
        ...budget,
        spent,
        remaining: budget.monthlyLimit - spent,
        percentage,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });

    // Recent transaction summary
    const formattedTransactions = recentTransactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.aiCategory,
      date: transaction.date,
      account: transaction.account.name,
      type: transaction.amount > 0 ? 'debit' : 'credit'
    }));

    res.json({
      user: {
        name: req.user!.name,
        email: req.user!.email,
        hasPlaidConnection: accounts.length > 0
      },
      financial_summary: {
        total_balance: totalBalance,
        monthly_spending: monthlySpending,
        monthly_income: monthlyIncome,
        net_cash_flow: monthlyIncome - monthlySpending,
        accounts_count: accounts.length
      },
      accounts: accounts.map(account => ({
        ...account,
        displayBalance: account.currentBalance?.toFixed(2) || '0.00'
      })),
      spending_by_category: Object.entries(categorySpending)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount),
      budget_progress: budgetProgress,
      recent_transactions: formattedTransactions,
      recent_insights: recentInsights.map(insight => ({
        ...insight,
        isNew: !insight.isRead
      })),
      last_updated: new Date()
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to load dashboard',
      message: 'Unable to retrieve dashboard data'
    });
  }
});

/**
 * GET /api/user/transactions
 * Get user transactions with filtering
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { 
      page = 1, 
      limit = 20, 
      category, 
      days = 30,
      accountId 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    // Build filter conditions
    const whereConditions: any = {
      account: { userId },
      date: { gte: startDate }
    };

    if (category && category !== 'all') {
      whereConditions.aiCategory = category;
    }

    if (accountId) {
      whereConditions.accountId = accountId;
    }

    // Get transactions with pagination
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: whereConditions,
        include: {
          account: { select: { name: true, type: true } }
        },
        orderBy: { date: 'desc' },
        skip: offset,
        take: Number(limit)
      }),
      
      prisma.transaction.count({ where: whereConditions })
    ]);

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      merchantName: transaction.merchantName,
      amount: transaction.amount,
      category: transaction.aiCategory,
      aiConfidence: transaction.aiConfidence,
      date: transaction.date,
      account: {
        name: transaction.account.name,
        type: transaction.account.type
      },
      type: transaction.amount > 0 ? 'debit' : 'credit',
      isPending: transaction.isPending
    }));

    res.json({
      transactions: formattedTransactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
        hasNext: offset + Number(limit) < totalCount,
        hasPrev: Number(page) > 1
      },
      filters: {
        category,
        days: Number(days),
        accountId
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to get transactions',
      message: 'Unable to retrieve transaction data'
    });
  }
});

/**
 * POST /api/user/budget
 * Set or update budget for a category
 */
router.post('/budget', async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = setBudgetSchema.parse(req.body);
    const { category, monthlyLimit } = validatedData;
    const userId = req.user!.id;

    const budget = await prisma.budget.upsert({
      where: {
        userId_category: {
          userId,
          category
        }
      },
      update: {
        monthlyLimit,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId,
        category,
        monthlyLimit,
        isActive: true
      }
    });

    res.json({
      message: 'Budget updated successfully',
      budget: {
        id: budget.id,
        category: budget.category,
        monthlyLimit: budget.monthlyLimit,
        isActive: budget.isActive
      }
    });

  } catch (error) {
    console.error('Set budget error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to set budget',
      message: 'Unable to save budget settings'
    });
  }
});

/**
 * GET /api/user/budgets
 * Get all user budgets
 */
router.get('/budgets', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { category: 'asc' }
    });

    res.json({
      budgets: budgets.map(budget => ({
        id: budget.id,
        category: budget.category,
        monthlyLimit: budget.monthlyLimit,
        currentSpend: budget.currentSpend,
        isActive: budget.isActive,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      error: 'Failed to get budgets',
      message: 'Unable to retrieve budget data'
    });
  }
});

/**
 * DELETE /api/user/budget/:budgetId
 * Delete a budget
 */
router.delete('/budget/:budgetId', async (req: Request, res: Response) => {
  try {
    const { budgetId } = req.params;
    const userId = req.user!.id;

    await prisma.budget.delete({
      where: {
        id: budgetId,
        userId // Ensure user owns this budget
      }
    });

    res.json({
      message: 'Budget deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(404).json({
      error: 'Budget not found',
      message: 'Unable to delete budget'
    });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const userId = req.user!.id;

    // Check if email is already taken (if updating email)
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email.toLowerCase(),
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        res.status(400).json({
          error: 'Email already taken',
          message: 'This email is already associated with another account'
        });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        email: validatedData.email?.toLowerCase()
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to update profile',
      message: 'Unable to save profile changes'
    });
  }
});

/**
 * GET /api/user/stats
 * Get user statistics and overview
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      accountCount,
      transactionCount,
      totalSpending,
      budgetCount,
      insightCount
    ] = await Promise.all([
      prisma.account.count({ where: { userId } }),
      prisma.transaction.count({
        where: {
          account: { userId },
          date: { gte: thirtyDaysAgo }
        }
      }),
      prisma.transaction.aggregate({
        where: {
          account: { userId },
          date: { gte: thirtyDaysAgo },
          amount: { gt: 0 } // Only spending (positive amounts)
        },
        _sum: { amount: true }
      }),
      prisma.budget.count({ where: { userId, isActive: true } }),
      prisma.insight.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo }
        }
      })
    ]);

    res.json({
      stats: {
        connected_accounts: accountCount,
        transactions_last_30_days: transactionCount,
        spending_last_30_days: totalSpending._sum.amount || 0,
        active_budgets: budgetCount,
        ai_insights_generated: insightCount
      },
      period: '30 days',
      generated_at: new Date()
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Unable to retrieve user statistics'
    });
  }
});

export default router;