import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware';
import PlaidService from '../services/plaid-services';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const exchangeTokenSchema = z.object({
  public_token: z.string().min(1, 'Public token is required')
});

const syncTransactionsSchema = z.object({
  days: z.number().min(1).max(365).optional().default(30)
});

/**
 * POST /api/plaid/link-token
 * Create Plaid Link token for mobile app
 * FREE: Up to 500 API calls/month
 */
router.post('/link-token', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const userName = req.user!.name;

    const linkToken = await PlaidService.createLinkToken(userId, userName);

    res.json({
      message: 'Link token created successfully',
      link_token: linkToken,
      expiration: '30 minutes' // Plaid link tokens expire in 30 minutes
    });

  } catch (error) {
    console.error('Create link token error:', error);
    res.status(500).json({
      error: 'Failed to create link token',
      message: 'Unable to initialize bank connection. Please try again.'
    });
  }
});

/**
 * POST /api/plaid/exchange
 * Exchange public token for access token (after successful bank link)
 */
router.post('/exchange', async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { public_token } = exchangeTokenSchema.parse(req.body);
    const userId = req.user!.id;

    // Exchange tokens
    const { accessToken, itemId } = await PlaidService.exchangePublicToken(
      public_token,
      userId
    );

    // Sync accounts immediately after connection
    const accounts = await PlaidService.syncAccounts(userId);

    res.json({
      message: 'Bank successfully connected!',
      accounts_synced: accounts.length,
      accounts: accounts.map(account => ({
        id: account.id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.currentBalance
      }))
    });

  } catch (error) {
    console.error('Exchange token error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to connect bank',
      message: 'Unable to establish bank connection. Please try again.'
    });
  }
});

/**
 * GET /api/plaid/accounts
 * Get user's connected bank accounts
 */
router.get('/accounts', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const accounts = await PlaidService.getAccountBalances(userId);

    // Calculate total balances
    const totalBalance = accounts.reduce((sum, account) => 
      sum + (account.currentBalance || 0), 0
    );

    res.json({
      accounts,
      summary: {
        total_accounts: accounts.length,
        total_balance: totalBalance,
        last_updated: accounts[0]?.updatedAt || null
      }
    });

  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      error: 'Failed to get accounts',
      message: 'Unable to retrieve account information.'
    });
  }
});

/**
 * POST /api/plaid/sync-accounts
 * Manually sync accounts from Plaid
 */
router.post('/sync-accounts', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const accounts = await PlaidService.syncAccounts(userId);

    res.json({
      message: 'Accounts synced successfully',
      accounts_synced: accounts.length,
      accounts: accounts.map(account => ({
        id: account.id,
        name: account.name,
        type: account.type,
        balance: account.currentBalance,
        updated_at: account.updatedAt
      }))
    });

  } catch (error) {
    console.error('Sync accounts error:', error);
    res.status(500).json({
      error: 'Failed to sync accounts',
      message: error instanceof Error ? error.message : 'Sync failed'
    });
  }
});

/**
 * POST /api/plaid/sync-transactions
 * Sync transactions from Plaid with AI categorization
 * FREE Sandbox: 2+ years of test transaction data
 */
router.post('/sync-transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { days } = syncTransactionsSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await PlaidService.syncTransactions(userId, days);

    res.json({
      message: 'Transactions synced successfully',
      new_transactions: result.newTransactions,
      total_transactions: result.totalTransactions,
      period_days: days,
      ai_categorization: 'enabled'
    });

  } catch (error) {
    console.error('Sync transactions error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.issues
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to sync transactions',
      message: error instanceof Error ? error.message : 'Sync failed'
    });
  }
});

/**
 * GET /api/plaid/status
 * Check Plaid connection status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const accounts = await PlaidService.getAccountBalances(userId);
    const hasConnection = accounts.length > 0;

    res.json({
      connected: hasConnection,
      accounts_count: accounts.length,
      connection_health: hasConnection ? 'healthy' : 'not_connected',
      last_sync: accounts[0]?.updatedAt || null,
      environment: process.env.PLAID_ENVIRONMENT || 'sandbox'
    });

  } catch (error) {
    console.error('Plaid status error:', error);
    res.status(500).json({
      error: 'Failed to check status',
      message: 'Unable to verify connection status'
    });
  }
});

/**
 * DELETE /api/plaid/disconnect
 * Remove Plaid connection and delete all data
 */
router.delete('/disconnect', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    await PlaidService.removeConnection(userId);

    res.json({
      message: 'Bank connection removed successfully',
      note: 'All account and transaction data has been deleted'
    });

  } catch (error) {
    console.error('Disconnect Plaid error:', error);
    res.status(500).json({
      error: 'Failed to disconnect',
      message: 'Unable to remove bank connection'
    });
  }
});

export default router;