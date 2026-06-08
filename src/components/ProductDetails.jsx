import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsApp from "./WhatsApp";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productImages = [
    "/assets/jaggery.png",
    "/assets/productpacking.png",
    "/assets/bowl.png"
  ];

  useEffect(() => {
    loadProduct();
    loadReviews();
    window.addEventListener("productsUpdated", loadProduct);
    return () => window.removeEventListener("productsUpdated", loadProduct);
  }, [id]);

  const loadProduct = () => {
    const savedProducts = localStorage.getItem("elvreProducts");
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      const foundProduct = products.find(p => p.id === parseInt(id));
      
      if (foundProduct) {
        foundProduct.enhancedInfo = {
          brand: "ELVRE Enterprises",
          origin: "Made in India",
          certification: "FSSAI Certified, Organic Certified",
          shelfLife: "12 months",
          weight: "500g"
        };
        foundProduct.nutritionalInfo = {
          calories: "38 kcal",
          totalFat: "0g",
          sodium: "2mg",
          carbohydrates: "9.8g",
          sugars: "9.5g",
          protein: "0.1g",
          iron: "2.5mg (14% DV)",
          calcium: "8mg (1% DV)"
        };
        foundProduct.ingredients = ["Organic Sugarcane", "No Chemicals", "Natural Minerals"];
        foundProduct.healthBenefits = [
          "Rich in Iron - Helps prevent anemia",
          "Digestive Health - Aids digestion naturally",
          "Natural Detoxifier - Cleanses the body",
          "Energy Booster - Provides instant energy"
        ];
        foundProduct.usageInstructions = [
          "As a sweetener in tea, coffee, and milk",
          "In desserts like kheer, halwa, and laddoos",
          "For making traditional sweets and snacks",
          "As a natural substitute for white sugar"
        ];
        
        setProduct(foundProduct);
        
        const related = products.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 4);
        setRelatedProducts(related);
      }
    }
    setLoading(false);
  };

  const loadReviews = () => {
    const savedReviews = localStorage.getItem(`reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      const demoReviews = [
        {
          id: 1,
          name: "Rahul Sharma",
          rating: 5,
          comment: "Excellent quality! Very happy with the purchase. The taste is authentic and natural.",
          date: "2024-05-15",
          verified: true
        },
        {
          id: 2,
          name: "Priya Patel",
          rating: 4,
          comment: "Good product, packaging could be better. But overall satisfied.",
          date: "2024-05-10",
          verified: true
        }
      ];
      setReviews(demoReviews);
      localStorage.setItem(`reviews_${id}`, JSON.stringify(demoReviews));
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      alert("Please fill all fields");
      return;
    }

    const review = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, comment: "", name: "" });
    alert("Thank you! Your review has been submitted.");
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = "✓ Added to cart!";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const buyNow = () => {
    addToCart();
    const user = localStorage.getItem("currentUser");
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Home</span> / 
            <span onClick={() => navigate("/products")}>Products</span> / 
            <span>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            <div className="product-gallery">
              <div className="main-image">
                <img src={productImages[selectedImage]} alt={product.name} />
              </div>
              <div className="thumbnail-list">
                {productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`View ${idx + 1}`}
                    className={`thumbnail ${selectedImage === idx ? "active" : ""}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="product-info-section">
              <h1>{product.name}</h1>
              
              <div className="rating-section">
                <div className="stars">
                  {"★".repeat(Math.floor(getAverageRating()))}
                  {"☆".repeat(5 - Math.floor(getAverageRating()))}
                </div>
                <span className="review-count">{reviews.length} reviews</span>
                <span className="verified">✓ Verified Seller</span>
              </div>

              <div className="price-section">
                <span className="current-price">{product.price}</span>
                <span className="original-price">₹{Math.round(product.priceValue * 1.2)}</span>
                <span className="discount-badge">Save {Math.round(product.priceValue * 0.2)}₹</span>
              </div>

              <div className="certifications">
                <span className="cert-badge">✓ FSSAI Certified</span>
                <span className="cert-badge">✓ Organic Certified</span>
                <span className="cert-badge">✓ Lab Tested</span>
              </div>

              <div className="stock-status">
                {product.stock > 0 ? (
                  <span className="in-stock">✓ In Stock ({product.stock} units available)</span>
                ) : (
                  <span className="out-of-stock">✗ Out of Stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <>
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                    </div>
                    <span className="stock-info">{product.stock} units available</span>
                  </div>

                  <div className="action-buttons">
                    <button className="add-cart-btn" onClick={addToCart}>Add to Cart</button>
                    <button className="buy-now-btn" onClick={buyNow}>Buy Now</button>
                  </div>
                </>
              )}

              <div className="delivery-info">
                <div className="delivery-item">
                  <span className="delivery-icon">🚚</span>
                  <div>
                    <strong>Free Delivery</strong>
                    <p>On orders above ₹499</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">🔄</span>
                  <div>
                    <strong>7-Day Return Policy</strong>
                    <p>Easy returns within 7 days</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">💳</span>
                  <div>
                    <strong>Secure Payment</strong>
                    <p>100% safe checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-tabs">
            <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`tab-btn ${activeTab === "ingredients" ? "active" : ""}`} onClick={() => setActiveTab("ingredients")}>Ingredients</button>
            <button className={`tab-btn ${activeTab === "nutrition" ? "active" : ""}`} onClick={() => setActiveTab("nutrition")}>Nutrition</button>
            <button className={`tab-btn ${activeTab === "benefits" ? "active" : ""}`} onClick={() => setActiveTab("benefits")}>Benefits</button>
            <button className={`tab-btn ${activeTab === "usage" ? "active" : ""}`} onClick={() => setActiveTab("usage")}>How to Use</button>
            <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews ({reviews.length})</button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="tab-pane">
                <p>{product.description}</p>
                <div className="info-grid">
                  <div><strong>Brand:</strong> {product.enhancedInfo.brand}</div>
                  <div><strong>Origin:</strong> {product.enhancedInfo.origin}</div>
                  <div><strong>Shelf Life:</strong> {product.enhancedInfo.shelfLife}</div>
                  <div><strong>Weight:</strong> {product.enhancedInfo.weight}</div>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="tab-pane">
                <ul className="ingredients-list">
                  {product.ingredients.map((ing, i) => <li key={i}>✓ {ing}</li>)}
                </ul>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="tab-pane">
                <table className="nutrition-table">
                  <tbody>
                    <tr><td>Calories</td><td>{product.nutritionalInfo.calories}</td></tr>
                    <tr><td>Total Fat</td><td>{product.nutritionalInfo.totalFat}</td></tr>
                    <tr><td>Sodium</td><td>{product.nutritionalInfo.sodium}</td></tr>
                    <tr><td>Carbohydrates</td><td>{product.nutritionalInfo.carbohydrates}</td></tr>
                    <tr><td>Sugars</td><td>{product.nutritionalInfo.sugars}</td></tr>
                    <tr><td>Protein</td><td>{product.nutritionalInfo.protein}</td></tr>
                    <tr><td>Iron</td><td>{product.nutritionalInfo.iron}</td></tr>
                    <tr><td>Calcium</td><td>{product.nutritionalInfo.calcium}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="tab-pane">
                <div className="benefits-grid">
                  {product.healthBenefits.map((benefit, i) => (
                    <div key={i} className="benefit-card">
                      <span className="benefit-icon">✨</span>
                      <p>{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "usage" && (
              <div className="tab-pane">
                <ul className="usage-list">
                  {product.usageInstructions.map((instruction, i) => (
                    <li key={i}>
                      <span className="step-number">{i + 1}</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-pane">
                <div className="reviews-summary">
                  <div className="avg-rating">
                    <div className="big-rating">{getAverageRating()}</div>
                    <div className="stars">{"★".repeat(Math.floor(getAverageRating()))}</div>
                    <div className="total-reviews">{reviews.length} reviews</div>
                  </div>
                  
                  <div className="write-review">
                    <h3>Write a Review</h3>
                    <form onSubmit={submitReview}>
                      <input type="text" placeholder="Your Name" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} required />
                      <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                        <option value={5}>★★★★★ (5)</option>
                        <option value={4}>★★★★☆ (4)</option>
                        <option value={3}>★★★☆☆ (3)</option>
                        <option value={2}>★★☆☆☆ (2)</option>
                        <option value={1}>★☆☆☆☆ (1)</option>
                      </select>
                      <textarea placeholder="Your review..." rows="4" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required />
                      <button type="submit">Submit Review</button>
                    </form>
                  </div>
                </div>

                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <strong>{review.name}</strong>
                        {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                        <div className="review-stars">{"★".repeat(review.rating)}</div>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h3>You May Also Like</h3>
              <div className="related-grid">
                {relatedProducts.map(related => (
                  <div key={related.id} className="related-card" onClick={() => navigate(`/product/${related.id}`)}>
                    <img src={related.image || "/assets/jaggery.png"} alt={related.name} />
                    <h4>{related.name}</h4>
                    <p>{related.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsApp />
      <style>{`
        .cart-toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #4caf50;
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          z-index: 10000;
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ProductDetails;