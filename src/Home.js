import React from "react";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import MadeSection from "./components/MadeSection";
import AgriSection from "./components/AgriSection";
import BenefitSection from "./components/BenefitSection";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsApp from "./components/WhatsApp";
// ✅ NEW IMPORTS
import StatsCounter from "./components/StatsCounter";
import ProductCarousel from "./components/ProductCarousel";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      {/* ✅ NEW - Stats Counter Section */}
      <StatsCounter />
      <MadeSection />
      {/* ✅ NEW - Product Carousel Section */}
      <ProductCarousel />
      <AgriSection />
      <BenefitSection />
      <Testimonial />
      <Contact />
      <Footer />
      <WhatsApp />
    </>
  );
};

export default Home;