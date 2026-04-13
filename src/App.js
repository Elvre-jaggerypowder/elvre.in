import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";  // ✅ ADD THIS
import Home from "./Home";
import BuyNow from "./components/BuyNow";
import BackToTop from "./components/BackToTop";  // ✅ ADD THIS - we'll create it

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,     // animation duration in ms
      once: true,         // animation happens only once
      offset: 100,        // offset (in px) from the original trigger point
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buynow" element={<BuyNow />} />
        </Routes>
      </Router>
      <BackToTop />  {/* ✅ ADD THIS - floating button */}
    </>
  );
}

export default App;