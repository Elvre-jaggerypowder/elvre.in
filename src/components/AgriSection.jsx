import React from 'react';
import './AgriSection.css';

const ModernAgricultureSection = () => {
  return (
    <section className="modern-agriculture-section" data-aos="fade-left">
      <div className="modern-agriculture-content">
        <p className="modern-agriculture-subheading">MODERN AGRICULTURE</p>
        <h2 className="modern-agriculture-heading">
          Providing High Quality Products
        </h2>
        <p className="modern-agriculture-description">
          At ELVRE, we are deeply committed to bringing you the authentic taste of jaggery powder, crafted from fresh sugarcane juice. Our journey is driven by a passion to preserve tradition while embracing innovation. Backed by a technology-driven team of professionals, we aim to modernize the jaggery-making process, reducing its labor-intensive nature through strategic collaborations with leading Indian institutes. We proudly offer high-quality, chemical-free jaggery powder— with no added colors or preservatives—ensuring purity, taste, and nutrition in every grain. Our sustainable, eco-friendly production practices, combined with a strong distribution network across India, allow us to deliver premium quality at competitive and affordable prices
        </p>
      </div>
      <img src={`${process.env.PUBLIC_URL}/assets/grass1.png`} alt="Background" className="modern-agriculture-img" data-aos="fade-right" data-aos-delay="300" />
    </section>
  );
};

export default ModernAgricultureSection;