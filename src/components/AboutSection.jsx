import './AboutSection.css';

function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about-text-container" data-aos="fade-right">
        <p className="about-intro">OUR INTRODUCTION</p>
        <h2 className="about-heading">
          The Goodness of Jaggery, Beyond Taste
        </h2>
        <p className="about-description">
          Jaggery is a traditional, natural sweetener crafted from concentrated sugarcane or palm juice, cherished for its rich flavor and remarkable health benefits. It is packed with essential minerals such as iron, calcium, magnesium, and potassium, along with vital vitamins including A, C, D2, E, and B-complex. Jaggery helps improve digestion, purify the blood, detoxify the liver, and boost immunity. Its antioxidant and antiallergic properties support respiratory health, especially in polluted environments. Providing steady, long-lasting energy, jaggery is suitable for all age groups. A staple of both wellness and tradition, it’s an ideal choice for those seeking a naturally nourishing lifestyle.
        </p>
      </div>

      <div className="about-images" data-aos="zoom-in" data-aos-delay="200">
        <img src={`${process.env.PUBLIC_URL}/assets/bowl.png`} alt="Jaggery bowl" className="img-side1" />
        <img src={`${process.env.PUBLIC_URL}/assets/man.png`} alt="Farmer with sugarcane" className="img-center" />
        <img src={`${process.env.PUBLIC_URL}/assets/lady.png`} alt="Farmer bending" className="img-side" />
      </div>
    </section>
  );
}

export default AboutSection;