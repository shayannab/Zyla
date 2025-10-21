import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Building2, Zap } from 'lucide-react';
import logo from '../../assests/logo.png';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:shayannabehera23@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    
    // Show success message
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  return (
    <div className="contact-page">
      {/* Navigation */}
      <nav className="contact-navbar">
        <div className="contact-navbar-content">
          <Link to="/" className="contact-logo">
            <img src={logo} alt="Zyla Logo" className="contact-logo-img" />
            <span className="contact-logo-text">Zyla</span>
          </Link>
          <div className="contact-nav-links">
            <Link to="/" className="contact-nav-link">Home</Link>
            <Link to="/login" className="contact-nav-link">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="contact-content">
        {/* Header */}
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="glass-card scroll-reveal">
            <h2 className="card-title">Send us a message</h2>
            
            {showStatus && (
              <div className="status-message status-success">
                Opening your email client...
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="form-input"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="form-textarea"
                  placeholder="Your message..."
                  required
                />
              </div>

              <button type="submit" className="shimmer-button">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-grid scroll-reveal">
            <div className="info-card">
              <div className="info-icon">
                <Mail size={24} strokeWidth={2} />
              </div>
              <h3 className="info-title">Email</h3>
              <a 
                href="mailto:shayannabehera23@gmail.com"
                className="info-link"
              >
                shayannabehera23@gmail.com
              </a>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MessageSquare size={24} strokeWidth={2} />
              </div>
              <h3 className="info-title">Support</h3>
              <p className="info-description">Get help with your account</p>
              <a 
                href="mailto:shayannabehera23@gmail.com?subject=Support Request"
                className="info-link"
              >
                Contact Support
              </a>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Building2 size={24} strokeWidth={2} />
              </div>
              <h3 className="info-title">Business Inquiries</h3>
              <p className="info-description">Partnership and enterprise solutions</p>
              <a 
                href="mailto:shayannabehera23@gmail.com?subject=Business Inquiry"
                className="info-link"
              >
                Get in Touch
              </a>
            </div>

            <div className="response-card">
              <div className="response-content">
                <div className="info-icon" style={{ marginBottom: '1rem' }}>
                  <Zap size={24} strokeWidth={2} />
                </div>
                <h3 className="response-title">Fast Response</h3>
                <p className="response-text">
                  We typically respond within 24 hours during business days. For urgent matters, please mark your subject accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
