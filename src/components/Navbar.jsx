import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaShoppingCart, FaBars, FaTimes, FaHome, FaUser, FaSignOutAlt, FaSearch, FaListAlt } from "react-icons/fa";
import SearchBar from "./SearchBar";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    loadCartCount();
    checkLoginStatus();
    window.addEventListener("storage", loadCartCount);
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(count);
  };

  const checkLoginStatus = () => {
    const user = localStorage.getItem("currentUser");
    setIsLoggedIn(!!user);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsDropdownOpen(false);
    setShowMobileSearch(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setShowMobileSearch(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/ELVRElogo1.png`}
            alt="ELVRE Logo"
            className="logo-img"
          />
          <span className="logo-text">ELVRE</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="nav-search desktop-search">
          <SearchBar />
        </div>

        {/* Desktop Menu */}
        <div className="nav-menu desktop-menu">
          {isHomePage ? (
            <>
              <ScrollLink to="hero" smooth={true} duration={500} spy={true} offset={-70}>
                <FaHome className="nav-icon" /> Home
              </ScrollLink>
              <ScrollLink to="about" smooth={true} duration={500} spy={true} offset={-70}>
                About
              </ScrollLink>
              <Link to="/products" onClick={closeMenu}>
                Products
              </Link>
              
              <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  More <span className="dropdown-arrow">▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-content">
                    <ScrollLink to="testimonial" smooth={true} duration={500} onClick={closeMenu}>
                      Testimonials
                    </ScrollLink>
                    <ScrollLink to="contact" smooth={true} duration={500} onClick={closeMenu}>
                      Contact
                    </ScrollLink>
                    <Link to="/blog" onClick={closeMenu}>Blog</Link>
                    <Link to="/our-story" onClick={closeMenu}>Our Story</Link>
                    <Link to="/terms" onClick={closeMenu}>Terms & Conditions</Link>
                    <Link to="/privacy" onClick={closeMenu}>Privacy Policy</Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/">
                <FaHome className="nav-icon" /> Home
              </Link>
              <Link to="/products">Products</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/our-story">Our Story</Link>
              
              <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  More <span className="dropdown-arrow">▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/terms" onClick={closeMenu}>Terms & Conditions</Link>
                    <Link to="/privacy" onClick={closeMenu}>Privacy Policy</Link>
                  </div>
                )}
              </div>
            </>
          )}
          
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          
          {/* My Orders Link - Only visible when logged in */}
          {isLoggedIn && (
            <Link to="/my-orders" className="orders-link">
              <FaListAlt /> My Orders
            </Link>
          )}
          
          {!isLoggedIn ? (
            <Link to="/login" className="login-btn-nav">Login</Link>
          ) : (
            <button onClick={handleLogout} className="logout-btn-nav">
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>

        {/* Mobile Icons */}
        <div className="mobile-icons">
          {/* Mobile Search Button */}
          <button className="mobile-search-btn" onClick={toggleMobileSearch}>
            <FaSearch />
          </button>
          
          <Link to="/cart" className="mobile-cart">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-count-mobile">{cartCount}</span>}
          </Link>
          
          <div className="mobile-icon" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {showMobileSearch && (
          <div className="mobile-search-container">
            <SearchBar />
            <button className="close-search" onClick={toggleMobileSearch}>✕</button>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
          {/* Home button always on top in mobile menu */}
          {isHomePage ? (
            <>
              <ScrollLink to="hero" smooth={true} duration={500} onClick={toggleMenu}>
                <FaHome /> Home
              </ScrollLink>
              <ScrollLink to="about" smooth={true} duration={500} onClick={toggleMenu}>
                About Us
              </ScrollLink>
              <Link to="/products" onClick={toggleMenu}>Products</Link>
              <ScrollLink to="testimonial" smooth={true} duration={500} onClick={toggleMenu}>
                Testimonials
              </ScrollLink>
              <ScrollLink to="contact" smooth={true} duration={500} onClick={toggleMenu}>
                Contact Us
              </ScrollLink>
              <Link to="/blog" onClick={toggleMenu}>Blog</Link>
              <Link to="/our-story" onClick={toggleMenu}>Our Story</Link>
              <Link to="/terms" onClick={toggleMenu}>Terms & Conditions</Link>
              <Link to="/privacy" onClick={toggleMenu}>Privacy Policy</Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={toggleMenu}><FaHome /> Home</Link>
              <Link to="/products" onClick={toggleMenu}>Products</Link>
              <Link to="/blog" onClick={toggleMenu}>Blog</Link>
              <Link to="/our-story" onClick={toggleMenu}>Our Story</Link>
              <Link to="/terms" onClick={toggleMenu}>Terms & Conditions</Link>
              <Link to="/privacy" onClick={toggleMenu}>Privacy Policy</Link>
            </>
          )}
          
          {/* My Orders Link in Mobile Menu */}
          {isLoggedIn && (
            <Link to="/my-orders" onClick={toggleMenu} className="mobile-orders-link">
              <FaListAlt /> My Orders
            </Link>
          )}
          
          {!isLoggedIn ? (
            <Link to="/login" onClick={toggleMenu} className="mobile-login-btn">
              <FaUser /> Login / Signup
            </Link>
          ) : (
            <button onClick={handleLogout} className="mobile-logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;