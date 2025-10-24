import { useState, type FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  period: string;
  amount: number;
}

const monthlyData: RevenueData[] = [
  { period: 'Jan', amount: 34500 },
  { period: 'Feb', amount: 28900 },
  { period: 'Mar', amount: 42300 },
  { period: 'Apr', amount: 39800 },
  { period: 'May', amount: 45200 },
  { period: 'Jun', amount: 47800 },
];

const weeklyData: RevenueData[] = [
  { period: 'Week 1', amount: 11200 },
  { period: 'Week 2', amount: 13400 },
  { period: 'Week 3', amount: 10800 },
  { period: 'Week 4', amount: 12300 },
];

const RevenueChart: FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');
  const data = timeframe === 'monthly' ? monthlyData : weeklyData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/90 border-gray-200'
    } border rounded-2xl p-6 backdrop-blur-sm transition-all duration-300`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Revenue Flow
        </h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'monthly' | 'weekly')}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors duration-200
            ${isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-gray-50 border-gray-200 text-gray-900'}`}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } border border-gray-700 rounded-lg p-2 shadow-lg`}>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;