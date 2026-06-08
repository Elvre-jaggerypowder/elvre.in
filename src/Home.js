import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoCarousel from "./components/VideoCarousel";  // MUST be imported
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
      <VideoCarousel />      {/* MUST be here between Hero and Stats */}
      <StatsCounter />
      <AboutSection />
      <ProductCarousel />
      <MadeSection />
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