import React, { useState } from 'react';
import OverviewCards from './OverviewCards';
import RevenueChart from './RevenueChart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types
interface StatCard {
  id: number;
  label: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
  status: 'completed' | 'pending';
}

interface SpendingData {
  month: string;
  amount: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface Notification {
  id: number;
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
}

interface NavItem {
  name: string;
  icon: string;
  active: boolean;
}

// Mock Data
const overviewData: StatCard[] = [
  { id: 1, label: 'Net Worth', value: '$54,812', change: '+2.5%', icon: '💰', trend: 'up' },
  { id: 2, label: 'Total Balance', value: '$36,254', change: '-0.8%', icon: '💳', trend: 'down' },
  { id: 3, label: 'Monthly Budget', value: '$26,348', change: '+1.2%', icon: '📊', trend: 'up' },
  { id: 4, label: 'Investments', value: '$18,420', change: '+5.3%', icon: '📈', trend: 'up' }
];

const spendingData: SpendingData[] = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1398 },
  { month: 'Mar', amount: 3800 },
  { month: 'Apr', amount: 3908 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 3490 }
];

const categoryData: CategoryData[] = [
  { name: 'Groceries', value: 35, color: '#6366f1' },
  { name: 'Transport', value: 20, color: '#8b5cf6' },
  { name: 'Entertainment', value: 15, color: '#ec4899' },
  { name: 'Bills', value: 30, color: '#10b981' }
];

const recentTransactions: Transaction[] = [
  { id: 1, name: 'Netflix Subscription', amount: -15.99, date: '2025-01-03', category: 'Entertainment', status: 'completed' },
  { id: 2, name: 'Salary Deposit', amount: 3500.00, date: '2025-01-01', category: 'Income', status: 'completed' },
  { id: 3, name: 'Grocery Store', amount: -87.45, date: '2024-12-30', category: 'Groceries', status: 'pending' }
];

const notifications: Notification[] = [
  { id: 1, type: 'warning', message: 'Overspending on groceries this month', icon: '⚠️' },
  { id: 2, type: 'info', message: 'New subscription detected: Spotify Premium', icon: 'ℹ️' },
  { id: 3, type: 'success', message: 'Budget goal achieved! Great job!', icon: '✅' }
];

// Subcomponents
const StatCardComponent: React.FC<{ item: StatCard; isDarkMode: boolean }> = ({ item, isDarkMode }) => (
  <div className={`${
    isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
  } border rounded-2xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm hover:shadow-xl`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{item.icon}</span>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        item.trend === 'up' 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-red-500/20 text-red-400'
      }`}>
        {item.change}
      </span>
    </div>
    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{item.label}</p>
    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
  </div>
);

// Update the TransactionItem component
const TransactionItem: React.FC<{ transaction: Transaction; isDarkMode: boolean }> = ({ transaction, isDarkMode }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl ${
    isDarkMode ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-gray-50 hover:bg-gray-100'
  } transition-all duration-200`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        transaction.amount > 0 ? 'bg-green-500/20' : 'bg-indigo-500/20'
      }`}>
        {transaction.amount > 0 ? '↓' : '↑'}
      </div>
      <div>
        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.name}</p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.date}</p>
      </div>
    </div>
    <span className={`font-semibold ${
      transaction.amount > 0 
        ? 'text-green-500' 
        : isDarkMode ? 'text-white' : 'text-gray-900'
    }`}>
      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
    </span>
  </div>
);

const NotificationItem: React.FC<{ notification: Notification; isDarkMode: boolean }> = ({ notification, isDarkMode }) => (
  <div className={`p-4 rounded-xl ${
    notification.type === 'warning' 
      ? 'bg-yellow-500/10 border border-yellow-500/30' 
      : notification.type === 'success'
      ? 'bg-green-500/10 border border-green-500/30'
      : 'bg-blue-500/10 border border-blue-500/30'
  } transition-all duration-200`}>
    <div className="flex items-start gap-3">
      <span className="text-xl">{notification.icon}</span>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{notification.message}</p>
    </div>
  </div>
);

// Main Dashboard Component
const FinanceDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('USD');

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: '📊', active: true },
    { name: 'Transactions', icon: '💸', active: false },
    { name: 'Budgets', icon: '🎯', active: false },
    { name: 'Accounts', icon: '🏦', active: false },
    { name: 'Insights', icon: '📈', active: false },
    { name: 'Settings', icon: '⚙️', active: false }
  ];

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } transition-colors duration-300`}>
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${
        isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'
      } border-r backdrop-blur-xl transition-all duration-300 z-50`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              Ω
            </div>
            {sidebarOpen && <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Zyla</span>}
          </div>

          {/* Profile */}
          {sidebarOpen && (
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'} mb-6`}>
              <div className="flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mark" alt="Profile" className="w-12 h-12 rounded-full" />
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mark Wood</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>mark@example.com</p>
                </div>
              </div>
            </div>
          )}
       
      

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                    : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800/50' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-8`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back, Mark</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
<select 
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  className={`px-4 py-2 rounded-xl border ${
    isDarkMode 
      ? 'bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800/80' 
      : 'bg-white/90 border-gray-200 text-gray-900 hover:bg-white'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-colors duration-200`}
>
  <option>USD</option>
  <option>EUR</option>
  <option>INR</option>
</select>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'
              } hover:scale-110 transition-all duration-200`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Notification Bell */}
            <button className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            } hover:scale-110 transition-all duration-200 relative`}>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              🔔
            </button>
          </div>
        </div>

         {/* Overview Cards */}
        <div className="mb-8">
          <OverviewCards isDarkMode={isDarkMode} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Trends */}
          <div className={`lg:col-span-2 ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-2xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Flow</h2>
              <select className={`px-3 py-1.5 rounded-lg text-sm ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
          
  <ResponsiveContainer width="100%" height={250}>
  <BarChart data={spendingData}>
    <defs>
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
        <stop 
          offset="0%" 
          stopColor={isDarkMode ? '#ffffff' : '#4f46e5'} 
          stopOpacity={0.8} 
        />
        <stop 
          offset="100%" 
          stopColor={isDarkMode ? '#ffffff' : '#4f46e5'} 
          stopOpacity={0.4} 
        />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
    <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
    <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
    <Tooltip 
      contentStyle={{
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        border: 'none',
        borderRadius: '12px',
        color: isDarkMode ? '#ffffff' : '#000000'
      }}
    />
    <Bar 
      dataKey="amount" 
      fill="url(#barGradient)" 
      radius={[8, 8, 0, 0]} 
    />
  </BarChart>
</ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-2xl p-6 backdrop-blur-sm`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cat.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className={`lg:col-span-2 ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } border rounded-2xl p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transaction History</h2>
              <button className="text-indigo-500 text-sm font-medium hover:text-indigo-400 transition-colors">View All →</button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>

          {/* Notifications & Quick Actions */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-2xl p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alerts</h2>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${
              isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-2xl p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200">
                  + Add Transaction
                </button>
                <button className={`w-full ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                } py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200`}>
                  🏦 Connect Bank
                </button>
                <button className={`w-full ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                } py-3 rounded-xl font-medium hover:scale-105 transition-all duration-200`}>
                  ✏️ Edit Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;