import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Admin credentials
  const ADMIN_EMAIL = "elvreofficals@gmail.com";
  const ADMIN_PASSWORD = "Elvre@2024";

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.removeItem("currentUser");
      navigate("/admin-dashboard");
      return;
    }
    
    // Check normal user login
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.removeItem("adminLoggedIn");
      setError("");
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-login-container">
        <div className="user-login-card">
          <h2>Welcome Back!</h2>
          <p>Login to your account</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">Login</button>
          </form>
          
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          
          <p className="admin-note">
            Admin Access: Use provided credentials
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;