import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Target, Rocket, Users, Shield, Zap, TrendingUp, Award, Mail } from 'lucide-react';
import './AboutUsPage_NEW.css';
import logo from '../../assests/logo.png';

const AboutUsPage: React.FC = () => {
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Navigation - Same as Landing Page */}
      <nav className="navbar-glass">
        <div className="navbar-logo">
          <img src={logo} alt="Zyla" className="logo-img" />
          <span>Zyla</span>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth" className="navbar-btn">
              Log In
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content-wrapper">
          <h1 className="about-hero-title">About Zyla</h1>
          <p className="about-hero-subtitle">
            AI-powered financial intelligence for smarter money management
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="about-container">
        <div className="mission-vision-grid">
          <div 
            ref={(el) => { cardsRef.current[0] = el; }}
            className="mission-card scroll-up-card"
          >
            <div className="card-icon-wrapper">
              <Target className="card-icon" size={32} strokeWidth={2} />
            </div>
            <h2 className="card-title">Our Mission</h2>
            <p className="card-description">
              We believe everyone deserves access to intelligent financial tools. Zyla combines cutting-edge AI technology with intuitive design to help you take control of your finances, make smarter decisions, and achieve your financial goals.
            </p>
          </div>

          <div 
            ref={(el) => { cardsRef.current[1] = el; }}
            className="mission-card scroll-up-card"
          >
            <div className="card-icon-wrapper">
              <Rocket className="card-icon" size={32} strokeWidth={2} />
            </div>
            <h2 className="card-title">Our Vision</h2>
            <p className="card-description">
              To become the world's most trusted AI financial assistant, empowering millions of people to achieve financial freedom through intelligent automation, personalized insights, and seamless banking integration.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          {[
            { value: '10K+', label: 'Active Users', icon: Users },
            { value: '$5M+', label: 'Money Saved', icon: TrendingUp },
            { value: '99.9%', label: 'Uptime', icon: Shield },
            { value: '85%', label: 'AI Accuracy', icon: Zap }
          ].map((stat, idx) => (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[2 + idx] = el; }}
              className="stat-card scroll-up-card"
            >
              <stat.icon className="stat-icon" size={28} strokeWidth={2} />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2 className="section-title">Our Team</h2>
          <div className="team-grid">
            {[
              { name: 'Shayan Behera', role: 'Founder & CEO', email: 'shayannabehera23@gmail.com', icon: Award },
              { name: 'AI Team', role: 'Machine Learning', email: 'ai@zyla.com', icon: Zap },
              { name: 'Engineering', role: 'Product Development', email: 'dev@zyla.com', icon: Shield }
            ].map((member, idx) => (
              <div
                key={idx}
                ref={(el) => { cardsRef.current[6 + idx] = el; }}
                className="team-card scroll-up-card"
              >
                <div className="team-avatar">
                  <member.icon size={28} strokeWidth={2} />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <a href={`mailto:${member.email}`} className="team-email">
                  <Mail size={14} className="email-icon" />
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div 
          ref={(el) => { cardsRef.current[9] = el; }}
          className="contact-cta scroll-up-card"
        >
          <h2 className="cta-title">Get in Touch</h2>
          <p className="cta-description">
            Have questions or want to learn more about Zyla? We'd love to hear from you.
          </p>
          <a 
            href="mailto:shayannabehera23@gmail.com"
            className="cta-button"
          >
            <Mail size={18} />
            Contact Us
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <img src={logo} alt="Zyla" className="footer-logo-img" />
                <span className="footer-brand">Zyla</span>
              </div>
              <p className="footer-tagline">AI-powered financial intelligence for smarter money management.</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Product</h4>
              <div className="footer-links">
                <Link to="/#features">Features</Link>
                <Link to="/#pricing">Pricing</Link>
                <Link to="/#security">Security</Link>
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Company</h4>
              <div className="footer-links">
                <Link to="/about">About Us</Link>
                <a href="mailto:shayannabehera23@gmail.com">Contact</a>
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Legal</h4>
              <div className="footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 Zyla. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
