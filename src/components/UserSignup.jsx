import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./UserSignup.css";

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      setError("Email already registered");
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    setSuccess("Account created successfully! Please login.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="user-signup-container">
        <div className="user-signup-card">
          <h2>Create Account</h2>
          <p>Join ELVRE family</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
            
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserSignup;