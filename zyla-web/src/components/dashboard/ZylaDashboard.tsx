import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Plaid Link Button Component
const PlaidLinkButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const API_BASE = 'http://localhost:5000';

  const initializeAndOpenPlaid = (linkToken: string, token: string | null) => {
    const plaid = (window as any).Plaid;
    if (!plaid || !plaid.create) return;
    const handler = plaid.create({
      token: linkToken,
      onSuccess: async (public_token: string) => {
        try {
          await fetch(`${API_BASE}/api/plaid/exchange`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ public_token })
          });
          if (onSuccess) onSuccess();
        } finally {
          setLoading(false);
        }
      },
      onExit: () => setLoading(false)
    });
    handler.open();
  };

  const openPlaidLink = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('zyla_token');

      // Create link token
      const response = await fetch(`${API_BASE}/api/plaid/link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // If Plaid script already loaded, use it directly
      if ((window as any).Plaid) {
        initializeAndOpenPlaid(data.link_token, token);
        return;
      }

      // Load Plaid Link script once
      const existing = document.querySelector('script[src*="plaid.com/link"]');
      if (existing) {
        existing.addEventListener('load', () => initializeAndOpenPlaid(data.link_token, token));
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.async = true;
        script.onload = () => initializeAndOpenPlaid(data.link_token, token);
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error('Plaid error:', error);
      alert('Failed to connect. Demo mode: pretending connection succeeded!');
      if (onSuccess) onSuccess();
      setLoading(false);
    }
  };

  return (
    <button
      onClick={openPlaidLink}
      disabled={loading}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50"
    >
      {loading ? 'Connecting...' : '🏦 Connect Bank Account'}
    </button>
  );
};

// Lightweight skeleton helpers
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-700/60 rounded ${className}`} />
);

const OverviewCardSkeleton = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-28 mb-3" />
    <Skeleton className="h-7 w-32" />
  </div>
);

const AccountItemSkeleton = () => (
  <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-24 ml-auto" />
        <Skeleton className="h-3 w-28 ml-auto" />
      </div>
    </div>
  </div>
);

const InsightItemSkeleton = () => (
  <div className="p-4 rounded-xl border bg-gray-900/40 border-gray-700">
    <Skeleton className="h-4 w-40 mb-2" />
    <Skeleton className="h-3 w-56" />
  </div>
);

const TransactionItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <Skeleton className="h-4 w-20" />
  </div>
);

const CategoryBarSkeleton = () => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

