import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware';
import AIService from '../services/ai.services';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const generateInsightsSchema = z.object({
  days: z.number().min(7).max(365).optional().default(30)
});

const categorizationSchema = z.object({
  description: z.string().min(1),
  merchantName: z.string().optional(),
  amount: z.number(),
  category: z.array(z.string()).optional()
});

/**
 * GET /api/ai/insights
 * Generate AI spending insights for user
 * FREE: Rule-based AI analysis
 */
router.get('/insights', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Get recent insights from database (cached)
    const recentInsights = await prisma.insight.findMany({
      where: { 
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // If we have recent insights, return them
    if (recentInsights.length > 0) {
      res.json({
        insights: recentInsights,
        generated_at: recentInsights[0]?.createdAt,
        cached: true,
        ai_engine: 'rule_based_free'
      });
      return;
    }

    // Generate new insights
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Get transactions for current and previous periods
    const [currentTransactions, previousTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: thirtyDaysAgo }
        },
        include: { account: true }
      }),
      prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
        },
        include: { account: true }
      })
    ]);

    // Generate AI insights
    const aiInsights = AIService.generateSpendingInsights(
      currentTransactions,
      previousTransactions
    );

    // Save insights to database
    const savedInsights = [];
    for (const insight of aiInsights) {
      const saved = await prisma.insight.create({
        data: {
          userId,
          type: insight.type,
          title: insight.title,
          message: insight.message,
          confidenceScore: insight.confidence,
          priority: insight.priority
        }
      });
      savedInsights.push(saved);
    }

    res.json({
      insights: savedInsights,
      generated_at: new Date(),
      cached: false,
      ai_engine: 'rule_based_free',
      transactions_analyzed: {
        current_period: currentTransactions.length,
        previous_period: previousTransactions.length
      }
    });

  } catch (error) {
    console.error('Generate insights error:', error);
    res.status(500).json({
      error: 'Failed to generate insights',
      message: 'Unable to analyze spending patterns'
    });
  }
});

/**
 * POST /api/ai/categorize
 * Test AI transaction categorization
 */
router.post('/categorize', async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = categorizationSchema.parse(req.body);
    
    const result = AIService.categorizeTransaction(validatedData);

    res.json({
      transaction: validatedData,
      ai_result: result,
      ai_engine: 'rule_based_free'
    });

  } catch (error) {
    console.error('Categorization error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues
      });
    }

    res.status(500).json({
      error: 'Categorization failed',
      message: 'Unable to categorize transaction'
    });
  }
});

/**
 * GET /api/ai/spending-analysis
 * Detailed spending analysis by category
 */
router.get('/spending-analysis', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 30;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get transactions grouped by AI category
    const transactions = await prisma.transaction.findMany({
      where: {
        account: { userId },
        date: { gte: startDate }
      },
      select: {
        amount: true,
        aiCategory: true,
        aiConfidence: true,
        description: true,
        date: true
      }
    });

    // Group by category
    const categoryAnalysis: Record<string, any> = {};
    let totalSpent = 0;

    transactions.forEach(transaction => {
      const category = transaction.aiCategory || 'Other';
      const amount = Math.abs(transaction.amount);
      totalSpent += amount;

      if (!categoryAnalysis[category]) {
        categoryAnalysis[category] = {
          category,
          total_spent: 0,
          transaction_count: 0,
          average_amount: 0,
          confidence_score: 0,
          largest_transaction: 0
        };
      }

      categoryAnalysis[category].total_spent += amount;
      categoryAnalysis[category].transaction_count++;
      categoryAnalysis[category].confidence_score = Math.max(
        categoryAnalysis[category].confidence_score,
        transaction.aiConfidence || 0
      );
      categoryAnalysis[category].largest_transaction = Math.max(
        categoryAnalysis[category].largest_transaction,
        amount
      );
    });

    // Calculate averages and percentages
    Object.values(categoryAnalysis).forEach((category: any) => {
      category.average_amount = category.total_spent / category.transaction_count;
      category.percentage_of_total = (category.total_spent / totalSpent) * 100;
    });

    // Sort by spending amount
    const sortedCategories = Object.values(categoryAnalysis)
      .sort((a: any, b: any) => b.total_spent - a.total_spent);

    res.json({
      period_days: days,
      total_spent: totalSpent,
      total_transactions: transactions.length,
      categories: sortedCategories,
      ai_engine: 'rule_based_free'
    });

  } catch (error) {
    console.error('Spending analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Unable to analyze spending data'
    });
  }
});

/**
 * GET /api/ai/subscriptions
 * Detect recurring subscriptions
 */
