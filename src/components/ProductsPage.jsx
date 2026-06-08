import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsApp from "./WhatsApp";
import "./ProductsPage.css";

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [reviews, setReviews] = useState({});

  const categories = [
    { id: "all", name: "All Products", icon: "📦" },
    { id: "jaggery", name: "Jaggery", icon: "🍯" },
    { id: "organic", name: "Organic", icon: "🌱" },
    { id: "special", name: "Special", icon: "⭐" }
  ];

  useEffect(() => {
    loadProducts();
    loadReviews();
    window.addEventListener("productsUpdated", loadProducts);
    return () => window.removeEventListener("productsUpdated", loadProducts);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) setSearchQuery(search);
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("elvreProducts");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        {
          id: 1,
          name: "ELVRE Organic Jaggery Powder",
          description: "500g - Chemical Free, Natural Sweetener. Rich in iron and minerals.",
          price: "₹149",
          priceValue: 149,
          stock: 50,
          image: "/assets/jaggery.png",
          category: "jaggery",
          badge: "Bestseller"
        },
        {
          id: 2,
          name: "ELVRE Palm Jaggery",
          description: "500g - Rich in Minerals. Made from fresh palm sap.",
          price: "₹199",
          priceValue: 199,
          stock: 35,
          image: "/assets/productpacking.png",
          category: "jaggery",
          badge: "Popular"
        },
        {
          id: 3,
          name: "ELVRE Gift Pack",
          description: "500g x 2 - Special Edition. Perfect for gifting.",
          price: "₹299",
          priceValue: 299,
          stock: 20,
          image: "/assets/bowl.png",
          category: "special",
          badge: "Limited"
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem("elvreProducts", JSON.stringify(defaultProducts));
    }
    setLoading(false);
  };

  const loadReviews = () => {
    const savedReviews = {};
    products.forEach(product => {
      const productReviews = localStorage.getItem(`reviews_${product.id}`);
      if (productReviews) {
        const reviewList = JSON.parse(productReviews);
        const avgRating = reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length;
        savedReviews[product.id] = { rating: avgRating.toFixed(1), count: reviewList.length };
      } else {
        savedReviews[product.id] = { rating: 4.5, count: 0 };
      }
    });
    setReviews(savedReviews);
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product =>
      product.priceValue >= priceRange.min && product.priceValue <= priceRange.max
    );

    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("default");
    navigate("/products");
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `✓ ${product.name} added to cart!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="products-loading">Loading amazing products...</div>
        <Footer />
        <WhatsApp />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="products-page">
        <div className="products-container">
          <div className="products-hero">
            <h1>Our Premium Collection</h1>
            <p>Discover the finest quality jaggery and organic sweeteners</p>
          </div>

          <div className="products-search-wrapper">
            <div className="products-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="clear-search">✕</button>}
            </div>
          </div>

          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "▲ Hide Filters" : "▼ Show Filters"}
          </button>

          <div className="products-layout">
            <div className={`filters-sidebar ${showFilters ? "active" : ""}`}>
              <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={clearFilters} className="reset-filters">Reset All</button>
              </div>

              <div className="filter-group">
                <h4>Categories</h4>
                <div className="category-list">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-chip ${selectedCategory === cat.id ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="cat-count">{getCategoryCount(cat.id)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })} />
                  <span>-</span>
                  <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 })} />
                </div>
                <input type="range" min="0" max="1000" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })} className="price-slider" />
              </div>

              <div className="filter-group">
                <h4>Sort By</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              <div className="products-header-bar">
                <p>{filteredProducts.length} products found</p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button onClick={clearFilters} className="reset-btn">Reset Filters</button>
                </div>
              ) : (
                <div className="products-grid-list">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      {product.badge && <span className={`product-badge ${product.badge.toLowerCase()}`}>{product.badge}</span>}
                      <div className="product-image" onClick={() => navigate(`/product/${product.id}`)}>
                        <img src={product.image || "/assets/jaggery.png"} alt={product.name} />
                        <div className="product-overlay">
                          <button className="quick-view">Quick View</button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h3 onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                        <div className="product-rating">
                          <div className="stars">{"★".repeat(Math.floor(reviews[product.id]?.rating || 4))}{"☆".repeat(5 - Math.floor(reviews[product.id]?.rating || 4))}</div>
                          <span>({reviews[product.id]?.count || 0} reviews)</span>
                        </div>
                        <p className="product-description">{product.description.substring(0, 80)}...</p>
                        <div className="product-price">
                          <span className="current-price">{product.price}</span>
                          <span className="original-price">₹{Math.round(product.priceValue * 1.2)}</span>
                          <span className="discount">Save {Math.round(product.priceValue * 0.2)}₹</span>
                        </div>
                        <div className="stock-status">
                          {product.stock > 0 ? (
                            <span className="in-stock">✓ In Stock ({product.stock} left)</span>
                          ) : (
                            <span className="out-of-stock">✗ Out of Stock</span>
                          )}
                        </div>
                        <div className="product-actions">
                          <button className="view-details" onClick={() => navigate(`/product/${product.id}`)}>View Details</button>
                          <button className="add-to-cart" onClick={() => addToCart(product)} disabled={product.stock === 0}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          animation: slideInRight 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ProductsPage;