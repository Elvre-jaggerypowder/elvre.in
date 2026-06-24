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

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("currentUser");
  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ✅ LAYOUT WITHOUT FOOTER (Footer har page ke andar alag se aayega)
const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <WhatsApp />
    <BackToTop />
  </>
);

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
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/our-story" element={<Layout><OurStory /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Layout><UserLogin /></Layout>} />
            <Route path="/signup" element={<Layout><UserSignup /></Layout>} />
            
            {/* Protected Routes */}
            <Route path="/my-orders" element={
              <ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>
            } />
            <Route path="/order-tracking/:orderId" element={
              <ProtectedRoute><Layout><OrderTracking /></Layout></ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ContentProvider>
    </CartProvider>
  );
}

export default App;