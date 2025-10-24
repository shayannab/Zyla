import { type ReactNode, type FC } from 'react';
import { Wallet, CreditCard, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewCard {
  id: number;
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const overviewData: OverviewCard[] = [
  { id: 1, label: 'Net Worth', value: '$54,812', change: '+2.5%', icon: <Wallet size={22} color="white" />, trend: 'up' },
  { id: 2, label: 'Total Balance', value: '$36,254', change: '-0.8%', icon: <CreditCard size={22} color="white" />, trend: 'down' },
  { id: 3, label: 'Monthly Budget', value: '$26,348', change: '+1.2%', icon: <BarChart3 size={22} color="white" />, trend: 'up' },
  { id: 4, label: 'Investments', value: '$18,420', change: '+5.3%', icon: <TrendingUp size={22} color="white" />, trend: 'up' }
];

const OverviewCards: FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((card) => (
        <div
          key={card.id}
          className={`${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90 border-gray-200'
          } relative border rounded-2xl p-6 group hover:scale-105 transition-all duration-300 backdrop-blur-sm
          hover:shadow-lg hover:shadow-indigo-500/10`}
        >
          {/* Icon and Badge Container */}
          <div className="flex items-center justify-between mb-4">
            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${card.trend === 'up' ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' 
              : 'bg-gradient-to-br from-red-500/20 to-pink-500/20'}`}>
              {card.icon}
            </div>
            
            {/* Trend Badge */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
              ${card.trend === 'up' 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'}`}>
              {card.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.change}
            </div>
          </div>

          {/* Card Content */}
          <div className="space-y-1">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {card.label}
            </p>
            <p className={`text-2xl font-bold tracking-tight 
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {card.value}
            </p>
          </div>

          {/* Hover Effect Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;