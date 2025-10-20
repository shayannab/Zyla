import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('demo@zyla.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('zyla_token', response.data.token);
      localStorage.setItem('zyla_user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            Zyla
          </h1>
          <p style={{ color: '#999', margin: 0 }}>
            Welcome back to your financial future
          </p>
        </div>
        {error && (
          <div style={{
            backgroundColor: '#7f1d1d',
            border: '1px solid #991b1b',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#fca5a5', margin: 0, fontSize: '14px' }}>
              {error}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#ccc', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text'
              }}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#ccc', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  paddingRight: '40px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'text'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '18px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: '#999', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginRight: '8px' }} disabled={loading} />
              Remember me
            </label>
            <a href="#" style={{ color: '#7c3aed', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#333' : 'white',
              color: loading ? '#999' : 'black',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#999', marginTop: '20px', fontSize: '14px' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
