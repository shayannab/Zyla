import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

const ZylaAuth = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const API_BASE = 'http://localhost:5000/api';

  // Memoized input handlers to prevent re-renders
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Client-side validation
    if (!name || name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');

      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentPage('plaid');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Client-side validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Login failed');

      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentPage('plaid');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidLink = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/plaid/create-link-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create link token');

      // Load Plaid Link script
      const script = document.createElement('script');
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.onload = () => {
        const handler = (window as any).Plaid.create({
          token: data.link_token,
          onSuccess: async (public_token: string) => {
            try {
              const exchangeRes = await fetch(`${API_BASE}/plaid/exchange-token`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ public_token })
              });

              if (exchangeRes.ok) {
                window.location.href = '/dashboard';
              } else {
                const errorData = await exchangeRes.json();
                throw new Error(errorData.error || 'Failed to exchange token');
              }
            } catch (err: any) {
              setError(err.message);
              setLoading(false);
            }
          },
          onExit: () => {
            setLoading(false);
          }
        });
        handler.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const LoginPage = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <div className="text-3xl font-bold mb-2">Zyla</div>
          <p className="text-gray-400">Welcome back to your financial future</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-700 rounded" />
              <span className="ml-2 text-gray-400">Remember me</span>
            </label>
            <button type="button" className="text-purple-400 hover:text-purple-300">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Logging in...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => {
              setCurrentPage('signup');
              setError('');
              // Do not reset email/password here to avoid cursor jump
            }}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );

  const SignupPage = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <div className="text-3xl font-bold mb-2">Create Account</div>
          <p className="text-gray-400">Start your journey with Zyla today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="John Doe"
                autoComplete="name"
                required
                minLength={2}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
          </div>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-1 bg-gray-900 border border-gray-700 rounded" />
            <span className="text-sm text-gray-400">
              I agree to the <button type="button" className="text-purple-400 hover:text-purple-300">Terms of Service</button> and <button type="button" className="text-purple-400 hover:text-purple-300">Privacy Policy</button>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              setCurrentPage('login');
              setError('');
              // Do not reset fields here to avoid cursor jump
            }}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );

  const PlaidPage = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Link Your Bank Account</h2>
          <p className="text-gray-400">Connect your bank to get started with AI-powered insights</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handlePlaidLink}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Connecting...' : 'Connect Bank Account'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Skip for Now
          </button>
        </div>

        <div className="mt-8 space-y-3 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-gray-300 text-sm">Secure bank connection via Plaid</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-gray-300 text-sm">Real-time transaction sync</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-gray-300 text-sm">AI-powered financial insights</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'signup' && <SignupPage />}
      {currentPage === 'plaid' && <PlaidPage />}
    </div>
  );
};

export default ZylaAuth;
