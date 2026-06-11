import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Public Components
import Home from "./Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductsPage from "./components/ProductsPage";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import OurStory from "./components/OurStory";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import OrdersPage from "./components/OrdersPage";
import UserProfile from "./components/UserProfile";

// Auth Components
import UserLogin from "./components/UserLogin";
import UserSignup from "./components/UserSignup";

// Checkout & Orders
import Checkout from "./components/Checkout";
import OrderTracking from "./components/OrderTracking";

// Admin Components
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

// Context & Utils
import { CartProvider } from "./context/CartContext";
import { ContentProvider } from "./context/ContentContext";
import BackToTop from "./components/BackToTop";
import WhatsApp from "./components/WhatsApp";

// Protected Route Component for Checkout
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("currentUser");
  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true, 
      offset: 100,
      disable: false
    });
  }, []);

  return (
    <CartProvider>
      <ContentProvider>
        <Router>
          <Routes>
            {/* Admin Routes - Without Navbar/Footer */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Public Routes - With Navbar/Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
                <WhatsApp />
                <BackToTop />
              </>
            } />
            
            <Route path="/products" element={
              <>
                <Navbar />
                <ProductsPage />
                <Footer />
                <WhatsApp />
              </>
            } />
            
            <Route path="/product/:id" element={
              <>
                <Navbar />
                <ProductDetails />
                <Footer />
                <WhatsApp />
              </>
            } />
            
            <Route path="/cart" element={
              <>
                <Navbar />
                <Cart />
                <Footer />
                <WhatsApp />
              </>
            } />
            
            {/* My Orders Route - Protected */}
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <OrdersPage />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            {/* User Profile Route - Protected */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <UserProfile />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/our-story" element={
              <>
                <Navbar />
                <OurStory />
                <Footer />
              </>
            } />
            
            <Route path="/blog" element={
              <>
                <Navbar />
                <Blog />
                <Footer />
              </>
            } />
            
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            } />
            
            <Route path="/terms" element={
              <>
                <Navbar />
                <TermsAndConditions />
                <Footer />
              </>
            } />
            
            <Route path="/privacy" element={
              <>
                <Navbar />
                <PrivacyPolicy />
                <Footer />
              </>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <>
                <Navbar />
                <UserLogin />
                <Footer />
              </>
            } />
            
            <Route path="/signup" element={
              <>
                <Navbar />
                <UserSignup />
                <Footer />
              </>
            } />
            
            {/* Protected Routes (Require Login) */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Checkout />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/order-tracking/:orderId" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <OrderTracking />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ContentProvider>
    </CartProvider>
  );
}

export default App;