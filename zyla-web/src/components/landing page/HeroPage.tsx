import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroPage.css";
import FeaturesSection from "./FeaturesSection";
import BrandsSection from "./BrandsSection";
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import HowItWorks from "./HowItWorks";
import CTAsection from "./CTAsection";
import Pricing from "./Pricing";
import Security from "./Security";
import Footer from "./Footer";
import Navbar from "./Navbar";
import wheelImg from "../../assests/wheel.png";

const HeroPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="hero-bg">
        {/* Wheel as background element */}
        <div className="hero-wheel-wrapper">
          <img
            src={wheelImg}
            alt="Spinning Wheel"
            className="hero-wheel"
          />
        </div>
        <Navbar />
        {/* Animated Cursor Follower */}
        <div 
          className="cursor-glow"
          style={{
            left: `${(mousePosition.x + 1) * 50}%`,
            top: `${(mousePosition.y + 1) * 50}%`
          }}
        />

        {/* Background Data Overlays */}
        <div className="data-overlay coords-top-left">
          40.7128°N, 74.0060°W<br />
          NYC, NY
        </div>
        <div className="data-overlay coords-top-right">
          51.5074°N, 0.1278°W<br />
          LONDON, UK
        </div>
        <div className="data-overlay data-bottom-left">
          PORTFOLIO: $127,450<br />
          <span className="pulse-green inline-flex items-center gap-1"><ArrowUpRight size={14} /> +12.5%</span> (24h)
        </div>
        <div className="data-overlay data-bottom-right">
          ACTIVE USERS: 24,891<br />
          MARKET CAP: $2.1T
        </div>

  <div className="hero-content" style={{ position: 'relative', transform: `translateY(${scrollY * 0.5}px)` }}>
          <div style={{ position: 'relative', zIndex: 2 }} className="hero-text-container">
            <h1 className="hero-title nowrap">Your Money Deserves</h1>
            <h1 className="hero-title"><span className="glow-text">Better Insights</span></h1>
            <p className="hero-subtitle">
             Track your spending patterns, analyze trends, and get actionable recommendations — all in one intelligent dashboard designed to help you take control of your finances.
            </p>
            <div className="hero-cta-buttons">
              <button className="cta-primary" onClick={() => navigate('/auth')}>Start Now</button>
            </div>
          </div>
        </div>

        

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll to explore</div>
          <div className="scroll-arrow flex items-center justify-center"><ChevronDown size={18} /></div>
        </div>
      </div>
      <BrandsSection />
      <FeaturesSection />
      <HowItWorks /> 
      <Security />
      <Pricing />
      <CTAsection />
      <Footer />
    </>
  );
};

export default HeroPage;