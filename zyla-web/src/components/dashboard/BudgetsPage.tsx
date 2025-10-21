import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Budget = {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  isActive: boolean;
};

type NewBudget = {
  category: string;
  monthlyLimit: number;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', monthlyLimit: 500, spent: 387, isActive: true },
  { id: '2', category: 'Transportation', monthlyLimit: 200, spent: 145, isActive: true },
  { id: '3', category: 'Entertainment', monthlyLimit: 150, spent: 180, isActive: true },
  { id: '4', category: 'Shopping', monthlyLimit: 300, spent: 245, isActive: true },
];

const BudgetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState<NewBudget>({
    category: 'Food & Dining',
    monthlyLimit: 500
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Other'
  ];

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'over' as const, color: 'red', message: 'Over budget!' };
    if (percentage >= 80) return { status: 'warning' as const, color: 'yellow', message: 'Approaching limit' };
    return { status: 'good' as const, color: 'green', message: 'On track' };
  };

  const handleAddBudget = () => {
    const newId = (budgets.length + 1).toString();
    setBudgets([
      ...budgets,
      {
        id: newId,
        category: newBudget.category,
        monthlyLimit: newBudget.monthlyLimit,
        spent: 0,
        isActive: true
      }
    ]);
    setShowAddModal(false);
    setNewBudget({ category: 'Food & Dining', monthlyLimit: 500 });
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
            <p className="text-gray-400">Set spending limits and track your progress</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center gap-2"
            >
              <span>+</span>
              Add Budget
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Budget</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalBudget)}</p>
            <p className="text-sm text-gray-400 mt-2">across {budgets.length} categories</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-gray-400 mt-2">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0'}% of budget
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Remaining</p>
            <p className={`text-3xl font-bold ${totalRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {totalRemaining >= 0 ? 'left to spend' : 'over budget'}
            </p>
          </div>
        </div>

        {/* Budget Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.monthlyLimit) * 100, 100);
            const remaining = budget.monthlyLimit - budget.spent;
            const budgetStatus = getBudgetStatus(budget.spent, budget.monthlyLimit);

            return (
              <div
                key={budget.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{budget.category}</h3>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      budgetStatus.status === 'over'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : budgetStatus.status === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {budgetStatus.message}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-2"
                  >
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.monthlyLimit)}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        budgetStatus.status === 'over'
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : budgetStatus.status === 'warning'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Spent</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(budget.spent)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Remaining</p>
                    <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Budget Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-indigo-500 hover:bg-gray-800/50 transition-all flex flex-col items-center justify-center min-h-[280px] group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">+</span>
            </div>
            <p className="text-lg font-semibold text-white mb-2">Add New Budget</p>
            <p className="text-sm text-gray-400">Set a spending limit for a category</p>
          </button>
        </div>

        {/* Add Budget Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Budget</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Monthly Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">$</span>
                    <input
                      type="number"
                      value={newBudget.monthlyLimit}
                      onChange={(e) => setNewBudget({ ...newBudget, monthlyLimit: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 pl-8 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      placeholder="500"
                      min={0}
                      step={50}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Set how much you want to spend on {newBudget.category} each month
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBudget}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                  >
                    Add Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Budget Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                <li>• Review your budgets monthly and adjust based on spending patterns</li>
                <li>• Set realistic limits based on your past 3 months of spending</li>
                <li>• Use our AI insights to identify areas where you can save more</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
