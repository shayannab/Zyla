import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setAccounts([
        { id: '1', name: 'Chase Checking', type: 'depository', subtype: 'checking', currentBalance: 12450.50, availableBalance: 12450.50, institution: 'Chase' },
        { id: '2', name: 'Savings Account', type: 'depository', subtype: 'savings', currentBalance: 25680.00, availableBalance: 25680.00, institution: 'Chase' },
        { id: '3', name: 'Credit Card', type: 'credit', subtype: 'credit card', currentBalance: -842.30, availableBalance: 4157.70, institution: 'American Express' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const totalBalance = accounts
    .filter(a => a.type === 'depository')
    .reduce((sum, a) => sum + a.currentBalance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Accounts</h1>
              <p className="text-gray-400">Manage your connected bank accounts</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">Total Balance</p>
              <p className="text-4xl font-bold text-white">{formatCurrency(totalBalance)}</p>
              <p className="text-gray-400 mt-2">{accounts.length} accounts connected</p>
            </div>
            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              + Add Account
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading accounts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      account.type === 'depository' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {account.type === 'depository' ? '🏦' : '💳'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                      <p className="text-sm text-gray-400">{account.institution}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">⋮</button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Type</span>
                    <span className="text-white font-medium capitalize">{account.subtype}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Balance</span>
                    <span className={`text-xl font-bold ${account.currentBalance >= 0 ? 'text-white' : 'text-red-400'}`}>
                      {account.currentBalance >= 0 ? '' : '-'}{formatCurrency(account.currentBalance)}
                    </span>
                  </div>
                  {account.type === 'credit' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Available Credit</span>
                      <span className="text-green-400 font-semibold">{formatCurrency(account.availableBalance)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex gap-3">
                  <button 
                    onClick={() => navigate('/transactions')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Transactions
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && accounts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏦</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Connected</h3>
            <p className="text-gray-400 mb-6">Connect your bank account to get started</p>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              Connect Bank Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
