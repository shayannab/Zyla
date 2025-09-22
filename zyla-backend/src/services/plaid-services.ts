import dotenv from 'dotenv';
dotenv.config();

import { 
  PlaidApi, 
  Configuration, 
  PlaidEnvironments,
  LinkTokenCreateRequest,
  ItemPublicTokenExchangeRequest,
  AccountsGetRequest,
  TransactionsGetRequest,
  CountryCode,
  Products,
  DepositoryAccountSubtype
} from 'plaid';
import { PrismaClient } from '@prisma/client';
import { AIService } from './ai.services';

const prisma = new PrismaClient();

// Plaid configuration - FREE Sandbox environment
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENVIRONMENT as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET_KEY,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export class PlaidService {
  
  /**
   * Create Link Token for Plaid Link (mobile app)
   * FREE: Up to 500 API calls/month in sandbox
   */
  static async createLinkToken(userId: string, userName: string): Promise<string> {
    try {
      const request: LinkTokenCreateRequest = {
        user: {
          client_user_id: userId,
        },
        client_name: 'Zyla AI Financial Assistant',
        products: [Products.Transactions, Products.Auth] as Products[],
        country_codes: [CountryCode.Us],
        language: 'en',
        webhook: process.env.PLAID_WEBHOOK_URL, // Optional: for real-time updates
        account_filters: {
          depository: {
            account_subtypes: [DepositoryAccountSubtype.Checking, DepositoryAccountSubtype.Savings], // Focus on main accounts
          },
        },
      };

      const response = await plaidClient.linkTokenCreate(request);
      
      return response.data.link_token;
      
    } catch (error) {
      console.error('Plaid Link Token Error:', error);
      throw new Error('Failed to create link token');
    }
  }

  /**
   * Exchange public token for access token
   * This happens after user successfully links their bank
   */
  static async exchangePublicToken(
    publicToken: string, 
    userId: string
  ): Promise<{ accessToken: string; itemId: string }> {
    try {
      const request: ItemPublicTokenExchangeRequest = {
        public_token: publicToken,
      };

      const response = await plaidClient.itemPublicTokenExchange(request);
      const { access_token, item_id } = response.data;

      // Save access token to user record
      await prisma.user.update({
        where: { id: userId },
        data: {
          plaidAccessToken: access_token,
          plaidItemId: item_id
        }
      });

      return {
        accessToken: access_token,
        itemId: item_id
      };
      
    } catch (error) {
      console.error('Plaid Token Exchange Error:', error);
      throw new Error('Failed to exchange token');
    }
  }

  /**
   * Fetch user accounts from Plaid and save to database
   */
  static async syncAccounts(userId: string): Promise<any[]> {
    try {
      // Get user's Plaid access token
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plaidAccessToken: true }
      });

      if (!user?.plaidAccessToken) {
        throw new Error('No Plaid connection found');
      }

      const request: AccountsGetRequest = {
        access_token: user.plaidAccessToken,
      };

      const response = await plaidClient.accountsGet(request);
      const accounts = response.data.accounts;

      // Save accounts to database
      const savedAccounts = [];
      
      for (const account of accounts) {
        const savedAccount = await prisma.account.upsert({
          where: {
            userId_plaidAccountId: {
              userId,
              plaidAccountId: account.account_id
            }
          },
          update: {
            name: account.name,
            officialName: account.official_name || account.name,
            type: account.type,
            subtype: account.subtype || 'unknown',
            currentBalance: account.balances.current,
            availableBalance: account.balances.available,
            isoCurrencyCode: account.balances.iso_currency_code || 'USD',
            updatedAt: new Date()
          },
          create: {
            userId,
            plaidAccountId: account.account_id,
            name: account.name,
            officialName: account.official_name || account.name,
            type: account.type,
            subtype: account.subtype || 'unknown',
            currentBalance: account.balances.current,
            availableBalance: account.balances.available,
            isoCurrencyCode: account.balances.iso_currency_code || 'USD'
          }
        });

        savedAccounts.push(savedAccount);
      }

      return savedAccounts;
      
    } catch (error) {
      console.error('Plaid Accounts Sync Error:', error);
      throw new Error('Failed to sync accounts');
    }
  }

  /**
   * Fetch transactions and apply AI categorization
   * FREE Sandbox: Access to 2+ years of test transaction data
   */
  static async syncTransactions(
    userId: string, 
    days: number = 30
  ): Promise<{ newTransactions: number; totalTransactions: number }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plaidAccessToken: true, accounts: true }
      });

      if (!user?.plaidAccessToken) {
        throw new Error('No Plaid connection found');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();

      const request: TransactionsGetRequest = {
        access_token: user.plaidAccessToken,
        start_date: startDate.toISOString().split('T')[0]!,
        end_date: endDate.toISOString().split('T')[0]!,
      };

      const response = await plaidClient.transactionsGet(request);
      const transactions = response.data.transactions;

      let newTransactionsCount = 0;

      // Process each transaction
      for (const transaction of transactions) {
        // Find corresponding account
        const account = user.accounts.find(
          acc => acc.plaidAccountId === transaction.account_id
        );

        if (!account) continue; // Skip if account not found

        // Import AI service for categorization
        
        // AI categorize transaction
        const aiResult = AIService.categorizeTransaction({
          description: transaction.name,
          merchantName: transaction.merchant_name || undefined,
          amount: transaction.amount,
          category: transaction.category || undefined
        });

        // Save transaction to database
        try {
          await prisma.transaction.create({
            data: {
              accountId: account.id,
              plaidTransactionId: transaction.transaction_id,
              amount: transaction.amount,
              description: transaction.name,
              merchantName: transaction.merchant_name,
              category: transaction.category || undefined,
              aiCategory: aiResult.category,
              aiConfidence: aiResult.confidence,
              date: new Date(transaction.date),
              isoCurrencyCode: transaction.iso_currency_code || 'USD',
              isPending: transaction.pending
            }
          });
          
          newTransactionsCount++;
          
        } catch (error) {
          // Transaction already exists (duplicate), skip
          if ((error as any).code === 'P2002') continue;
          throw error;
        }
      }

      return {
        newTransactions: newTransactionsCount,
        totalTransactions: transactions.length
      };
      
    } catch (error) {
      console.error('Plaid Transactions Sync Error:', error);
      throw new Error('Failed to sync transactions');
    }
  }

  /**
   * Get account balances (for dashboard)
   */
  static async getAccountBalances(userId: string): Promise<any[]> {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          type: true,
          subtype: true,
          currentBalance: true,
          availableBalance: true,
          isoCurrencyCode: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      return accounts;
      
    } catch (error) {
      console.error('Get Account Balances Error:', error);
      throw new Error('Failed to get account balances');
    }
  }

  /**
   * Remove Plaid connection (unlink bank)
   */
  static async removeConnection(userId: string): Promise<void> {
    try {
      // Clear Plaid tokens from user
      await prisma.user.update({
        where: { id: userId },
        data: {
          plaidAccessToken: null,
          plaidItemId: null
        }
      });

      // Optionally: Delete all accounts and transactions
      await prisma.account.deleteMany({
        where: { userId }
      });
      
    } catch (error) {
      console.error('Remove Plaid Connection Error:', error);
      throw new Error('Failed to remove bank connection');
    }
  }
}

export default PlaidService;