import React, { useEffect, useRef } from "react";
import { BarChart3, Bot, Lock, Sparkles } from "lucide-react";
import "./FeaturesSection.css";

import featuresImg from "../../assests/features.png";

const features = [
  {
    title: "Real-Time Portfolio Tracking",
    description:
      "Stay on top of your finances.",
    tags: ["LIVE DATA", "MULTI-BANK", "DIVERSIFIED"],
    icon: BarChart3,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Get personalized spending trends, alerts, and",
    tags: ["AI", "PERSONALIZED", "SMART ALERTS"],
    icon: Bot,
  },
  {
    title: "Secure & Private",
    description:
      "Your data is encrypted and privacy-first.",
    tags: ["ENCRYPTED", "PRIVATE", "SECURE"],
    icon: Lock,
  },
  {
    title: "Smart Budgeting",
    description:
      "Set custom budgets and get AI recommendations to stay on track.",
    tags: ["ENCAUTOMATED ", "CUSTOM ", "GOALSRYPTED"],
    icon: Sparkles,
  },
];

const FeaturesSection: React.FC = () => {
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
                }, index * 200);
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
    <section id="features" ref={sectionRef} className="features-section">
      <div className="features-label">FEATURES</div>
      <h2 className="features-title">
        Powerful Features,<br />Built for Fintech
      </h2>
      
      <div className="content-container">
        <div className="features-cards">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <IconComponent size={32} strokeWidth={2} />
                </div>
                <div className="feature-card-title">{feature.title}</div>
                <div className="feature-card-desc">{feature.description}</div>
                <div className="feature-tags">
                  {feature.tags.map((tag, i) => (
                    <span className="feature-tag" key={i}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="image-placeholder">
          <img src={featuresImg} alt="Features" className="features-img" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;