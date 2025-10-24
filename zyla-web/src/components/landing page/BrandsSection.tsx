import { type FC } from "react";
import "./BrandsSection.css";

const BrandsSection: FC = () => {
  const zylaLogo = require("../../assests/logo.png");

  const companies = [
    { 
      name: "Zyla", 
      subtitle: "Finance OS", 
      logo: zylaLogo,
      type: "image"
    },
    { 
      name: "Plaid", 
      subtitle: "Banking APIs",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <rect width="12" height="12" opacity="0.3"/>
          <rect x="18" width="12" height="12" opacity="0.6"/>
          <rect x="36" width="12" height="12" opacity="0.9"/>
          <rect y="18" width="12" height="12" opacity="0.6"/>
          <rect x="18" y="18" width="12" height="12"/>
        </svg>
      ),
      color: "#000000"
    },
    { 
      name: "Stripe", 
      subtitle: "Payments",
      svg: (
        <svg className="brand-logo" viewBox="0 0 60 25" fill="currentColor">
          <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
        </svg>
      ),
      color: "#635BFF"
    },
    { 
      name: "Coinbase", 
      subtitle: "Crypto",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="14" y="20" width="20" height="8" rx="2"/>
        </svg>
      ),
      color: "#0052FF"
    },
    { 
      name: "Robinhood", 
      subtitle: "Investing",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <path d="M38 18c-2 8-8 14-14 14s-12-6-14-14c0 0 4-8 14-8s14 8 14 8z"/>
          <circle cx="24" cy="18" r="4"/>
          <path d="M12 32c2-2 6-4 12-4s10 2 12 4"/>
        </svg>
      ),
      color: "#00C805"
    },
    { 
      name: "PayPal", 
      subtitle: "Digital Wallet",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <path d="M20 10c0-2.2-1.8-4-4-4H8C6.9 4 6 4.9 6 6v16c0 1.1.9 2 2 2h8c2.2 0 4-1.8 4-4 0-1.1-.4-2.1-1.1-2.8.7-.7 1.1-1.7 1.1-2.8V10z" fill="#003087"/>
          <path d="M36 14c0-2.2-1.8-4-4-4h-8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c2.2 0 4-1.8 4-4 0-1.1-.4-2.1-1.1-2.8.7-.7 1.1-1.7 1.1-2.8v-2.4z" fill="#0070BA"/>
        </svg>
      ),
      color: "#003087"
    },
    { 
      name: "Visa", 
      subtitle: "Card Network",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 16" fill="currentColor">
          <path d="M20.1 1.5l-4.6 13h2.9l.9-2.5h4.4l.9 2.5h3.2L23.3 1.5h-3.2zm.5 8.1l1.5-4.2 1.5 4.2h-3z"/>
          <path d="M11.8 1.5L8.1 14.5h2.8l3.7-13h-2.8z"/>
          <path d="M3.2 1.5L0 14.5h2.8l2.2-8.9 1.1 8.9h2.6L6.5 1.5H3.2z"/>
          <path d="M35 1.5c-1.5 0-2.5.8-2.5 2.1 0 1.7 2.3 2.3 2.3 3.5 0 .5-.4.7-.9.7-.8 0-1.8-.3-2.6-.9v2.8c.9.4 1.8.6 2.6.6 1.6 0 2.7-.8 2.7-2.2 0-1.8-2.3-2.4-2.3-3.5 0-.4.3-.6.8-.6.7 0 1.5.2 2.2.6V1.8c-.8-.2-1.6-.3-2.3-.3z"/>
        </svg>
      ),
      color: "#1A1F71"
    },
    { 
      name: "Mastercard", 
      subtitle: "Payments",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 30" fill="none">
          <circle cx="18" cy="15" r="12" fill="#EB001B"/>
          <circle cx="30" cy="15" r="12" fill="#F79E1B" opacity="0.9"/>
        </svg>
      ),
      color: "#EB001B"
    },
    { 
      name: "Square", 
      subtitle: "Commerce",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <rect x="8" y="8" width="32" height="32" rx="6"/>
          <rect x="16" y="16" width="16" height="16" fill="white" rx="3"/>
        </svg>
      ),
      color: "#000000"
    },
    { 
      name: "Revolut", 
      subtitle: "Banking",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <path d="M12 10h8c4 0 6 2 6 5s-2 5-6 5h-4v8h-4V10zm8 7c1.5 0 2.5-1 2.5-2s-1-2-2.5-2h-4v4h4z"/>
          <circle cx="34" cy="28" r="4"/>
        </svg>
      ),
      color: "#0075EB"
    },
    { 
      name: "Wise", 
      subtitle: "Transfers",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 6l-12 18h6l-6 12 18-18h-6l12-12z"/>
        </svg>
      ),
      color: "#9FE870"
    },
    { 
      name: "Chime", 
      subtitle: "Neo Bank",
      svg: (
        <svg className="brand-logo" viewBox="0 0 48 48" fill="currentColor">
          <circle cx="24" cy="24" r="18"/>
          <path d="M16 24c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="none" stroke="white" strokeWidth="3"/>
          <circle cx="24" cy="30" r="3" fill="white"/>
        </svg>
      ),
      color: "#05C39B"
    },
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
              <div 
                key={`${company.name}-${index}`} 
                className="brand-card"
                style={{ 
                  color: company.color || '#ffffff'
                }}
              >
                <div className="brand-icon">
                  {company.type === "image" ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="brand-logo"
                    />
                  ) : (
                    company.svg
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