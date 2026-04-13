import './HeroSection.css';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="image-slider">
        <img
          src={`${process.env.PUBLIC_URL}/assets/jaggery.png`}
          className="slide-image jaggery-img"
          alt="Jaggery Background"
        />
        <img
          src={`${process.env.PUBLIC_URL}/assets/productpacking.png`}
          className="slide-image product-img"
          alt="Product Packing"
        />
      </div>

      <div className="hero-text" data-aos="fade-down" data-aos-duration="1500">
        <h1>
          Medicinally Pure <span>Jaggery Powder</span>
        </h1>
        <p>Handcrafted By Farmers</p>
      </div>

      <Link to="/buynow">
        <button className="buy-now-btn" data-aos="zoom-in" data-aos-delay="500" data-aos-duration="1000">🛒Book Now</button>
      </Link>
    </section>
  );
}

export default HeroSection;