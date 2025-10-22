import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Lightbulb, Bell, Brain, ChevronLeft } from 'lucide-react';
import { isDemoUser } from '../../utils/demoMode';

interface Insight {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  confidenceScore: number;
  createdAt: string;
}

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo-only mock data
    const demo = isDemoUser();
    setTimeout(() => {
      if (demo) {
        setInsights([
          { id: '1', type: 'overspending', title: 'Overspending Alert', message: 'You spent 23% more on dining this month compared to your average.', priority: 'high', confidenceScore: 92, createdAt: '2025-01-20' },
          { id: '2', type: 'trend', title: 'Positive Trend', message: 'Your savings rate increased by 15% this month. Great job!', priority: 'medium', confidenceScore: 88, createdAt: '2025-01-19' },
          { id: '3', type: 'recommendation', title: 'Subscription Alert', message: 'You have 3 streaming subscriptions. Consider consolidating to save $25/month.', priority: 'medium', confidenceScore: 85, createdAt: '2025-01-18' },
          { id: '4', type: 'alert', title: 'Unusual Activity', message: 'Detected unusual spending pattern in the shopping category.', priority: 'high', confidenceScore: 78, createdAt: '2025-01-17' }
        ]);
      } else {
        setInsights([]);
      }
      setLoading(false);
    }, 600);
  }, []);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (priority === 'medium') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'overspending') return <AlertTriangle size={28} color="white" />;
    if (type === 'trend') return <TrendingUp size={28} color="white" />;
    if (type === 'recommendation') return <Lightbulb size={28} color="white" />;
    return <Bell size={28} color="white" />;
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#020617] to-[#0a1628] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
              <p className="text-gray-400">Personalized recommendations powered by AI</p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Insights</p>
            <p className="text-3xl font-bold text-white">{insights.length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">High Priority</p>
            <p className="text-3xl font-bold text-red-400">
              {insights.filter(i => i.priority === 'high').length}
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Avg. Confidence</p>
            <p className="text-3xl font-bold text-green-400">
              {insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + i.confidenceScore, 0) / insights.length) : 0}%
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing your financial data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-2xl p-6 hover:scale-[1.01] transition-transform cursor-pointer ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl text-white">{getTypeIcon(insight.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">×</button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Confidence: {insight.confidenceScore}%</span>
                    <span>•</span>
                    <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && insights.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Brain size={36} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Insights Yet</h3>
            <p className="text-gray-400 mb-6">Connect your bank account to get AI-powered insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
