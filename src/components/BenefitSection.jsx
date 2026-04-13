import React from "react";
import "./BenefitSection.css";

const BenefitsSection = () => {
  return (
    <section className="benefits-wrapper">
      <div
        className="benefit-card"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-left"
        data-aos-delay="0"
      >
        <p className="benefit-text1">Immunity & Detox</p>
      </div>
      <div
        className="benefit-card"
        style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-up"
        data-aos-delay="100"
      >
        <p className="benefit-text2">
          Hormonal Respiratory <br /> Antioxidants & Vital Minerals
        </p>
      </div>
      <div
        className="benefit-card"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-right"
        data-aos-delay="200"
      >
        <p className="benefit-text3">Boosts Energy Naturally</p>
      </div>
    </section>
  );
};

export default BenefitsSection;