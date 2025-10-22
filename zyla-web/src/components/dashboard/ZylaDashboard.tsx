import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Brain, 
  Home, 
  CreditCard, 
  PieChart, 
  Lightbulb, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logo from '../../assests/logo.png';
import './ZylaDashboard.css';

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
      className="btn-animated w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 smooth-transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          Connecting...
        </span>
      ) : (
        <>
          <Building2 size={20} color="white" />
          Connect Bank Account
        </>
      )}
    </button>
  );
};

// Lightweight skeleton helpers
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded ${className}`} />
);

const OverviewCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-28 mb-3" />
    <Skeleton className="h-7 w-32" />
  </div>
);

const AccountCardSkeleton = () => (
  <div className="p-4 rounded-xl glass-card">
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
  <div className="p-4 rounded-xl border bg-transparent border-white/20">
    <Skeleton className="h-4 w-40 mb-2" />
    <Skeleton className="h-3 w-56" />
  </div>
);

const TransactionItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-transparent border border-white/20">
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

const AccountItemSkeleton = () => (
  <div className="p-4 rounded-xl bg-transparent border border-white/20">
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

// Main Dashboard Component
const ZylaDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
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
    { name: 'Home', icon: <Home size={20} color="white" />, path: '/' },
    { name: 'Dashboard', icon: <PieChart size={20} color="white" />, path: '/dashboard' },
    { name: 'Transactions', icon: <CreditCard size={20} color="white" />, path: '/transactions' },
    { name: 'Accounts', icon: <Building2 size={20} color="white" />, path: '/accounts' },
    { name: 'Insights', icon: <Brain size={20} color="white" />, path: '/insights' },
    { name: 'Budgets', icon: <Lightbulb size={20} color="white" />, path: '/budgets' }
  ].map(item => ({
    ...item,
    active: item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#020617] to-[#0a1628] flex flex-col">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-transparent backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Zyla" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
          <span className="text-2xl font-bold text-white tracking-wide">Zyla</span>
        </div>
        <div className="flex items-center gap-2 bg-[#10182a] rounded-full px-2 py-1 shadow-md">
          <button className="px-4 py-2 rounded-full text-white font-medium hover:bg-indigo-600/20 transition">Dashboard</button>
          <button className="px-4 py-2 rounded-full text-white font-medium hover:bg-indigo-600/20 transition">Statistics</button>
          <button className="px-4 py-2 rounded-full text-white font-medium hover:bg-indigo-600/20 transition">Transactions</button>
          <button className="px-4 py-2 rounded-full text-white font-medium hover:bg-indigo-600/20 transition">My wallet</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition"><Settings size={20} color="white" /></button>
          <button className="p-2 rounded-full hover:bg-white/10 transition"><svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7" /><line x1="16" y1="16" x2="12.5" y2="12.5" /></svg></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {dashboardData?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </nav>
      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Cards Grid */}
        <section className="lg:col-span-2 grid grid-cols-1 gap-8">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
            <p className="text-gray-400">
              {loading ? <span className="inline-block"><Skeleton className="h-4 w-40" /></span> : <>Welcome back, {dashboardData?.user?.name}</>}
            </p>
          </div>

          {/* No Bank Connection Banner */}
          {!loading && !hasPlaidConnection && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 shadow-lg shadow-indigo-500/20">
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
            <div className="mb-8 p-6 rounded-2xl glass-card">
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
                <div className="stat-card glass-card rounded-2xl p-6 backdrop-blur-sm stagger-item">
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-container">
                      <Wallet size={32} color="white" />
                    </div>
                    <span className="badge-pulse text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                      {financialSummary.total_balance > 0 ? '+' : ''}{((financialSummary.net_cash_flow / Math.max(financialSummary.total_balance, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-white count-up">{formatCurrency(financialSummary.total_balance || 0)}</p>
                </div>

                <div className="stat-card glass-card rounded-2xl p-6 backdrop-blur-sm stagger-item" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-container">
                      <TrendingUp size={32} color="white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Monthly Spending</p>
                  <p className="text-2xl font-bold text-white count-up">{formatCurrency(financialSummary.monthly_spending || 0)}</p>
                </div>

                <div className="stat-card glass-card rounded-2xl p-6 backdrop-blur-sm stagger-item" style={{ animationDelay: '0.15s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-container">
                      <DollarSign size={32} color="white" />
                    </div>
                    <span className="badge-pulse text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400">
                      Income
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold text-white count-up">{formatCurrency(financialSummary.monthly_income || 0)}</p>
                </div>

                <div className="stat-card glass-card rounded-2xl p-6 backdrop-blur-sm stagger-item" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-container">
                      <Building2 size={32} color="white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Connected Accounts</p>
                  <p className="text-2xl font-bold text-white count-up">{financialSummary.accounts_count || 0}</p>
                </div>
              </>
            )}
          </div>

          {/* Accounts & Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Accounts List */}
            <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="section-header text-xl font-bold text-white mb-6">Your Accounts</h2>
              {loading ? (
                <div className="space-y-4">
                  <AccountItemSkeleton />
                  <AccountItemSkeleton />
                  <AccountItemSkeleton />
                </div>
              ) : accounts.length > 0 ? (
                <div className="space-y-4">
                  {accounts.map((account: any, index: number) => (
                    <div key={account.id} className="account-card p-4 rounded-xl bg-gray-900/50 smooth-transition" style={{ animationDelay: `${0.05 * index}s` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{account.name}</p>
                          <p className="text-sm text-gray-400">{account.type} • {account.subtype}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{formatCurrency(account.balances?.current || 0)}</p>
                          <p className="text-xs text-gray-400">{account.institution_name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No accounts connected yet</p>
                  <p className="text-xs text-gray-500 mt-2">Connect your bank to see your accounts</p>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="section-header text-xl font-bold text-white mb-6">Recent Transactions</h2>
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
                  {recentTransactions.slice(0, 6).map((transaction: any, index: number) => (
                    <div key={transaction.id} className="transaction-row flex items-center justify-between p-4 rounded-xl bg-gray-900/50 smooth-transition" style={{ animationDelay: `${0.05 * index}s` }}>
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
                    <CreditCard size={32} color="white" />
                  </div>
                  <p className="text-gray-400 mb-2">No transactions yet</p>
                  <p className="text-sm text-gray-500">Connect your bank to see your transactions</p>
                </div>
              )}
            </div>
          </div>

          {/* Spending by Category */}
          <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="section-header text-xl font-bold text-white mb-6">Spending by Category</h2>
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
                  <div key={index} className="stagger-item" style={{ animationDelay: `${0.05 * index}s` }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">{cat.category}</span>
                      <span className="text-sm font-semibold text-white count-up">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="category-bar bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full smooth-transition"
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
        </section>

        {/* Right Column: Insights, Cards, Subscriptions, etc. */}
        <aside className="lg:col-span-1 flex flex-col gap-8">
          {/* Insights */}
          <div className="glass-card rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="section-header text-xl font-bold text-white mb-6">AI Insights</h2>
            {loading ? (
              <div className="space-y-4">
                <InsightItemSkeleton />
                <InsightItemSkeleton />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight: any, index: number) => (
                  <div key={insight.id} className="p-4 rounded-xl bg-gray-900/50 smooth-transition stagger-item" style={{ animationDelay: `${0.05 * index}s` }}>
                    <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                    <p className="text-gray-300 text-sm">{insight.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No insights yet</p>
                <p className="text-xs text-gray-500 mt-2">Connect your bank to get personalized insights</p>
              </div>
            )}
          </div>
          {/* Add more right column widgets/cards here as needed */}
        </aside>
      </main>
    </div>
  );
};

export default ZylaDashboard;
