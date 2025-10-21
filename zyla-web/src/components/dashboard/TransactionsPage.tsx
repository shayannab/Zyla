import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual API
const mockTransactions = [
  { id: '1', description: 'Netflix Subscription', merchantName: 'Netflix', amount: -15.99, date: '2025-01-20', category: 'Entertainment', aiCategory: 'Entertainment', type: 'debit', isPending: false },
  { id: '2', description: 'Salary Deposit', merchantName: 'Acme Corp', amount: 4200.00, date: '2025-01-15', category: 'Income', aiCategory: 'Income', type: 'credit', isPending: false },
  { id: '3', description: 'Grocery Store', merchantName: 'Whole Foods', amount: -127.45, date: '2025-01-18', category: 'Food & Dining', aiCategory: 'Food & Dining', type: 'debit', isPending: false },
  { id: '4', description: 'Gas Station', merchantName: 'Shell', amount: -45.20, date: '2025-01-17', category: 'Transportation', aiCategory: 'Transportation', type: 'debit', isPending: false },
  { id: '5', description: 'Amazon Purchase', merchantName: 'Amazon', amount: -89.99, date: '2025-01-16', category: 'Shopping', aiCategory: 'Shopping', type: 'debit', isPending: true },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(amount));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Food & Dining': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Transportation': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Entertainment': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Shopping': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Income': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Bills & Utilities': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Healthcare': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.merchantName && t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || t.aiCategory === categoryFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
      return 0;
    });

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.aiCategory)))];

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
              <p className="text-gray-400">Track and manage your spending</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <span>⬇️</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-white">{transactions.length}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="debit">Expenses</option>
                <option value="credit">Income</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Sort by:</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'date' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('amount')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'amount' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Amount
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Category</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">Amount</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-gray-700/50 hover:bg-gray-900/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        {transaction.merchantName && (
                          <p className="text-xs text-gray-400">{transaction.merchantName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(transaction.aiCategory)}`}>
                        {transaction.aiCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-lg font-semibold ${
                        transaction.type === 'credit' ? 'text-green-400' : 'text-white'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {transaction.isPending ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No transactions found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            ← Previous
          </button>
          <span className="text-gray-400 text-sm">Page 1 of 1</span>
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
