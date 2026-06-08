import React from "react";
import { Link } from "react-router-dom";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title" data-aos="fade-right">
            Our Story
          </h2>
          <p className="about-text" data-aos="fade-right" data-aos-delay="100">
            At ELVRE, we believe in the power of nature. Our journey began with 
            a simple mission - to bring pure, organic jaggery from traditional 
            farms to your table. Made with love and care, our jaggery preserves 
            all the natural minerals and nutrients.
          </p>
          <Link to="/our-story" className="about-btn" data-aos="fade-up" data-aos-delay="200">
            Read Our Story
          </Link>
        </div>
        <div className="about-image" data-aos="fade-left">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/about-us.png`} 
            alt="About ELVRE"
            onError={(e) => {
              e.target.src = "/assets/jaggery.png";
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;