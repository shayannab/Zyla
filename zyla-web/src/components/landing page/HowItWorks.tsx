import React, { useEffect, useRef } from "react";
import { Link, Bot, Lightbulb, TrendingUp } from "lucide-react";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Connect Your Accounts",
    description: "Securely link your bank accounts, credit cards, and investment platforms in seconds.",
    icon: Link
  },
  {
    number: "02",
    title: "AI Analyzes Your Data",
    description: "Our advanced AI engine processes your financial data to identify patterns and opportunities.",
    icon: Bot
  },
  {
    number: "03",
    title: "Get Personalized Insights",
    description: "Receive tailored recommendations, alerts, and actionable insights to optimize your finances.",
    icon: Lightbulb
  },
  {
    number: "04",
    title: "Track & Grow",
    description: "Monitor your progress in real-time and watch your wealth grow with smart automation.",
    icon: TrendingUp
  }
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stepsRef.current.forEach((step, index) => {
              if (step) {
                setTimeout(() => {
                  step.classList.add('visible');
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
    <section ref={sectionRef} className="how-it-works-section">
      <div className="how-label">HOW IT WORKS</div>
      <h2 className="how-title">
        Get Started in<br />Four Simple Steps
      </h2>

      <div className="steps-container">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div key={idx} className="step-wrapper">
              <div
                ref={(el) => { stepsRef.current[idx] = el; }}
                className="step-card"
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">
                  <IconComponent size={48} strokeWidth={2} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
              {idx < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;