router.get('/subscriptions', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Get last 90 days of transactions
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const transactions = await prisma.transaction.findMany({
      where: {
        account: { userId },
        date: { gte: ninetyDaysAgo }
      },
      orderBy: { date: 'desc' }
    });

    // Detect subscriptions using AI
    const subscriptions = AIService.detectSubscriptions(transactions);
    
    // Calculate total monthly subscription cost
    const totalMonthlyCost = subscriptions.reduce((sum, sub) => 
      sum + Math.abs(sub.amount), 0
    );

    res.json({
      subscriptions: subscriptions.map(sub => ({
        description: sub.description,
        amount: Math.abs(sub.amount),
        last_charged: sub.date,
        merchant: sub.merchantName,
        category: sub.aiCategory,
        estimated_annual_cost: Math.abs(sub.amount) * 12
      })),
      summary: {
        total_subscriptions: subscriptions.length,
        monthly_cost: totalMonthlyCost,
        annual_cost: totalMonthlyCost * 12
      },
      ai_engine: 'rule_based_free'
    });

  } catch (error) {
    console.error('Subscriptions detection error:', error);
    res.status(500).json({
      error: 'Detection failed',
      message: 'Unable to detect subscriptions'
    });
  }
});

/**
 * POST /api/ai/budget-analysis
 * Analyze spending against budgets
 */
router.post('/budget-analysis', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Get user's budgets
    const budgets = await prisma.budget.findMany({
      where: { userId, isActive: true }
    });

    if (budgets.length === 0) {
      res.json({
        message: 'No budgets found',
        suggestion: 'Create budgets to get spending analysis',
        budgets: []
      });
    }

    // Get current month transactions
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        account: { userId },
        date: { gte: startOfMonth }
      }
    });

    // Analyze each budget
    const budgetAnalysis = [];
    
    for (const budget of budgets) {
      // Calculate spending in this category
      const categoryTransactions = transactions.filter(
        t => t.aiCategory === budget.category
      );
      
      const spent = categoryTransactions.reduce(
        (sum, t) => sum + Math.abs(t.amount), 0
      );

      const analysis = AIService.analyzeBudget(spent, budget.monthlyLimit);
      
      budgetAnalysis.push({
        category: budget.category,
        budget_limit: budget.monthlyLimit,
        amount_spent: spent,
        remaining: budget.monthlyLimit - spent,
        percentage_used: analysis.percentage,
        status: analysis.status,
        message: analysis.message,
        transaction_count: categoryTransactions.length,
        days_into_month: currentDate.getDate(),
        projected_monthly_spend: spent * (30 / currentDate.getDate())
      });
    }

    res.json({
      budget_analysis: budgetAnalysis,
      month: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      ai_engine: 'rule_based_free'
    });

  } catch (error) {
    console.error('Budget analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Unable to analyze budget performance'
    });
  }
});

/**
 * POST /api/ai/mark-insight-read
 * Mark insight as read
 */
router.post('/mark-insight-read/:insightId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { insightId } = req.params;
    const userId = req.user!.id;

    const insight = await prisma.insight.update({
      where: { 
        id: insightId,
        userId // Ensure user owns this insight
      },
      data: { isRead: true }
    });

    res.json({
      message: 'Insight marked as read',
      insight: {
        id: insight.id,
        title: insight.title,
        isRead: insight.isRead
      }
    });

  } catch (error) {
    console.error('Mark insight read error:', error);
    res.status(404).json({
      error: 'Insight not found',
      message: 'Unable to update insight'
    });
  }
});

/**
 * GET /api/ai/recommendations
 * Get personalized financial recommendations
 */
router.get('/recommendations', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // Get recent spending data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [transactions, budgets] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          account: { userId },
          date: { gte: thirtyDaysAgo }
        }
      }),
      prisma.budget.findMany({
        where: { userId, isActive: true }
      })
    ]);

    // Generate recommendations based on spending patterns
    const recommendations = [];
    
    // Group spending by category
    const categorySpending: Record<string, number> = {};
    transactions.forEach(t => {
      const category = t.aiCategory || 'Other';
      categorySpending[category] = (categorySpending[category] || 0) + Math.abs(t.amount);
    });

    // Food & Dining recommendations
    const foodSpending = categorySpending['Food & Dining'] || 0;
    if (foodSpending > 300) {
      recommendations.push({
        type: 'savings',
        category: 'Food & Dining',
        title: 'Reduce Dining Costs',
        description: `You spent ${foodSpending.toFixed(2)} on dining this month. Try meal prepping to save 30%.`,
        potential_savings: foodSpending * 0.3,
        effort: 'medium',
        priority: 'high'
      });
    }

    // Subscription recommendations
    const subscriptions = AIService.detectSubscriptions(transactions);
    if (subscriptions.length > 3) {
      const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + Math.abs(sub.amount), 0);
      recommendations.push({
        type: 'optimization',
        category: 'Subscriptions',
        title: 'Review Subscriptions',
        description: `You have ${subscriptions.length} subscriptions costing ${totalSubscriptions.toFixed(2)}/month. Consider canceling unused ones.`,
        potential_savings: totalSubscriptions * 0.2,
        effort: 'low',
        priority: 'medium'
      });
    }

    res.json({
      recommendations,
      analysis_period: '30 days',
      total_potential_savings: recommendations.reduce((sum, rec) => sum + (rec.potential_savings || 0), 0),
      ai_engine: 'rule_based_free'
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: 'Unable to create personalized recommendations'
    });
  }
});

export default router;
