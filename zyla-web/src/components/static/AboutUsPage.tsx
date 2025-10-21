import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">Z</span>
            </div>
            <span className="text-xl font-bold">Zyla</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
            <a href="/login" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition-colors">Log In</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Zyla</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered financial intelligence for smarter money management
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              We believe everyone deserves access to intelligent financial tools. Zyla combines cutting-edge AI technology with intuitive design to help you take control of your finances, make smarter decisions, and achieve your financial goals.
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              To become the world's most trusted AI financial assistant, empowering millions of people to achieve financial freedom through intelligent automation, personalized insights, and seamless banking integration.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">10K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">$5M+</div>
            <div className="text-gray-400">Money Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">85%</div>
            <div className="text-gray-400">AI Accuracy</div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Shayan Behera', role: 'Founder & CEO', email: 'shayannabehera23@gmail.com' },
              { name: 'AI Team', role: 'Machine Learning', email: 'ai@zyla.com' },
              { name: 'Engineering', role: 'Product Development', email: 'dev@zyla.com' }
            ].map((member, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{member.role}</p>
                <a href={`mailto:${member.email}`} className="text-indigo-400 text-sm hover:text-indigo-300">
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Have questions or want to learn more about Zyla? We'd love to hear from you.
          </p>
          <a 
            href="mailto:shayannabehera23@gmail.com"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">Zyla</span>
              </div>
              <p className="text-gray-400 text-sm">AI-powered financial intelligence for smarter money management.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="/features" className="hover:text-white">Features</a></div>
                <div><a href="/pricing" className="hover:text-white">Pricing</a></div>
                <div><a href="/security" className="hover:text-white">Security</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="/about" className="hover:text-white">About Us</a></div>
                <div><a href="/contact" className="hover:text-white">Contact</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="/privacy" className="hover:text-white">Privacy Policy</a></div>
                <div><a href="/terms" className="hover:text-white">Terms of Service</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 Zyla. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