// Main Dashboard Component
const ZylaDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('zyla_token');

      // Fetch dashboard data
      const dashResponse = await fetch(`${API_BASE}/api/user/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch AI insights
      const insightsResponse = await fetch(`${API_BASE}/api/ai/insights`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ ok: false } as Response));

      if (dashResponse.ok) {
        const data = await dashResponse.json();
        setDashboardData(data);
      } else {
        // Mock data for demo
        setDashboardData({
          user: { id: '1', name: 'Demo User', email: 'demo@zyla.com', hasPlaidConnection: false },
          financial_summary: {
            total_balance: 24890.0,
            monthly_spending: 3420.5,
            monthly_income: 5200.0,
            net_cash_flow: 1779.5,
            accounts_count: 0
          },
          accounts: [],
          recent_transactions: [],
          spending_by_category: []
        });
      }

      if ((insightsResponse as any).ok) {
        const insightsData = await (insightsResponse as Response).json();
        setInsights(insightsData.insights || []);
      } else {
        setInsights([
          { id: '1', title: 'Connect Bank', message: 'Link your bank to get personalized insights', priority: 'high' },
          { id: '2', title: 'Start Tracking', message: 'Begin tracking your spending habits', priority: 'medium' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // Set demo data on error
      setDashboardData({
        user: { id: '1', name: 'Demo User', email: 'demo@zyla.com', hasPlaidConnection: false },
        financial_summary: {
          total_balance: 24890.0,
          monthly_spending: 3420.5,
          monthly_income: 5200.0,
          net_cash_flow: 1779.5,
          accounts_count: 0
        },
        accounts: [],
        recent_transactions: [],
        spending_by_category: []
      });
      setInsights([
        { id: '1', title: 'Connect Bank', message: 'Link your bank to get personalized insights', priority: 'high' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = () => {
    loadDashboardData();
    alert('Bank connected successfully! Data is syncing...');
  };

  const handleLogout = () => {
    localStorage.removeItem('zyla_token');
    localStorage.removeItem('zyla_user');
    window.location.href = '/login';
  };

  // Note: We now show inline skeletons instead of a blocking full-screen loader

  const hasPlaidConnection = dashboardData?.user?.hasPlaidConnection;
  const financialSummary = dashboardData?.financial_summary || {};
  const accounts = dashboardData?.accounts || [];
  const recentTransactions = dashboardData?.recent_transactions || [];
  const spendingByCategory = dashboardData?.spending_by_category || [];

  const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Transactions', icon: '💸', path: '/transactions' },
    { name: 'Accounts', icon: '🏦', path: '/accounts' },
    { name: 'Insights', icon: '🧠', path: '/insights' },
    { name: 'Budgets', icon: '🎯', path: '/budgets' }
  ].map(item => ({
    ...item,
    active: item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path)
  }));

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-64' : 'w-20'} bg-black/40 border-r border-gray-800 backdrop-blur-xl transition-all duration-300 z-50`}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              Z
            </div>
            {sidebarOpen && <span className="text-xl font-bold text-white">Zyla</span>}
          </div>

          {/* Profile */}
          {sidebarOpen && dashboardData?.user && (
            <div className="p-4 rounded-2xl bg-gray-800/50 mb-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {dashboardData.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{dashboardData.user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{dashboardData.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>

          {/* Logout */}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-4"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-8`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
            <p className="text-gray-400">
              {loading ? <span className="inline-block"><Skeleton className="h-4 w-40" /></span> : <>Welcome back, {dashboardData?.user?.name}</>}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* No Bank Connection Banner */}
        {!loading && !hasPlaidConnection && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Bank Account</h3>
                <p className="text-gray-300">Link your bank to get AI-powered insights and track your spending automatically</p>
              </div>
              <div className="w-full md:w-auto md:min-w-[250px]">
                <PlaidLinkButton onSuccess={handlePlaidSuccess} />
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="mb-8 p-6 rounded-2xl bg-gray-800/40 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>
              <div className="w-full md:w-auto md:min-w-[250px]">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <OverviewCardSkeleton />
              <OverviewCardSkeleton />
              <OverviewCardSkeleton />
              <OverviewCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💰</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                    {financialSummary.total_balance > 0 ? '+' : ''}{((financialSummary.net_cash_flow / Math.max(financialSummary.total_balance, 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialSummary.total_balance || 0)}</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-sm text-gray-400 mb-1">Monthly Spending</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialSummary.monthly_spending || 0)}</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💸</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                    Income
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(financialSummary.monthly_income || 0)}</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏦</span>
                </div>
                <p className="text-sm text-gray-400 mb-1">Connected Accounts</p>
                <p className="text-2xl font-bold text-white">{financialSummary.accounts_count || 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Accounts & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Accounts List */}
          <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Your Accounts</h2>
            {loading ? (
              <div className="space-y-4">
                <AccountItemSkeleton />
                <AccountItemSkeleton />
                <AccountItemSkeleton />
              </div>
            ) : accounts.length > 0 ? (
              <div className="space-y-4">
                {accounts.map((account: any) => (
                  <div key={account.id} className="p-4 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{account.name}</p>
                        <p className="text-sm text-gray-400">{account.type} • {account.subtype}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatCurrency(account.currentBalance)}</p>
                        <p className="text-xs text-gray-400">Available: {formatCurrency(account.availableBalance)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏦</span>
                </div>
                <p className="text-gray-400 mb-4">No accounts connected yet</p>
                <PlaidLinkButton onSuccess={handlePlaidSuccess} />
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-bold text-white">AI Insights</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                <InsightItemSkeleton />
                <InsightItemSkeleton />
                <InsightItemSkeleton />
                <InsightItemSkeleton />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-3">
                {insights.slice(0, 4).map((insight: any) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                      insight.priority === 'high'
                        ? 'bg-red-500/10 border-red-500/30'
                        : insight.priority === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                    <p className="text-xs text-gray-300">{insight.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Connect your bank to get AI-powered insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions & Spending */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
              <button 
                onClick={() => navigate('/transactions')}
                className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
              >
                View All →
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
                <TransactionItemSkeleton />
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.slice(0, 6).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{formatDate(transaction.date)} • {transaction.aiCategory || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${transaction.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💸</span>
                </div>
                <p className="text-gray-400 mb-2">No transactions yet</p>
                <p className="text-sm text-gray-500">Connect your bank to see your transactions</p>
              </div>
            )}
          </div>

          {/* Spending by Category */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">Spending by Category</h2>
            {loading ? (
              <div className="space-y-4">
                <CategoryBarSkeleton />
                <CategoryBarSkeleton />
                <CategoryBarSkeleton />
                <CategoryBarSkeleton />
                <CategoryBarSkeleton />
              </div>
            ) : spendingByCategory.length > 0 ? (
              <div className="space-y-4">
                {spendingByCategory.slice(0, 5).map((cat: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">{cat.category}</span>
                      <span className="text-sm font-semibold text-white">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(cat.amount / spendingByCategory[0].amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No spending data available yet</p>
                <p className="text-xs text-gray-500 mt-2">Connect your bank to track spending</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZylaDashboard;
