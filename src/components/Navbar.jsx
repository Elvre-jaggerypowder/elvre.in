import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-close menu after 5 seconds
  useEffect(() => {
    let timer;
    if (menuOpen) {
      timer = setTimeout(() => {
        setMenuOpen(false);
      }, 5000);
    }

    return () => clearTimeout(timer); // Clean up timer if user clicks early
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false); // Close menu when a link is clicked
  };

  return (
    <header className="navbar">
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}/assets/ELVRElogo1.png`} alt="Elvre Logo" />
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <ScrollLink to="hero" smooth={true} duration={500} offset={-70} onClick={handleLinkClick}>
          Home
        </ScrollLink>
        <ScrollLink to="about" smooth={true} duration={500} offset={-70} onClick={handleLinkClick}>
          About Us
        </ScrollLink>
        <ScrollLink to="testimonial" smooth={true} duration={500} offset={-70} onClick={handleLinkClick}>
          Testimonial
        </ScrollLink>
        <ScrollLink to="contact" smooth={true} duration={500} offset={-70} onClick={handleLinkClick}>
          Contact Us
        </ScrollLink>
      </div>

      {/* Hamburger icon - visible only on mobile via CSS */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </header>
  );
};

export default Navbar;
