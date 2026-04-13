import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./ProductCarousel.css";

const ProductCarousel = () => {
  const products = [
    {
      id: 1,
      name: "ELVRE Organic Jaggery Powder",
      description: "500g - Chemical Free",
      price: "₹149",
      image: `${process.env.PUBLIC_URL}/assets/jaggery.png`,
    },
    {
      id: 2,
      name: "ELVRE Premium Jaggery",
      description: "1kg - Farmer's Choice",
      price: "₹279",
      image: `${process.env.PUBLIC_URL}/assets/productpacking.png`,
    },
    {
      id: 3,
      name: "ELVRE Gift Pack",
      description: "500g x 2 - Special Edition",
      price: "₹299",
      image: `${process.env.PUBLIC_URL}/assets/bowl.png`,
    },
  ];

  return (
    <section className="product-carousel-section" data-aos="fade-up">
      <div className="product-carousel-header">
        <h2 className="product-carousel-title">Our Products</h2>
        <p className="product-carousel-subtitle">Shop the best quality jaggery powder</p>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="product-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">{product.price}</div>
              <button className="product-btn" onClick={() => window.location.href = "/#/buynow"}>
                Buy Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductCarousel;