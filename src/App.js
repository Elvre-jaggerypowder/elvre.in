import React, { useEffect, useState } from "react";
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
import Chatbot from "./components/Chatbot";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("currentUser");
  if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ✅ LAYOUT WITHOUT FOOTER (Footer har page ke andar alag se aayega)
const Layout = ({ children, isChatbotOpen, setIsChatbotOpen }) => (
  <>
    <Navbar onOpenHelp={() => setIsChatbotOpen(true)} />
    {children}
    <Chatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
    <WhatsApp />
    <BackToTop />
  </>
);

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
            <Route path="/" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><Home /></Layout>} />
            <Route path="/products" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><ProductsPage /></Layout>} />
            <Route path="/product/:id" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><ProductDetails /></Layout>} />
            <Route path="/cart" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><Cart /></Layout>} />
            <Route path="/our-story" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><OurStory /></Layout>} />
            <Route path="/blog" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><Blog /></Layout>} />
            <Route path="/contact" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><Contact /></Layout>} />
            <Route path="/terms" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><TermsAndConditions /></Layout>} />
            <Route path="/privacy" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><PrivacyPolicy /></Layout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><UserLogin /></Layout>} />
            <Route path="/signup" element={<Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><UserSignup /></Layout>} />
            
            {/* Protected Routes */}
            <Route path="/my-orders" element={
              <ProtectedRoute><Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><OrdersPage /></Layout></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><UserProfile /></Layout></ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute><Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><Checkout /></Layout></ProtectedRoute>
            } />
            <Route path="/order-tracking/:orderId" element={
              <ProtectedRoute><Layout isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}><OrderTracking /></Layout></ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ContentProvider>
    </CartProvider>
  );
}

export default App;