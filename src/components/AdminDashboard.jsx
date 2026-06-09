import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage",
    expiryDate: "",
    minOrder: 0,
    maxDiscount: 0,
    usageLimit: 0
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceValue: "",
    stock: "",
    image: "",
    category: "jaggery"
  });

  // Check if admin is logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);

  // Load all data
  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
    loadCoupons();
    loadAllReviews();
  }, []);

  // Real-time subscription for new users
  useEffect(() => {
    const subscription = supabase
      .channel('users-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'users' }, 
        (payload) => {
          console.log('New user added in real-time!', payload.new);
          setUsers(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time subscription for new orders
  useEffect(() => {
    const subscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('New order added in real-time!', payload.new);
          setOrders(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("elvreProducts");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        {
          id: 1,
          name: "ELVRE Organic Jaggery Powder",
          description: "500g - Chemical Free, Natural Sweetener",
          price: "₹149",
          priceValue: 149,
          stock: 50,
          image: "/assets/jaggery.png",
          category: "jaggery",
          badge: "Bestseller",
          soldCount: 245
        },
        {
          id: 2,
          name: "ELVRE Palm Jaggery",
          description: "500g - Rich in Minerals",
          price: "₹199",
          priceValue: 199,
          stock: 35,
          image: "/assets/productpacking.png",
          category: "jaggery",
          badge: "Popular",
          soldCount: 189
        },
        {
          id: 3,
          name: "ELVRE Gift Pack",
          description: "500g x 2 - Special Edition",
          price: "₹299",
          priceValue: 299,
          stock: 20,
          image: "/assets/bowl.png",
          category: "special",
          badge: "Limited",
          soldCount: 67
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem("elvreProducts", JSON.stringify(defaultProducts));
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      // ✅ First try to get orders from Supabase
      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        // Fallback to localStorage
        const savedOrders = localStorage.getItem("elvreOrders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } else if (supabaseOrders && supabaseOrders.length > 0) {
        console.log('Orders from Supabase:', supabaseOrders);
        // Convert Supabase format to match app format
        const formattedOrders = supabaseOrders.map(order => ({
          id: order.id,
          customer: order.customer,
          email: order.email,
          phone: order.phone,
          address: order.address,
          products: order.products,
          subtotal: order.subtotal,
          shipping: order.shipping,
          discount: order.discount || 0,
          total: order.total,
          status: order.status,
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status || 'pending',
          orderDate: order.order_date,
          orderTime: order.order_time
        }));
        setOrders(formattedOrders);
        localStorage.setItem("elvreOrders", JSON.stringify(formattedOrders));
      } else {
        // Fallback to localStorage
        const savedOrders = localStorage.getItem("elvreOrders");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      const savedOrders = localStorage.getItem("elvreOrders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  };

  const loadUsers = async () => {
    try {
      const { data: supabaseUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(savedUsers);
      } else if (supabaseUsers && supabaseUsers.length > 0) {
        console.log('Users from Supabase:', supabaseUsers);
        const formattedUsers = supabaseUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          createdAt: user.created_at,
          orders: orders.filter(o => o.email === user.email).length
        }));
        setUsers(formattedUsers);
        localStorage.setItem("users", JSON.stringify(formattedUsers));
      } else {
        const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(savedUsers);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(savedUsers);
    }
  };

  const loadCoupons = () => {
    const savedCoupons = JSON.parse(localStorage.getItem("elvreCoupons") || "[]");
    setCoupons(savedCoupons);
  };

  const loadAllReviews = () => {
    const reviewsList = [];
    const savedProducts = JSON.parse(localStorage.getItem("elvreProducts") || "[]");
    
    savedProducts.forEach(product => {
      const productReviews = localStorage.getItem(`reviews_${product.id}`);
      if (productReviews) {
        const reviews = JSON.parse(productReviews);
        reviews.forEach(review => {
          reviewsList.push({
            ...review,
            productId: product.id,
            productName: product.name,
            productImage: product.image
          });
        });
      }
    });
    
    reviewsList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllReviews(reviewsList);
  };

  const saveProducts = (updatedProducts) => {
    localStorage.setItem("elvreProducts", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    window.dispatchEvent(new Event("productsUpdated"));
  };

  const saveCoupons = (updatedCoupons) => {
    localStorage.setItem("elvreCoupons", JSON.stringify(updatedCoupons));
    setCoupons(updatedCoupons);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("elvreOrders", JSON.stringify(updatedOrders));
    setMessage(`Order ${orderId} status updated to ${newStatus}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("elvreOrders", JSON.stringify(updatedOrders));
    setMessage(`Order ${orderId} payment status updated to ${newPaymentStatus}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiryDate) {
      setMessage("Please fill all required fields");
      return;
    }

    if (coupons.find(c => c.code === newCoupon.code.toUpperCase())) {
      setMessage("Coupon code already exists!");
      return;
    }

    const coupon = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      discount: parseFloat(newCoupon.discount),
      type: newCoupon.type,
      expiryDate: newCoupon.expiryDate,
      minOrder: parseFloat(newCoupon.minOrder) || 0,
      maxDiscount: parseFloat(newCoupon.maxDiscount) || 0,
      usageLimit: parseInt(newCoupon.usageLimit) || 0,
      usedCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updatedCoupons = [...coupons, coupon];
    saveCoupons(updatedCoupons);
    
    setNewCoupon({ code: "", discount: "", type: "percentage", expiryDate: "", minOrder: 0, maxDiscount: 0, usageLimit: 0 });
    setMessage("Coupon created successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleCouponStatus = (couponId) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, active: !coupon.active } : coupon
    );
    saveCoupons(updatedCoupons);
    setMessage("Coupon status updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  const deleteCoupon = (couponId) => {
    if (window.confirm("Delete this coupon?")) {
      const updatedCoupons = coupons.filter(coupon => coupon.id !== couponId);
      saveCoupons(updatedCoupons);
      setMessage("Coupon deleted!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const approveReview = (reviewId, productId) => {
    const productReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || "[]");
    const updatedReviews = productReviews.map(review =>
      review.id === reviewId ? { ...review, approved: true, spam: false } : review
    );
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    loadAllReviews();
    setMessage("Review approved!");
    setTimeout(() => setMessage(""), 2000);
  };

  const deleteReview = (reviewId, productId) => {
    if (window.confirm("Delete this review permanently?")) {
      const productReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || "[]");
      const updatedReviews = productReviews.filter(review => review.id !== reviewId);
      localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
      loadAllReviews();
      setMessage("Review deleted!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const markAsSpam = (reviewId, productId) => {
    const productReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || "[]");
    const updatedReviews = productReviews.map(review =>
      review.id === reviewId ? { ...review, spam: true, approved: false } : review
    );
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    loadAllReviews();
    setMessage("Review marked as spam!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.priceValue || !formData.stock) {
      setMessage("Please fill all required fields");
      return;
    }
    
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      description: formData.description || "Pure & Natural",
      price: `₹${formData.priceValue}`,
      priceValue: parseFloat(formData.priceValue),
      stock: parseInt(formData.stock),
      image: formData.image || "/assets/jaggery.png",
      category: formData.category,
      badge: "New",
      soldCount: 0
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    
    setFormData({ name: "", description: "", priceValue: "", stock: "", image: "", category: "jaggery" });
    setShowAddForm(false);
    setMessage("Product added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      priceValue: product.priceValue,
      stock: product.stock,
      image: product.image,
      category: product.category || "jaggery"
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = () => {
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? {
            ...p,
            name: formData.name,
            description: formData.description,
            price: `₹${formData.priceValue}`,
            priceValue: parseFloat(formData.priceValue),
            stock: parseInt(formData.stock),
            image: formData.image || p.image,
            category: formData.category
          }
        : p
    );
    
    saveProducts(updatedProducts);
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({ name: "", description: "", priceValue: "", stock: "", image: "", category: "jaggery" });
    setMessage("Product updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
      setMessage("Product deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending" || order.status === "processing").length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 20).length;
  const totalUsers = users.length;
  const pendingPayments = orders.filter(order => order.paymentStatus === "pending").length;
  const pendingRefunds = orders.filter(order => order.status === "cancelled" && order.paymentStatus !== "refunded").length;
  
  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5);

  if (loading) {
    return <div className="admin-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <img src={`${process.env.PUBLIC_URL}/assets/ELVRElogo1.png`} alt="Logo" className="admin-logo" />
          <div className="admin-title">
            <h1>ELVRE Admin Dashboard</h1>
            <p>Manage your store efficiently</p>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-info"><h3>₹{totalRevenue.toLocaleString()}</h3><p>Total Revenue</p></div></div>
        <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-info"><h3>{totalOrders}</h3><p>Total Orders</p></div></div>
        <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-info"><h3>{pendingOrders}</h3><p>Pending Orders</p></div></div>
        <div className="stat-card"><div className="stat-icon">🛍️</div><div className="stat-info"><h3>{totalProducts}</h3><p>Total Products</p></div></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><div className="stat-info"><h3>{lowStockProducts}</h3><p>Low Stock Items</p></div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{totalUsers}</h3><p>Total Customers</p></div></div>
        <div className="stat-card"><div className="stat-icon">💳</div><div className="stat-info"><h3>{pendingPayments}</h3><p>Pending Payments</p></div></div>
        <div className="stat-card"><div className="stat-icon">🔄</div><div className="stat-info"><h3>{pendingRefunds}</h3><p>Refund Requests</p></div></div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "dashboard" ? "tab-active" : "tab"} onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>
        <button className={activeTab === "products" ? "tab-active" : "tab"} onClick={() => setActiveTab("products")}>🛍️ Products</button>
        <button className={activeTab === "orders" ? "tab-active" : "tab"} onClick={() => setActiveTab("orders")}>📋 Orders</button>
        <button className={activeTab === "payments" ? "tab-active" : "tab"} onClick={() => setActiveTab("payments")}>💳 Payments</button>
        <button className={activeTab === "coupons" ? "tab-active" : "tab"} onClick={() => setActiveTab("coupons")}>🎫 Coupons</button>
        <button className={activeTab === "reviews" ? "tab-active" : "tab"} onClick={() => setActiveTab("reviews")}>⭐ Reviews</button>
        <button className={activeTab === "customers" ? "tab-active" : "tab"} onClick={() => setActiveTab("customers")}>👥 Customers</button>
      </div>

      <div className="admin-container">
        {message && <div className="admin-message">{message}</div>}

        {activeTab === "dashboard" && (
          <>
            <div className="dashboard-section">
              <h3>Recent Orders</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Payment</th><th>Date</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>₹{order.total}</td>
                        <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                        <td><span className={`payment-badge ${order.paymentStatus === "paid" ? "paid" : "pending"}`}>{order.paymentStatus || "pending"}</span></td>
                        <td>{order.orderDate}</td>
                        <td><button className="view-btn" onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dashboard-section">
              <h3>Top Selling Products</h3>
              <div className="top-products-grid">
                {topProducts.map(product => (
                  <div key={product.id} className="top-product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="top-product-info">
                      <h4>{product.name}</h4>
                      <p>Sold: {product.soldCount || 0} units</p>
                      <p>Revenue: ₹{((product.priceValue || 0) * (product.soldCount || 0)).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveTab("products")} className="quick-btn">➕ Add Product</button>
                <button onClick={() => setActiveTab("orders")} className="quick-btn">📋 View Orders</button>
                <button onClick={() => setActiveTab("coupons")} className="quick-btn">🎫 Create Coupon</button>
                <button onClick={() => window.open("/products", "_blank")} className="quick-btn">🛍️ Visit Store</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="admin-actions">
              <button onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); }} className="admin-add-btn">+ Add New Product</button>
            </div>
            {showAddForm && (
              <div className="admin-product-form">
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <div className="admin-form-grid">
                  <div className="admin-field"><label>Product Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Product name" /></div>
                  <div className="admin-field"><label>Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Product description" rows="2" /></div>
                  <div className="admin-field"><label>Price (₹) *</label><input type="number" value={formData.priceValue} onChange={(e) => setFormData({...formData, priceValue: e.target.value})} placeholder="Price" /></div>
                  <div className="admin-field"><label>Stock *</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="Stock" /></div>
                  <div className="admin-field"><label>Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}><option value="jaggery">Jaggery</option><option value="organic">Organic</option><option value="special">Special</option></select></div>
                  <div className="admin-field"><label>Image Path</label><input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="/assets/image.png" /></div>
                </div>
                <div className="admin-form-buttons">
                  <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} className="admin-save-btn">{editingProduct ? "Update" : "Save"}</button>
                  <button onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="admin-cancel-btn">Cancel</button>
                </div>
              </div>
            )}
            <div className="admin-products-table">
              <h3>Product Inventory ({products.length} items)</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr><th>Image</th><th>Product</th><th>Price</th><th>Stock</th><th>Sold</th><th>Revenue</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td><img src={product.image} alt={product.name} className="admin-product-img" /></td>
                        <td><strong>{product.name}</strong><br /><small>{product.description}</small></td>
                        <td>{product.price}</td>
                        <td><span className={product.stock > 0 ? "stock-badge in-stock" : "stock-badge out-of-stock"}>{product.stock} units</span></td>
                        <td>{product.soldCount || 0}</td>
                        <td>₹{((product.priceValue || 0) * (product.soldCount || 0)).toLocaleString()}</td>
                        <td><button onClick={() => handleEditProduct(product)} className="admin-edit-btn">Edit</button><button onClick={() => handleDeleteProduct(product.id)} className="admin-delete-btn">Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="admin-orders-section">
            <h3>All Orders ({orders.length})</h3>
            <div className="table-responsive">
              <table className="admin-table orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="8" className="no-data">No orders yet</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td><div><strong>{order.customer}</strong></div><div className="customer-email">{order.email}</div></td>
                        <td><div className="order-products-list">{order.products && order.products.map((p, idx) => (<div key={idx} className="order-product-item-compact"><span className="product-name">{p.name}</span><span className="product-qty">x{p.quantity}</span><span className="product-price">₹{p.price * p.quantity}</span></div>))}</div></td>
                        <td><strong>₹{order.total}</strong></td>
                        <td><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`status-select status-${order.status}`}><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>
                        <td><select value={order.paymentStatus || "pending"} onChange={(e) => updatePaymentStatus(order.id, e.target.value)} className="payment-select"><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></td>
                        <td>{order.orderDate}</td>
                        <td><button className="view-btn" onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>View Details</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="admin-payments-section">
            <h3>Payment Management</h3>
            <div className="payment-stats">
              <div className="payment-stat-card"><div className="payment-stat-icon">💰</div><div><h4>Total Collected</h4><p>₹{orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}</p></div></div>
              <div className="payment-stat-card"><div className="payment-stat-icon">⏳</div><div><h4>Pending Payments</h4><p>{orders.filter(o => o.paymentStatus === "pending").length} orders</p></div></div>
              <div className="payment-stat-card"><div className="payment-stat-icon">🔄</div><div><h4>Refund Requests</h4><p>{orders.filter(o => o.status === "cancelled" && o.paymentStatus !== "refunded").length} requests</p></div></div>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment Method</th><th>Payment Status</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.filter(o => o.paymentStatus !== "paid").map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>₹{order.total}</td>
                      <td>{order.paymentMethod}</td>
                      <td><span className={`payment-badge ${order.paymentStatus === "paid" ? "paid" : "pending"}`}>{order.paymentStatus || "pending"}</span></td>
                      <td><button className="mark-paid-btn" onClick={() => updatePaymentStatus(order.id, "paid")}>Mark as Paid</button><button className="refund-btn" onClick={() => updatePaymentStatus(order.id, "refunded")}>Refund</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="admin-coupons-section">
            <h3>Coupon & Discount Management</h3>
            <div className="create-coupon-form">
              <h4>Create New Coupon</h4>
              <div className="form-grid">
                <input type="text" placeholder="Coupon Code" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} />
                <input type="number" placeholder="Discount" value={newCoupon.discount} onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})} />
                <select value={newCoupon.type} onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <input type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})} />
                <input type="number" placeholder="Min Order (₹)" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({...newCoupon, minOrder: e.target.value})} />
                <input type="number" placeholder="Max Discount (₹)" value={newCoupon.maxDiscount} onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: e.target.value})} />
                <input type="number" placeholder="Usage Limit" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})} />
              </div>
              <button className="create-coupon-btn" onClick={handleCreateCoupon}>+ Create Coupon</button>
            </div>
            <div className="coupons-list">
              <h4>Active Coupons</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Expiry Date</th><th>Used</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {coupons.length === 0 ? (
                      <tr><td colSpan="7" className="no-data">No coupons created yet</td></tr>
                    ) : (
                      coupons.map(coupon => (
                        <tr key={coupon.id} className={!coupon.active ? "inactive-coupon" : ""}>
                          <td><strong>{coupon.code}</strong></td>
                          <td>{coupon.discount}{coupon.type === "percentage" ? "%" : "₹"}</td>
                          <td>₹{coupon.minOrder || 0}</td>
                          <td className={isExpired(coupon.expiryDate) ? "expired" : ""}>{coupon.expiryDate}{isExpired(coupon.expiryDate) && " (Expired)"}</td>
                          <td>{coupon.usedCount} / {coupon.usageLimit || "∞"}</td>
                          <td><span className={`coupon-status ${coupon.active ? "active" : "inactive"}`}>{coupon.active ? "Active" : "Inactive"}</span></td>
                          <td><button className="toggle-status-btn" onClick={() => toggleCouponStatus(coupon.id)}>{coupon.active ? "Deactivate" : "Activate"}</button><button className="delete-coupon-btn" onClick={() => deleteCoupon(coupon.id)}>Delete</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="admin-reviews-section">
            <h3>Review Management</h3>
            <div className="reviews-stats">
              <div className="stat-box"><span className="stat-number">{allReviews.length}</span><span className="stat-label">Total Reviews</span></div>
              <div className="stat-box"><span className="stat-number">{allReviews.filter(r => r.rating >= 4).length}</span><span className="stat-label">Positive (4-5⭐)</span></div>
              <div className="stat-box"><span className="stat-number">{allReviews.filter(r => r.rating <= 2).length}</span><span className="stat-label">Negative (1-2⭐)</span></div>
            </div>
            <div className="reviews-list">
              {allReviews.length === 0 ? (
                <div className="no-reviews">No reviews yet</div>
              ) : (
                allReviews.map((review, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-product-info">
                      <img src={review.productImage || "/assets/jaggery.png"} alt={review.productName} />
                      <div><h4>{review.productName}</h4><p>Product ID: {review.productId}</p></div>
                    </div>
                    <div className="review-content">
                      <div className="reviewer-info">
                        <strong>{review.name}</strong>
                        <div className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                        <span className="review-date">{review.date}</span>
                        {review.verified && <span className="verified-badge">✓ Verified</span>}
                        {review.spam && <span className="spam-badge">⚠️ Spam</span>}
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                    <div className="review-actions">
                      {!review.approved && !review.spam && <button className="approve-btn" onClick={() => approveReview(review.id, review.productId)}>✓ Approve</button>}
                      <button className="spam-btn" onClick={() => markAsSpam(review.id, review.productId)}>🚫 Mark Spam</button>
                      <button className="delete-btn" onClick={() => deleteReview(review.id, review.productId)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="admin-customers-section">
            <h3>Registered Customers ({users.length})</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Registered Date</th><th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="6" className="no-data">No customers registered yet</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'Not provided'}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>{orders.filter(o => o.email === user.email).length}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-info-section"><h4>Customer Information</h4>
                <div className="order-info-row"><strong>Name:</strong> {selectedOrder.customer}</div>
                <div className="order-info-row"><strong>Email:</strong> {selectedOrder.email}</div>
                <div className="order-info-row"><strong>Phone:</strong> {selectedOrder.phone || "Not provided"}</div>
                <div className="order-info-row"><strong>Address:</strong> {selectedOrder.address}</div>
              </div>
              <div className="order-info-section"><h4>Order Information</h4>
                <div className="order-info-row"><strong>Order Date:</strong> {selectedOrder.orderDate}</div>
                <div className="order-info-row"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</div>
                <div className="order-info-row"><strong>Payment Status:</strong> <span className={`payment-badge ${selectedOrder.paymentStatus === "paid" ? "paid" : "pending"}`}>{selectedOrder.paymentStatus || "pending"}</span></div>
                <div className="order-info-row"><strong>Order Status:</strong> <span className={`status-badge status-${selectedOrder.status}`}>{selectedOrder.status}</span></div>
              </div>
              <div className="order-info-section"><h4>Products Ordered</h4>
                <div className="order-products-table">
                  <div className="order-products-header"><span>Product</span><span>Quantity</span><span>Price</span><span>Total</span></div>
                  {selectedOrder.products && selectedOrder.products.map((p, idx) => (
                    <div key={idx} className="order-products-row">
                      <span className="product-name-cell">{p.name}</span>
                      <span className="product-qty-cell">x{p.quantity}</span>
                      <span className="product-price-cell">₹{p.price}</span>
                      <span className="product-total-cell">₹{p.price * p.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-total-section">
                <div className="total-row"><span>Subtotal:</span><span>₹{selectedOrder.subtotal}</span></div>
                <div className="total-row"><span>Shipping:</span><span>₹{selectedOrder.shipping}</span></div>
                {selectedOrder.discount > 0 && <div className="total-row discount"><span>Discount:</span><span>-₹{selectedOrder.discount}</span></div>}
                <div className="total-row grand-total"><span>Grand Total:</span><span>₹{selectedOrder.total}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;