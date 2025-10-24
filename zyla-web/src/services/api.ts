import axios from 'axios';

// API Base URL - uses proxy in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zyla_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('zyla_token');
      localStorage.removeItem('zyla_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  expiresIn: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  subtype: string;
  currentBalance: number;
  availableBalance: number;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  merchantName?: string;
  amount: number;
  category?: string;
  aiCategory?: string;
  aiConfidence?: number;
  date: string;
  account: {
    name: string;
    type: string;
  };
  type: 'debit' | 'credit';
  isPending: boolean;
}

export interface Insight {
  id: string;
  type: 'overspending' | 'trend' | 'recommendation' | 'alert';
  title: string;
  message: string;
  confidenceScore: number;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  currentSpend: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  user: User & { hasPlaidConnection: boolean };
  financial_summary: {
    total_balance: number;
    monthly_spending: number;
    monthly_income: number;
    net_cash_flow: number;
    accounts_count: number;
  };
  accounts: Account[];
  spending_by_category: Array<{
    category: string;
    amount: number;
  }>;
  budget_progress: Array<Budget & {
    spent: number;
    remaining: number;
    percentage: number;
    status: 'good' | 'warning' | 'over';
  }>;
  recent_transactions: Transaction[];
  recent_insights: Array<Insight & { isNew: boolean }>;
  last_updated: string;
}

export interface AICategorizationResult {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface SpendingAnalysis {
  period_days: number;
  total_spent: number;
  total_transactions: number;
  categories: Array<{
    category: string;
    total_spent: number;
    transaction_count: number;
    average_amount: number;
    confidence_score: number;
    largest_transaction: number;
    percentage_of_total: number;
  }>;
}

// Authentication API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  
  verify: (token: string) =>
    apiClient.post('/auth/verify', { token }),
  
  getMe: () =>
    apiClient.get<{ user: User; hasPlaidConnection: boolean; accountsCount: number }>('/auth/me'),
};

// User API
export const userAPI = {
  getDashboard: () =>
    apiClient.get<DashboardData>('/user/dashboard'),
  
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    days?: number;
    accountId?: string;
  }) => apiClient.get<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>('/user/transactions', { params }),
  
  setBudget: (data: { category: string; monthlyLimit: number }) =>
    apiClient.post<{ budget: Budget }>('/user/budget', data),
  
  getBudgets: () =>
    apiClient.get<{ budgets: Budget[] }>('/user/budgets'),
  
  deleteBudget: (budgetId: string) =>
    apiClient.delete(`/user/budget/${budgetId}`),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put<{ user: User }>('/user/profile', data),
  
  getStats: () =>
    apiClient.get<{
      stats: {
        connected_accounts: number;
        transactions_last_30_days: number;
        spending_last_30_days: number;
        active_budgets: number;
        ai_insights_generated: number;
      };
    }>('/user/stats'),
};

// Plaid API
export const plaidAPI = {
  createLinkToken: () =>
    apiClient.post<{ link_token: string; expiration: string }>('/plaid/link-token'),
  
  exchangeToken: (publicToken: string) =>
    apiClient.post<{
      accounts_synced: number;
      accounts: Array<{
        id: string;
        name: string;
        type: string;
        subtype: string;
        balance: number;
      }>;
    }>('/plaid/exchange', { public_token: publicToken }),
  
  getAccounts: () =>
    apiClient.get<{
      accounts: Account[];
      summary: {
        total_accounts: number;
        total_balance: number;
        last_updated: string;
      };
    }>('/plaid/accounts'),
  
  syncAccounts: () =>
    apiClient.post('/plaid/sync-accounts'),
  
  syncTransactions: (days?: number) =>
    apiClient.post<{
      new_transactions: number;
      total_transactions: number;
      period_days: number;
    }>('/plaid/sync-transactions', { days }),
  
  getStatus: () =>
    apiClient.get<{
      connected: boolean;
      accounts_count: number;
      connection_health: string;
      last_sync: string;
      environment: string;
    }>('/plaid/status'),
  
  disconnect: () =>
    apiClient.delete('/plaid/disconnect'),
};

// AI API
export const aiAPI = {
  getInsights: () =>
    apiClient.get<{
      insights: Insight[];
      generated_at: string;
      cached: boolean;
      ai_engine: string;
      transactions_analyzed?: {
        current_period: number;
        previous_period: number;
      };
    }>('/ai/insights'),
  
  categorizeTransaction: (data: {
    description: string;
    merchantName?: string;
    amount: number;
    category?: string[];
  }) => apiClient.post<{
    transaction: typeof data;
    ai_result: AICategorizationResult;
    ai_engine: string;
  }>('/ai/categorize', data),
  
  getSpendingAnalysis: (days?: number) =>
    apiClient.get<SpendingAnalysis>('/ai/spending-analysis', {
      params: { days }
    }),
  
  getSubscriptions: () =>
    apiClient.get<{
      subscriptions: Array<{
        description: string;
        amount: number;
        last_charged: string;
        merchant?: string;
        category?: string;
        estimated_annual_cost: number;
      }>;
      summary: {
        total_subscriptions: number;
        monthly_cost: number;
        annual_cost: number;
      };
    }>('/ai/subscriptions'),
  
  getBudgetAnalysis: () =>
    apiClient.get('/ai/budget-analysis'),
  
  markInsightRead: (insightId: string) =>
    apiClient.post(`/ai/mark-insight-read/${insightId}`),
  
  getRecommendations: () =>
    apiClient.get<{
      recommendations: Array<{
        type: string;
        category: string;
        title: string;
        description: string;
        potential_savings: number;
        effort: string;
        priority: string;
      }>;
      total_potential_savings: number;
    }>('/ai/recommendations'),
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'Food & Dining': 'category-food',
    'Transportation': 'category-transport',
    'Shopping': 'category-shopping',
    'Bills & Utilities': 'category-bills',
    'Entertainment': 'category-entertainment',
    'Healthcare': 'category-bills',
    'Travel': 'category-transport',
    'Other': 'category-other',
  };
  
  return categoryColors[category] || 'category-other';
};

export default apiClient;