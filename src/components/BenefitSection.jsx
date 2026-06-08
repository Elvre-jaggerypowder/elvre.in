import React from "react";
import "./BenefitSection.css";

const BenefitsSection = () => {
  return (
    <section className="benefits-wrapper">
      <div
        className="benefit-card"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-left"
      >
        <p className="benefit-text1">Immunity & Detox</p>
      </div>
      <div
        className="benefit-card"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-up"
      >
        <p className="benefit-text2">
          Hormonal Respiratory <br /> Antioxidants & Vital Minerals
        </p>
      </div>
      <div
        className="benefit-card"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Draft.png)` }}
        data-aos="flip-right"
      >
        <p className="benefit-text3">Boosts Energy Naturally</p>
      </div>
    </section>
  );
};

export default BenefitsSection;