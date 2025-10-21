import React from 'react';

const TermsOfServicePage: React.FC = () => {
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
        <h1 className="text-5xl font-bold mb-8">Terms of Service</h1>
        <div className="text-gray-400 mb-6">Last updated: January 2025</div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Zyla's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Services</h2>
            <p className="leading-relaxed mb-4">
              Zyla provides AI-powered financial management tools. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not misuse or attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Financial Data</h2>
            <p className="leading-relaxed">
              Zyla connects to your bank accounts through Plaid. By using our service, you authorize us to access your financial data for the purpose of providing our services. We do not have access to your bank login credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. AI-Generated Insights</h2>
            <p className="leading-relaxed">
              Our AI provides financial insights and recommendations. These are for informational purposes only and should not be considered professional financial advice. You are responsible for your own financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Account Termination</h2>
            <p className="leading-relaxed">
              You may terminate your account at any time. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              Zyla is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to financial losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, contact us at:{' '}
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

export default TermsOfServicePage;
