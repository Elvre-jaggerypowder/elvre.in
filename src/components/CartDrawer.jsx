import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import "./CartDrawer.css";

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    window.addEventListener("storage", handleCartUpdate);
    return () => window.removeEventListener("storage", handleCartUpdate);
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    const total = savedCart.reduce(
      (sum, item) => sum + (item.priceValue || 0) * (item.quantity || 1),
      0
    );
    setSubtotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    loadCart();
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    loadCart();
  };

  const handleCheckout = () => {
    onClose();
    const user = localStorage.getItem("currentUser");
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-drawer-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-drawer-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">
              <p>Your cart is empty.</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const price = item.priceValue || 0;
                  const qty = item.quantity || 1;
                  return (
                    <div key={item.id} className="cart-drawer-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>₹{price}</p>
                        <div className="item-actions">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, qty - 1)}
                          >
                            <FaMinus />
                          </button>
                          <span>{qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, qty + 1)}
                          >
                            <FaPlus />
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="item-total">₹{price * qty}</div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-drawer-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {subtotal < 499 && subtotal > 0 && (
                  <div className="free-shipping-notice">
                    Add ₹{499 - subtotal} more for free shipping
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;