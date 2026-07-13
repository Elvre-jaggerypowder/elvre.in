import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from '../supabaseClient';
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Admin credentials (hardcoded for demo; can be moved to .env)
  const ADMIN_EMAIL = "elvreofficals@gmail.com";
  const ADMIN_PASSWORD = "Elvre@2024";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Trim email to avoid accidental spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // ✅ Check admin login first
    if (trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.removeItem("currentUser");
      setLoading(false);
      navigate("/admin-dashboard");
      return;
    }

    try {
      // ✅ Query Supabase for the user (use maybeSingle to return one row)
      const { data: user, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('email', trimmedEmail)
        .eq('password', trimmedPassword)
        .maybeSingle();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Continue to localStorage fallback; don't return here, we want to try localStorage anyway.
      }

      if (user) {
        // User found in Supabase
        localStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        }));
        localStorage.removeItem("adminLoggedIn");
        setLoading(false);

        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo);
        return;
      }

      // ✅ If not in Supabase, check localStorage (backup)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const localUser = users.find(u => u.email === trimmedEmail && u.password === trimmedPassword);

      if (localUser) {
        localStorage.setItem("currentUser", JSON.stringify(localUser));
        localStorage.removeItem("adminLoggedIn");
        setLoading(false);

        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo);
        return;
      }

      // No user found anywhere
      setError("Invalid email or password. Please try again.");
    } catch (err) {
      console.error('Login error:', err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <p className="admin-note">
            🔐 Admin Access: Use provided credentials
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;