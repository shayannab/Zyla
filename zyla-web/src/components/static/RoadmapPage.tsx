import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assests/logo.png';
import './RoadmapPage.css';
import {
  Brain,
  Building2,
  Tags,
  Target,
  Smartphone,
  BarChart3,
  CreditCard,
  Globe2,
  TrendingUp,
  Bell,
  Users,
  Gauge,
  Bot,
  FileText,
  Repeat,
  Plug,
  CheckCircle2,
  Zap as ZapIcon,
  ClipboardList,
  Sparkles,
  Lightbulb
} from 'lucide-react';

const RoadmapPage: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('all');

  type RoadmapFeature = {
    title: string;
    description: string;
    icon: React.ReactNode;
    progress?: number;
  };

  type RoadmapSection = {
    quarter: string;
    status: 'completed' | 'in-progress' | 'planned' | 'future';
    items: RoadmapFeature[];
  };

  const roadmapItems: RoadmapSection[] = [
    // Q1 2025 - Completed
    {
      quarter: 'Q1 2025',
      status: 'completed',
      items: [
        { title: 'AI-Powered Insights Engine', description: 'Machine learning model for spending pattern analysis', icon: <Brain className="text-white" size={18} /> },
        { title: 'Plaid Integration', description: 'Secure bank account connection via Plaid API', icon: <Building2 className="text-white" size={18} /> },
        { title: 'Transaction Categorization', description: 'Automatic AI-based transaction categorization', icon: <Tags className="text-white" size={18} /> },
        { title: 'Budget Management', description: 'Create and track custom budgets by category', icon: <Target className="text-white" size={18} /> },
      ]
    },
    // Q2 2025 - In Progress
    {
      quarter: 'Q2 2025',
      status: 'in-progress',
      items: [
        { title: 'Mobile App (iOS & Android)', description: 'Native mobile apps with full feature parity', icon: <Smartphone className="text-white" size={18} /> , progress: 65 },
        { title: 'Advanced Analytics Dashboard', description: 'Interactive charts and financial forecasting', icon: <BarChart3 className="text-white" size={18} /> , progress: 40 },
        { title: 'Bill Payment Automation', description: 'Automatic bill detection and payment reminders', icon: <CreditCard className="text-white" size={18} /> , progress: 30 },
        { title: 'Multi-Currency Support', description: 'Support for 50+ currencies and exchange rates', icon: <Globe2 className="text-white" size={18} /> , progress: 20 },
      ]
    },
    // Q3 2025 - Planned
    {
      quarter: 'Q3 2025',
      status: 'planned',
      items: [
        { title: 'Investment Tracking', description: 'Track stocks, crypto, and investment portfolios', icon: <TrendingUp className="text-white" size={18} /> },
        { title: 'Smart Alerts & Notifications', description: 'Personalized spending alerts and fraud detection', icon: <Bell className="text-white" size={18} /> },
        { title: 'Family Sharing', description: 'Shared budgets and accounts for families', icon: <Users className="text-white" size={18} /> },
        { title: 'Credit Score Monitoring', description: 'Free credit score tracking and improvement tips', icon: <Gauge className="text-white" size={18} /> },
      ]
    },
    // Q4 2025 - Future
    {
      quarter: 'Q4 2025',
      status: 'future',
      items: [
        { title: 'AI Financial Advisor', description: 'Conversational AI for personalized financial advice', icon: <Bot className="text-white" size={18} /> },
        { title: 'Tax Optimization', description: 'Automatic tax categorization and deduction finder', icon: <FileText className="text-white" size={18} /> },
        { title: 'Subscription Manager', description: 'Track and cancel unused subscriptions', icon: <Repeat className="text-white" size={18} /> },
        { title: 'Integration Marketplace', description: 'Connect with 100+ financial services and tools', icon: <Plug className="text-white" size={18} /> },
      ]
    },
  ];

  const filteredRoadmap = selectedQuarter === 'all' 
    ? roadmapItems 
    : roadmapItems.filter(item => item.quarter === selectedQuarter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planned': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'future': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Completed ✓';
      case 'in-progress': return 'In Progress';
      case 'planned': return 'Planned';
      case 'future': return 'Future';
      default: return '';
    }
  };

  return (
    <div className="roadmap-page">
      {/* Navigation - glass floating */}
      <nav className="roadmap-navbar">
        <div className="roadmap-navbar-content">
          <Link to="/" className="roadmap-logo">
            <img src={logo} alt="Zyla Logo" className="roadmap-logo-img" />
            <span className="roadmap-logo-text">Zyla</span>
          </Link>
          <div className="roadmap-nav-links">
            <Link to="/" className="roadmap-nav-link">Home</Link>
            <Link to="/about" className="roadmap-nav-link">About</Link>
            <Link to="/dashboard" className="roadmap-nav-link">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="roadmap-content">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Product Roadmap</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See what we're building for the future of AI-powered financial management
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedQuarter('all')}
            className={`roadmap-chip font-medium transition-all ${
              selectedQuarter === 'all' ? 'is-active' : ''
            }`}
          >
            All Quarters
          </button>
          {roadmapItems.map((item) => (
            <button
              key={item.quarter}
              onClick={() => setSelectedQuarter(item.quarter)}
              className={`roadmap-chip font-medium transition-all ${
                selectedQuarter === item.quarter ? 'is-active' : ''
              }`}
            >
              {item.quarter}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Future</span>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-12">
          {filteredRoadmap.map((quarter, qIndex) => (
            <div key={quarter.quarter} className="relative">
              {/* Timeline Line */}
              {qIndex !== filteredRoadmap.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gray-700 hidden md:block"></div>
              )}

              {/* Quarter Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 ${
                  quarter.status === 'completed' ? 'bg-green-500/30' :
                  quarter.status === 'in-progress' ? 'bg-blue-500/30' :
                  quarter.status === 'planned' ? 'bg-purple-500/30' :
                  'bg-gray-500/30'
                }`}>
                  {quarter.status === 'completed' && <CheckCircle2 className="text-green-400" />}
                  {quarter.status === 'in-progress' && <ZapIcon className="text-blue-400" />}
                  {quarter.status === 'planned' && <ClipboardList className="text-purple-400" />}
                  {quarter.status === 'future' && <Sparkles className="text-gray-300" />}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{quarter.quarter}</h2>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(quarter.status)}`}>
                    {getStatusLabel(quarter.status)}
                  </span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-20">
                {quarter.items.map((item, index) => (
                  <div
                    key={index}
                    className="roadmap-card rounded-2xl p-6 hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="roadmap-feature-icon flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar (for in-progress items) */}
                    {'progress' in item && item.progress !== undefined && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-indigo-400 font-semibold">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Community Feedback Section */}
        <div className="mt-20 roadmap-card border-indigo-500/30 rounded-2xl p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="roadmap-item-icon" style={{ width: 48, height: 48 }}>
              <Lightbulb className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Have a Feature Request?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We'd love to hear your ideas! Your feedback helps us prioritize what to build next.
          </p>
          <a
            href="mailto:shayannabehera23@gmail.com?subject=Feature Request"
            className="vibe-button"
          >
            <span>Submit Feature Request</span>
            <span className="arrow">→</span>
          </a>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">12+</div>
            <div className="text-gray-400">Features Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">4</div>
            <div className="text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">8</div>
            <div className="text-gray-400">Planned</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">100+</div>
            <div className="text-gray-400">User Requests</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
