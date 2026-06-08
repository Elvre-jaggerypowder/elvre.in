import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let newItems;
      
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: quantity }];
      }
      
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const newItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.priceValue || parseFloat(item.price?.replace('₹', '')) || 0;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};