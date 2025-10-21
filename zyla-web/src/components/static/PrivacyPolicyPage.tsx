import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">Z</span>
            </div>
            <span className="text-xl font-bold">Zyla</span>
          </div>
          <a href="/" className="text-gray-300 hover:text-white">Back to Home</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>
        <div className="text-gray-400 mb-6">Last updated: January 2025</div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              Zyla collects information to provide better services to our users. We collect information in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Information you give us (name, email, financial data through Plaid)</li>
              <li>Information we get from your use of our services</li>
              <li>Transaction data from connected bank accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide AI-powered financial insights and recommendations</li>
              <li>Maintain and improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Protect against fraud and security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
            <p className="leading-relaxed">
              We use industry-standard encryption and security measures to protect your data. All financial data is encrypted in transit and at rest. We use Plaid for secure bank connections and never store your bank login credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
            <p className="leading-relaxed">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>With your explicit consent</li>
              <li>For legal reasons or to prevent fraud</li>
              <li>With service providers who assist in our operations (like Plaid for banking connections)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect your bank accounts at any time</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:shayannabehera23@gmail.com" className="text-indigo-400 hover:text-indigo-300">
                shayannabehera23@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
