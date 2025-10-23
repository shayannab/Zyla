import React from "react";
import "./BrandsSection.css";

const BrandsSection: React.FC = () => {
  // Realistic fintech/banking brands with icons
  // Import Zyla brand logo
  // Note: path intentionally points to "assests" as in the project structure
  const zylaLogo = require("../../assests/logo.png");

  const companies = [
    { name: "Zyla", subtitle: "Finance OS", logo: zylaLogo },
    { name: "Plaid", subtitle: "Banking APIs", icon: "🏦" },
    { name: "Stripe", subtitle: "Payments", icon: "💳" },
    { name: "Coinbase", subtitle: "Crypto", icon: "₿" },
    { name: "Robinhood", subtitle: "Investing", icon: "📈" },
    { name: "PayPal", subtitle: "Digital Wallet", icon: "💰" },
    { name: "Visa", subtitle: "Card Network", icon: "💵" },
    { name: "Square", subtitle: "Commerce", icon: "⬛" },
    { name: "Revolut", subtitle: "Banking", icon: "🌐" },
    { name: "Wise", subtitle: "Transfers", icon: "✈️" },
    { name: "Chime", subtitle: "Neo Bank", icon: "🏧" },
  ];

  // Duplicate for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="brands-section">
      <div className="brands-content">
        <div className="brands-header">
          <div className="brands-badge">TRUSTED BY</div>
          <h2 className="brands-title">
            Powered by Industry Leaders
          </h2>
          <p className="brands-subtitle">
            Zyla integrates with the world's most trusted financial platforms
          </p>
        </div>
        
        <div className="brands-slider">
          <div className="brands-track">
            {duplicatedCompanies.map((company, index) => (
              <div key={`${company.name}-${index}`} className="brand-card">
                <div className="brand-icon">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="brand-logo"
                    />
                  ) : (
                    company.icon
                  )}
                </div>
                <div className="brand-info">
                  <div className="brand-name">{company.name}</div>
                  <div className="brand-tag">{company.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;