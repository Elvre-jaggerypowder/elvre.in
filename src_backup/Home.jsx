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
import WhatsApp from "./components/WhatsApp";
import TalesSection from "./components/TalesSection";

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
      <TalesSection />
      <Testimonial />
      <Contact />
      <WhatsApp />
    </>
  );
};

export default Home;