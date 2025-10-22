import React, { useEffect, useRef } from "react";
import "./Pricing.css";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 3 accounts",
      "Basic portfolio tracking",
      "Monthly reports",
      "Email support",
      "Mobile app access"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious investors",
    features: [
      "Unlimited accounts",
      "Real-time tracking",
      "AI-powered insights",
      "Advanced analytics",
      "Priority support",
      "Custom alerts",
      "Export data"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "API access",
      "Advanced security",
      "SLA guarantee",
      "Team collaboration"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const Pricing: React.FC = () => {
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
    <section id="pricing" ref={sectionRef} className="pricing-section">
      <div className="pricing-label">PRICING</div>
      <h2 className="pricing-title">
        Simple, Transparent<br />Pricing for Everyone
      </h2>
      <p className="pricing-subtitle">
        Choose the plan that's right for you. Upgrade or downgrade anytime.
      </p>

      <div className="pricing-grid">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            ref={(el) => { cardsRef.current[idx] = el; }}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
            
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price}
                <span className="plan-period">/{plan.period}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i} className="feature-item">
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`plan-cta ${plan.popular ? 'primary' : 'secondary'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-footer">
        <p>All plans include 14-day free trial • No credit card required • Cancel anytime</p>
      </div>
    </section>
  );
};

export default Pricing;