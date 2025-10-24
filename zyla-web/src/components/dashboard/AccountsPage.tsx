import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CreditCard as CreditCardIcon, MoreVertical, Plus, ChevronLeft } from 'lucide-react';
import { isDemoUser } from '../../utils/demoMode';

const AccountsPage: FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo-only mock data
    const demo = isDemoUser();
    setTimeout(() => {
      if (demo) {
        setAccounts([
          { id: '1', name: 'Chase Checking', type: 'depository', subtype: 'checking', currentBalance: 12450.50, availableBalance: 12450.50, institution: 'Chase' },
          { id: '2', name: 'Savings Account', type: 'depository', subtype: 'savings', currentBalance: 25680.00, availableBalance: 25680.00, institution: 'Chase' },
          { id: '3', name: 'Credit Card', type: 'credit', subtype: 'credit card', currentBalance: -842.30, availableBalance: 4157.70, institution: 'American Express' }
        ]);
      } else {
        setAccounts([]);
      }
      setLoading(false);
    }, 600);
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
  <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#020617] to-[#0a1628] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Accounts</h1>
              <p className="text-gray-400">Manage your connected bank accounts</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-white hover:underline underline-offset-4 px-0 py-0 bg-transparent border-0"
            >
              <ChevronLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white/5 border border-white/20 rounded-2xl p-8 mb-8 backdrop-blur-xl shadow-lg shadow-white/10 hover:shadow-white/20 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">Total Balance</p>
              <p className="text-4xl font-bold text-white">{formatCurrency(totalBalance)}</p>
              <p className="text-gray-400 mt-2">{accounts.length} accounts connected</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur hover:bg-white/20 hover:shadow-white/20 transition">
              <Plus size={18} />
              Add Account
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading accounts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      account.type === 'depository' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {account.type === 'depository' ? (
                        <Building2 size={22} color="white" />
                      ) : (
                        <CreditCardIcon size={22} color="white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                      <p className="text-sm text-gray-400">{account.institution}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical size={18} />
                  </button>
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

                <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                  <button 
                    onClick={() => navigate('/transactions')}
                    className="flex-1 bg-white/5 border border-white/20 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium backdrop-blur transition"
                  >
                    View Transactions
                  </button>
                  <button className="flex-1 bg-white/5 border border-white/20 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium backdrop-blur transition">
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
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Building2 size={36} />
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
