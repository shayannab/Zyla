import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assests/logo.png';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('zyla_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="privacy-page">
      {/* Glass floating navbar - capsule style */}
      <nav className="privacy-navbar">
        <div className="privacy-navbar-content">
          <Link to="/" className="privacy-logo">
            <img src={logo} alt="Zyla Logo" className="privacy-logo-img" />
            <span className="privacy-logo-text">Zyla</span>
          </Link>
          <div className="privacy-nav-links">
            <Link to="/" className="privacy-nav-link">Home</Link>
            {!isLoggedIn && (
              <Link to="/login" className="privacy-nav-link">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="privacy-content">
        <h1 className="privacy-hero-title">Privacy Policy</h1>
        <div className="privacy-last-updated">Last updated: January 2025</div>

        <div>
          <section className="privacy-section">
            <div className="privacy-section-number">01</div>
            <h2 className="privacy-section-title">Information We Collect</h2>
            <p className="privacy-text">
              Zyla collects information to provide better services to our users. We collect information in the following ways:
            </p>
            <ul className="privacy-list">
              <li>Information you give us (name, email, financial data through Plaid)</li>
              <li>Information we get from your use of our services</li>
              <li>Transaction data from connected bank accounts</li>
            </ul>
          </section>

          <div className="privacy-divider"></div>

          <section className="privacy-section">
            <div className="privacy-section-number">02</div>
            <h2 className="privacy-section-title">How We Use Information</h2>
            <p className="privacy-text">
              We use the information we collect to:
            </p>
            <ul className="privacy-list">
              <li>Provide AI-powered financial insights and recommendations</li>
              <li>Maintain and improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Protect against fraud and security threats</li>
            </ul>
          </section>

          <div className="privacy-divider"></div>

          <section className="privacy-section">
            <div className="privacy-section-number">03</div>
            <h2 className="privacy-section-title">Data Security</h2>
            <p className="privacy-text">
              We use industry-standard encryption and security measures to protect your data. All financial data is encrypted in transit and at rest. We use Plaid for secure bank connections and never store your bank login credentials.
            </p>
          </section>

          <div className="privacy-divider"></div>

          <section className="privacy-section">
            <div className="privacy-section-number">04</div>
            <h2 className="privacy-section-title">Data Sharing</h2>
            <p className="privacy-text">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="privacy-list">
              <li>With your explicit consent</li>
              <li>For legal reasons or to prevent fraud</li>
              <li>With service providers who assist in our operations (like Plaid for banking connections)</li>
            </ul>
          </section>

          <div className="privacy-divider"></div>

          <section className="privacy-section">
            <div className="privacy-section-number">05</div>
            <h2 className="privacy-section-title">Your Rights</h2>
            <p className="privacy-text">
              You have the right to:
            </p>
            <ul className="privacy-list">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect your bank accounts at any time</li>
              <li>Export your data</li>
            </ul>
          </section>

          <div className="privacy-divider"></div>

          <section className="privacy-section">
            <div className="privacy-section-number">06</div>
            <h2 className="privacy-section-title">Contact Us</h2>
            <p className="privacy-text">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:shayannabehera23@gmail.com" className="privacy-link">
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
