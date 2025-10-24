import { useEffect, useRef, useState, type FC } from "react";
import "./CTAsection.css";

const CTASection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section ref={sectionRef} className={`cta-section ${isVisible ? 'visible' : ''}`}>
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Transform<br />Your Finances?
          </h2>
          <p className="cta-subtitle">
            Join 50,000+ users managing their money smarter with AI-powered insights.
            Start your free trial today—no credit card required.
          </p>

          <form className="cta-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                className="email-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="cta-button">
                Get Started Free
              </button>
            </div>
          </form>

          <div className="cta-actions">
            <button className="secondary-cta">
              Schedule a Demo
            </button>
            <button className="secondary-cta">
              Watch Video
            </button>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>14-day free trial</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>

          <div className="user-avatars">
            <div className="avatar-group">
              <div className="avatar">👨‍💼</div>
              <div className="avatar">👩‍💻</div>
              <div className="avatar">👨‍🎓</div>
              <div className="avatar">👩‍🔬</div>
              <div className="avatar">👨‍🚀</div>
            </div>
            <p className="avatar-text">
              <strong>50,000+</strong> users trust Zyla with their finances
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;