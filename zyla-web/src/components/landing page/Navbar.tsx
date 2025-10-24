import { useState, useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import "./Navbar.css";
import logo from "../../assests/logo.png";

const Navbar: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('zyla_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-logo">
        <img src={logo} alt="Zyla" className="logo-img" />
        <span>Zyla</span>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="#features" onClick={handleFeaturesClick} style={{ cursor: 'pointer' }}>
            Features
          </a>
        </li>
        <li>
          <a href="#pricing" onClick={handlePricingClick} style={{ cursor: 'pointer' }}>
            Pricing
          </a>
        </li>
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>
        {isLoggedIn ? (
  <li>
    <Link to="/account" className="account-icon-link" aria-label="Account">
      <User size={20} color="white" />
    </Link>
  </li>
) : (
  <li>
    <Link to="/auth" className="navbar-btn">
      Log In
    </Link>
  </li>
)}
      </ul>
    </nav>
  );
};

export default Navbar;