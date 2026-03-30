// src/components/layout/Navigation.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navigation.css';
import logoSvg from '../../assets/logoNox.svg';
import facePhoto from '../../assets/me.jpeg';

const Navigation = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navigation">
      {/* Overlay */}
      <div 
        className={`nav-overlay ${menuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      />

      <div className="nav-container">
        {/* Left side - Logo + Desktop Links */}
        <div className="nav-left">
          <Link to="/" className="logo" onClick={closeMenu}>
            <div className="logo-container">
              <img src={logoSvg} alt="Logo" className="logo-svg" />
              <img src={facePhoto} alt="My Face" className="logo-photo" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>

        {/* Right side - Theme toggle + Hamburger (mobile) */}
        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                className={theme === 'light' ? 'moon' : 'sun'} 
                d={theme === 'light' 
                  ? "M11.6666 5V3.33334M10.8333 4.16667H12.5M15.8333 5.83334V9.16667M17.5 7.5H14.1666M14.5 13.3333C12.4166 14 9.99996 13.5833 8.33329 11.9167C6.24996 9.83334 6.08329 6.5 7.74996 4.16667C4.33329 4.5 1.66663 7.33334 1.66663 10.8333C1.66663 14.5 4.66663 17.5 8.33329 17.5C11.0833 17.5 13.5 15.75 14.5 13.3333Z"
                  : "M9.99992 15.2083V17.2917M9.99992 2.70833V4.79166M6.31742 13.6825L4.84409 15.1558M15.1558 4.84416L13.6824 6.3175M4.79158 9.99999H2.70825M17.2916 9.99999H15.2083M6.31742 6.3175L4.84409 4.84416M15.1558 15.1558L13.6824 13.6825M12.4999 9.99999C12.4999 11.3807 11.3806 12.5 9.99992 12.5C8.61921 12.5 7.49992 11.3807 7.49992 9.99999C7.49992 8.61928 8.61921 7.49999 9.99992 7.49999C11.3806 7.49999 12.4999 8.61928 12.4999 9.99999Z"
                }
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`nav-menu-mobile ${menuOpen ? 'active' : ''}`}>
          <div className="nav-links-mobile">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
            <Link to="contact" className="nav-link" onClick={closeMenu}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;