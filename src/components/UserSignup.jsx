import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { supabase } from '../supabaseClient';
import "./UserSignup.css";

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError("");
    setSuccess("");
    
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // ✅ Block disposable email domains
    const fakeDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com', 
      'mailinator.com', 'yopmail.com', 'throwawaymail.com',
      'fakeinbox.com', 'temp-mail.org', 'mailnator.com'
    ];
    const emailDomain = email.split('@')[1];
    if (fakeDomains.includes(emailDomain)) {
      setError("Please use a real email address. Temporary emails are not allowed.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if email already exists (Supabase)
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();  // Use maybeSingle() to avoid PGRST116 error if no row

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Supabase check error:', checkError);
        setError("Unable to verify email. Please try again.");
        setLoading(false);
        return;
      }
      
      if (existingUser) {
        setError("Email already registered");
        setLoading(false);
        return;
      }
      
      // ✅ Save to Supabase
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('users')
        .insert([
          { 
            name: name, 
            email: email, 
            password: password,
            phone: '',          // optional; you can remove if NULL allowed
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        if (supabaseError.code === '23505') {
          setError("Email already registered");
        } else {
          setError("Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      console.log('User saved to Supabase:', supabaseData);
      
      // ✅ Save to localStorage for backup (optional)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
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
      
    } catch (err) {
      console.error('Error:', err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
                disabled={loading}
              />
              <small className="form-hint">We'll never share your email with anyone else.</small>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password (min 6 characters)"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserSignup;