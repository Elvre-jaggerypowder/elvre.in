import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { 
  FaShoppingCart, FaBars, FaTimes, FaHome, FaUser, 
  FaSignOutAlt, FaSearch, FaListAlt, FaStore, FaInfoCircle, FaPhone, FaBlog 
} from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import SearchBar from "./SearchBar";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        {/* ===== LOGO - LEFT ===== */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/ELVRElogo1.png`}
            alt="ELVRE Logo"
            className="logo-img"
          />
          <span className="logo-text">ELVRE</span>
        </Link>

        {/* ===== SEARCH BAR - CENTER ===== */}
        <div className="nav-search">
          <SearchBar />
        </div>

        {/* ===== DESKTOP MENU ===== */}
        <div className="nav-menu desktop-menu">
          {isHomePage ? (
            <ScrollLink to="hero" smooth={true} duration={500} spy={true} offset={-70}>
              <FaHome className="nav-icon" /> Home
            </ScrollLink>
          ) : (
            <Link to="/"><FaHome className="nav-icon" /> Home</Link>
          )}

          <Link to="/products"><FaStore className="nav-icon" /> Products</Link>

          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-btn" onClick={toggleDropdown}>
              <MdMoreVert className="more-icon" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                {isHomePage ? (
                  <>
                    <ScrollLink to="about" smooth={true} duration={500} onClick={closeMenu}>
                      <FaInfoCircle /> About
                    </ScrollLink>
                    <ScrollLink to="testimonial" smooth={true} duration={500} onClick={closeMenu}>
                      Testimonials
                    </ScrollLink>
                    <ScrollLink to="contact" smooth={true} duration={500} onClick={closeMenu}>
                      <FaPhone /> Contact
                    </ScrollLink>
                  </>
                ) : (
                  <>
                    <Link to="/our-story" onClick={closeMenu}><FaInfoCircle /> Our Story</Link>
                    <Link to="/blog" onClick={closeMenu}><FaBlog /> Blog</Link>
                  </>
                )}
                <Link to="/terms" onClick={closeMenu}>Terms & Conditions</Link>
                <Link to="/privacy" onClick={closeMenu}>Privacy Policy</Link>
                {isLoggedIn && (
                  <button onClick={handleLogout} className="dropdown-logout">
                    <FaSignOutAlt /> Logout
                  </button>
                )}
              </div>
            )}
          </div>

          {isLoggedIn && (
            <Link to="/profile" className="profile-link"><FaUser /></Link>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="login-btn-nav">Login</Link>
          )}
        </div>

        {/* ===== MOBILE ICONS ===== */}
        <div className="mobile-icons">
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

        {/* ===== MOBILE SEARCH ===== */}
        {showMobileSearch && (
          <div className="mobile-search-container">
            <SearchBar />
            <button className="close-search" onClick={toggleMobileSearch}>✕</button>
          </div>
        )}

        {/* ===== MOBILE MENU ===== */}
        <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
          <Link to="/" onClick={toggleMenu}><FaHome /> Home</Link>
          <Link to="/products" onClick={toggleMenu}><FaStore /> Products</Link>
          {isHomePage ? (
            <>
              <ScrollLink to="about" smooth={true} duration={500} onClick={toggleMenu}><FaInfoCircle /> About Us</ScrollLink>
              <ScrollLink to="testimonial" smooth={true} duration={500} onClick={toggleMenu}>Testimonials</ScrollLink>
              <ScrollLink to="contact" smooth={true} duration={500} onClick={toggleMenu}><FaPhone /> Contact Us</ScrollLink>
            </>
          ) : (
            <>
              <Link to="/our-story" onClick={toggleMenu}><FaInfoCircle /> Our Story</Link>
              <Link to="/blog" onClick={toggleMenu}><FaBlog /> Blog</Link>
            </>
          )}
          <Link to="/terms" onClick={toggleMenu}>Terms & Conditions</Link>
          <Link to="/privacy" onClick={toggleMenu}>Privacy Policy</Link>
          {isLoggedIn && (
            <Link to="/my-orders" onClick={toggleMenu} className="mobile-orders-link">
              <FaListAlt /> My Orders
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/profile" onClick={toggleMenu} className="mobile-profile-link">
              <FaUser /> My Profile
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