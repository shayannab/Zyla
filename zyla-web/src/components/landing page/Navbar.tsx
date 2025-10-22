import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assests/logo.png";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('zyla_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="navbar-glass">
      <div className="navbar-logo">
        <img src={logo} alt="Zyla" className="logo-img" />
        <span>Zyla</span>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="#features">
            Features
          </a>
        </li>
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>
        {!isLoggedIn && (
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