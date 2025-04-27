import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const images = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
];

const WelcomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-container">
      {/* Full-screen Slideshow */}
      <div className="fullscreen-slideshow">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="welcome-content">
        <header className="welcome-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 4c-3.5 0-6 2-6 5 0 1 0.5 2.5 1.5 3C6 13.5 6 15 6 15s1.5-1 2.5-1c1 0 3.5 2 3.5 4 0-2 2.5-4 3.5-4 1 0 2.5 1 2.5 1s0-1.5-1.5-3c1-0.5 1.5-2 1.5-3 0-3-2.5-5-6-5z"></path>
              <path d="M12 7c-1.5 0-2.5 1-2.5 2.5 0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-1.5-1-2.5-2.5-2.5z"></path>
              <path d="M9 12c-2 1-3 2.5-3 4 2-0.5 4-0.5 6-0.5 2 0 4 0 6 0.5 0-1.5-1-3-3-4"></path>
            </svg>
            <span className="logo-text">Knowledge Nest</span>
          </div>
        </header>

        <main className="welcome-main">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Knowledge Nest</h1>
            <p className="hero-subtitle">
              Your gateway to knowledge and professional growth. 
              Access courses, connect with experts, and advance your career.
            </p>
            
            <div className="cta-buttons">
              <Link to="/login" className="cta-button login-button">
                Login
              </Link>
              <Link to="/register" className="cta-button signup-button">
                Sign Up
              </Link>
            </div>
          </div>
        </main>

        <footer className="welcome-footer">
          <p>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </footer>
      </div>

      {/* Slideshow Dots */}
      <div className="slideshow-dots">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;