import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, LayoutDashboard, LogIn } from "lucide-react";
import "./Navbar.css";
import logo from "../../assests/logo.png";

const Navbar: React.FC = () => (
  <nav className="navbar-glass">
    <div className="navbar-logo">
      <img src={logo} alt="Zyla" className="logo-img" />
      <span>Zyla</span>
    </div>
    <ul className="navbar-links">
      <li>
        <a href="#features">
          <Sparkles className="nav-icon" />
          Features
        </a>
      </li>
      <li>
        <Link to="/dashboard">
          <LayoutDashboard className="nav-icon" />
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/auth" className="navbar-btn">
          <LogIn className="nav-icon" />
          Log In
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;