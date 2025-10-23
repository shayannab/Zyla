import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Shield,
  Cog,
  Trash2,
  Save,
  ImagePlus,
  LogOut,
  Building2,
  KeyRound,
  Mail,
  Lock, // <-- add this
} from 'lucide-react';

type User = { name?: string; email?: string };
type MessageType = '' | 'success' | 'error';
type Message = { type: MessageType; text: string };

const UserAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'account'>('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('zyla_user');
    if (userData) {
      const parsed: User = JSON.parse(userData);
      setUser(parsed);
      setProfileData(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || '',
      }));
    }
  }, []);

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      showMessage('error', 'Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      // TODO: hook to your API
      localStorage.setItem(
        'zyla_user',
        JSON.stringify({ ...(user || {}), name: profileData.name, email: profileData.email })
      );
      setUser(prev => ({ ...(prev || {}), name: profileData.name, email: profileData.email }));
      showMessage('success', 'Profile updated');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword) {
      showMessage('error', 'Please fill all fields');
      return;
    }
    if (profileData.newPassword !== profileData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // TODO: call API
      setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      showMessage('success', 'Password changed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zyla_token');
    localStorage.removeItem('zyla_user');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // TODO: call API to delete
      localStorage.removeItem('zyla_token');
      localStorage.removeItem('zyla_user');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

const tabs: { id: 'profile' | 'security' | 'account'; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'account', label: 'Account', icon: Cog },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#020617] to-[#0a1628] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Link to="/" className="text-indigo-300 hover:text-white hover:underline underline-offset-4">
            Home
          </Link>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left tabs */}
          <aside className="lg:col-span-1">
            <div className="bg-white/5 border border-white/15 rounded-xl p-3 backdrop-blur-xl">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="text-white" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-white/5 border border-white/15 rounded-xl p-8 backdrop-blur-xl">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserIcon size={18} className="text-white/80" />
                    <h2 className="text-2xl font-bold">Profile</h2>
                  </div>

                  <label className="block text-sm font-medium text-gray-300">
                    Full Name
                    <div className="mt-2 flex items-center gap-2">
                      <UserIcon size={16} className="text-white/70" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        placeholder="Enter your name"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                    <div className="mt-2 flex items-center gap-2">
                      <Mail size={16} className="text-white/70" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        placeholder="your@email.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Used for login and notifications</p>
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      <Save size={16} className="text-white" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="inline-flex items-center gap-2 text-indigo-300 hover:text-white hover:underline underline-offset-4">
                      <ImagePlus size={16} className="text-white" />
                      Change avatar
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={18} className="text-white/80" />
                    <h2 className="text-2xl font-bold">Security</h2>
                  </div>

                  <label className="block text-sm font-medium text-gray-300">
                    Current Password
                    <div className="mt-2 flex items-center gap-2">
                      <Lock size={16} className="text-white/70" />
                      <input
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        placeholder="Enter current password"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-medium text-gray-300">
                    New Password
                    <div className="mt-2 flex items-center gap-2">
                      <KeyRound size={16} className="text-white/70" />
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        placeholder="Enter new password"
                      />
                    </div>
                  </label>

                  <label className="block text-sm font-medium text-gray-300">
                    Confirm New Password
                    <div className="mt-2 flex items-center gap-2">
                      <KeyRound size={16} className="text-white/70" />
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </label>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <Save size={16} className="text-white" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Cog size={18} className="text-white/80" />
                    <h2 className="text-2xl font-bold">Account</h2>
                  </div>

                  <div className="bg-black/30 border border-white/10 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Log Out</h3>
                        <p className="text-gray-400 text-sm">Sign out of your account on this device</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <LogOut size={16} className="text-white" />
                        Log Out
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/10 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Connected Banks</h3>
                        <p className="text-gray-400 text-sm">Manage your linked bank accounts</p>
                      </div>
                      <button
                        onClick={() => (window.location.href = '/accounts')}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Building2 size={16} className="text-white" />
                        Manage
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                        <p className="text-gray-400 text-sm">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Trash2 size={16} className="text-white" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black/60 border border-white/15 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Delete Account?</h3>
              <p className="text-gray-300 mb-6">
                Are you absolutely sure? This will permanently delete your account and all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;