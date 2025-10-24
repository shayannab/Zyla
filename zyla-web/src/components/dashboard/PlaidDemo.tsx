import { useEffect, useState } from 'react';
import { Building2, Rocket, CheckCircle2, AlertTriangle, Check } from 'lucide-react';

// Types
type PlaidOnSuccess = (data: { accounts: number; institution?: { name?: string } }) => void;
type PlaidOnExit = (error?: any, metadata?: any) => void;

// This component handles the full Plaid Link flow
const PlaidLinkIntegration: React.FC<{ onSuccess?: PlaidOnSuccess; onExit?: PlaidOnExit }> = ({ onSuccess, onExit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Get API base URL from environment
  const API_BASE = (process.env.REACT_APP_API_URL as string) || 'http://localhost:5000';

  // Load Plaid Link script
  useEffect(() => {
    // If already present, do not re-add
    if (document.querySelector('script[src*="plaid.com/link"]')) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Keep the script cached for subsequent opens to be faster
    };
  }, []);

  const createLinkToken = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('zyla_token');
      const response = await fetch(`${API_BASE}/api/plaid/link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create link token');
      }

      const data = await response.json();
      setLinkToken(data.link_token);
      return data.link_token as string;
    } catch (err: any) {
      setError(err.message || 'Link token creation failed');
      console.error('Link token creation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exchangePublicToken = async (publicToken: string) => {
    const token = localStorage.getItem('zyla_token');
    const response = await fetch(`${API_BASE}/api/plaid/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ public_token: publicToken })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange token');
    }

    return response.json();
  };

  const openPlaidLink = async () => {
    try {
      setLoading(true);
      setError('');

      // Create link token
      const token = await createLinkToken();
      if (!token) {
        setError('Failed to initialize Plaid Link');
        setLoading(false);
        return;
      }

      // Check if Plaid is loaded
      const plaid = (window as any).Plaid;
      if (!plaid) {
        setError('Plaid Link is not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Create and open Plaid Link
      const handler = plaid.create({
        token,
        onSuccess: async (publicToken: string, metadata: any) => {
          try {
            console.log('Plaid Link successful!', metadata);

            // Exchange public token for access token
            const result = await exchangePublicToken(publicToken);
            console.log('Token exchange successful:', result);

            // Sync transactions (optional)
            const syncToken = localStorage.getItem('zyla_token');
            await fetch(`${API_BASE}/api/plaid/sync-transactions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${syncToken}`
              },
              body: JSON.stringify({ days: 90 })
            });

            // Call success callback
            if (onSuccess) {
              onSuccess({
                accounts: result.accounts_synced,
                institution: metadata.institution
              });
            }

            setLoading(false);
          } catch (err) {
            console.error('Post-link processing failed:', err);
            setError('Failed to sync accounts. Please try again.');
            setLoading(false);
          }
        },
        onExit: (err: any, metadata: any) => {
          console.log('Plaid Link exited', err, metadata);
          if (err) {
            setError(`Connection failed: ${err.error_message || 'Unknown error'}`);
          }
          if (onExit) onExit(err, metadata);
          setLoading(false);
        },
        onEvent: (eventName: string, metadata: any) => {
          console.log('Plaid event:', eventName, metadata);
        }
      });

      handler.open();
    } catch (err: any) {
      console.error('Plaid Link error:', err);
      setError(err.message || 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={openPlaidLink}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Connecting...
          </>
        ) : (
          <>
            <Building2 size={18} />
            Connect Bank Account
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Powered by Plaid • Your data is encrypted and secure
      </p>
    </div>
  );
};

// Usage Instructions Component
const PlaidIntegrationGuide: React.FC = () => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Rocket size={18} /> Setup Instructions</h3>
      <div className="space-y-4 text-sm text-gray-300">
        <div>
          <p className="font-semibold text-white mb-2 flex items-center gap-2">1. Backend Setup (Already Done <CheckCircle2 size={16} className="text-green-400" />)</p>
          <p>Your backend has the Plaid routes configured.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">2. Environment Variables</p>
          <p>Make sure your backend has these in .env.local:</p>
          <pre className="bg-black/50 p-3 rounded-lg mt-2 overflow-x-auto">{`PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox  # or development/production`}</pre>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">3. Get Plaid Credentials</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Go to <a href="https://dashboard.plaid.com/signup" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">dashboard.plaid.com/signup</a></li>
            <li>Create a free account (Sandbox is free forever)</li>
            <li>Copy your Client ID and Sandbox Secret</li>
            <li>Add them to your backend .env.local file</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">4. Test in Sandbox</p>
          <p>Use these test credentials when connecting:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li><strong>Institution:</strong> Search for "Chase" or any bank</li>
            <li><strong>Username:</strong> user_good</li>
            <li><strong>Password:</strong> pass_good</li>
            <li><strong>MFA Code:</strong> 1234</li>
          </ul>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="font-semibold text-yellow-400 mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Important Notes:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-yellow-200">
            <li>Sandbox mode is free and has unlimited test institutions</li>
            <li>Production mode requires approval and has costs per API call</li>
            <li>Never commit your Plaid secrets to Git</li>
            <li>Use environment-specific secrets (sandbox vs production)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Demo Component showing usage
const PlaidDemo: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{ accounts: number; institution?: { name?: string } } | null>(null);

  const handleSuccess: PlaidOnSuccess = (data) => {
    setConnected(true);
    setAccountInfo(data);
    alert(`Successfully connected ${data.accounts} account(s) from ${data.institution?.name}!`);
  };

  const handleExit: PlaidOnExit = (error) => {
    if (error) {
      console.error('Plaid Link error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Plaid Integration</h1>
          <p className="text-gray-400">Connect your bank account securely</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
          {!connected ? (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Building2 size={38} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Link Your Bank</h2>
                <p className="text-gray-400">Securely connect your bank account with Plaid</p>
              </div>

              <PlaidLinkIntegration onSuccess={handleSuccess} onExit={handleExit} />

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Check size={18} className="text-green-400" />
                  <span>Bank-level 256-bit encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Check size={18} className="text-green-400" />
                  <span>Read-only access to your accounts</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Check size={18} className="text-green-400" />
                  <span>Trusted by millions of users</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                <CheckCircle2 size={38} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Connected Successfully!</h2>
              <p className="text-gray-400 mb-4">
                {accountInfo?.accounts} account(s) connected from {accountInfo?.institution?.name}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Connect Another Bank
              </button>
            </div>
          )}
        </div>

        <PlaidIntegrationGuide />
      </div>
    </div>
  );
};

export { PlaidLinkIntegration, PlaidIntegrationGuide, PlaidDemo };
export default PlaidDemo;
