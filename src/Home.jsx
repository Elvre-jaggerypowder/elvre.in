import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatsCounter from "./components/StatsCounter";
import AboutSection from "./components/AboutSection";
import ProductCarousel from "./components/ProductCarousel";
import MadeSection from "./components/MadeSection";
import AgriSection from "./components/AgriSection";
import BenefitSection from "./components/BenefitSection";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsApp from "./components/WhatsApp";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsCounter />
      <AboutSection />
      <ProductCarousel />
      <MadeSection />
      <AgriSection />
      <BenefitSection />
      <Testimonial />
      <Contact />
      {/* ✅ SIRF EK FOOTER */}
      <Footer />
      <WhatsApp />
    </>
  );
};

export default Home;