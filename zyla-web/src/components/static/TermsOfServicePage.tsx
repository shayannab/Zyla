import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assests/logo.png';
import './TermsOfServicePage.css';

const TermsOfServicePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('zyla_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="terms-page">
      {/* Glass floating navbar */}
      <nav className="terms-navbar">
        <div className="terms-navbar-content">
          <Link to="/" className="terms-logo">
            <img src={logo} alt="Zyla Logo" className="terms-logo-img" />
            <span className="terms-logo-text">Zyla</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" className="terms-nav-link">Home</Link>
            {!isLoggedIn && (
              <Link to="/login" className="privacy-nav-link">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="terms-content">
        <h1 className="terms-hero-title">Terms of Service</h1>
        <div className="terms-last-updated">Last updated: January 2025</div>

        <div>
          <section className="terms-section">
            <div className="terms-section-number">01</div>
            <h2 className="terms-section-title">Acceptance of Terms</h2>
            <p className="terms-text">
              By accessing and using Zyla's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">02</div>
            <h2 className="terms-section-title">Use of Services</h2>
            <p className="terms-text">
              Zyla provides AI-powered financial management tools. You agree to:
            </p>
            <ul className="terms-list">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not misuse or attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">03</div>
            <h2 className="terms-section-title">Financial Data</h2>
            <p className="terms-text">
              Zyla connects to your bank accounts through Plaid. By using our service, you authorize us to access your financial data for the purpose of providing our services. We do not have access to your bank login credentials.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">04</div>
            <h2 className="terms-section-title">AI-Generated Insights</h2>
            <p className="terms-text">
              Our AI provides financial insights and recommendations. These are for informational purposes only and should not be considered professional financial advice. You are responsible for your own financial decisions.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">05</div>
            <h2 className="terms-section-title">Account Termination</h2>
            <p className="terms-text">
              You may terminate your account at any time. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">06</div>
            <h2 className="terms-section-title">Limitation of Liability</h2>
            <p className="terms-text">
              Zyla is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to financial losses.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">07</div>
            <h2 className="terms-section-title">Changes to Terms</h2>
            <p className="terms-text">
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <div className="terms-divider"></div>

          <section className="terms-section">
            <div className="terms-section-number">08</div>
            <h2 className="terms-section-title">Contact Information</h2>
            <p className="terms-text">
              For questions about these Terms of Service, contact us at:{' '}
              <a href="mailto:shayannabehera23@gmail.com" className="terms-link">
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
