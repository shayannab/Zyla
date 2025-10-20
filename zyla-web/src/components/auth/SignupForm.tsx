import React, { useState, useCallback } from 'react';

interface SignupFormProps {
  onSignup?: (name: string, email: string, password: string) => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (onSignup) {
        await onSignup(name, email, password);
      } else {
        // Replace with your API call
        await new Promise(res => setTimeout(res, 500));
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <div className="mb-3 text-red-500 text-sm">{error}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Your Name"
          autoComplete="name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
