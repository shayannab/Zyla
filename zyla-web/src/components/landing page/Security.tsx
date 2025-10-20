import React, { useEffect, useRef } from "react";
import { Lock, Shield, KeyRound, Eye } from "lucide-react";
import "./Security.css";

const securityFeatures = [
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    description: "256-bit AES encryption protects all your data in transit and at rest."
  },
  {
    icon: Shield,
    title: "Two-Factor Authentication",
    description: "Extra layer of security with biometric and SMS verification."
  },
  {
    icon: KeyRound,
    title: "SOC 2 Compliant",
    description: "Certified secure infrastructure meeting industry standards."
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "We never sell your data. Your information stays yours, always."
  }
];

const Security: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardsRef.current.forEach((card, index) => {
              if (card) {
                setTimeout(() => {
                  card.classList.add('visible');
                }, index * 150);
              }
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="security-section">
      <div className="security-label">SECURITY & TRUST</div>
      <h2 className="security-title">
        Your Data is Safe<br />with Bank-Level Security
      </h2>
      <p className="security-subtitle">
        We use the same security standards as major financial institutions to keep your information protected.
      </p>

      <div className="security-grid">
        {securityFeatures.map((feature, idx) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="security-card"
            >
              <div className="security-icon">
                <IconComponent size={48} strokeWidth={1.5} />
              </div>
              <h3 className="security-card-title">{feature.title}</h3>
              <p className="security-card-desc">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="trust-badges">
        <div className="badge">FDIC Insured</div>
        <div className="badge">SSL Secured</div>
        <div className="badge">256-bit Encryption</div>
        <div className="badge">SOC 2 Type II</div>
      </div>
    </section>
  );
};

export default Security;