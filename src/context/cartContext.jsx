import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Retrieve cart data from localStorage on component mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart data to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingProduct = cart.find((p) => p.id === product.id);
    if (existingProduct) {
      // const updatedCart = cart.map((p) =>
      //   p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      // );
      // console.log(JSON.stringify(updatedCart))
      // setCart(updatedCart);
      return 
    }
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const decreaseQuantity = (productId, quantity) => {
    const updatedCart = cart.map((product) =>
      product.id === productId && product.quantity > 1
        ? { ...product, quantity: quantity }
        : product
    );
    setCart(updatedCart);
  };

  const increaseQuantity = (productId, quantity) => {
    const updatedCart = cart.map((product) =>
      product.id === productId ? { ...product, quantity: quantity } : product
    );
    setCart(updatedCart);
  };

  const changePrice = (productId, quantity) => {
    const updatedCart = cart.map((product) =>
      product.id === productId ? { ...product, price: product.unit_price * quantity } : product
    );
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((product) => product.id !== productId));
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      const updatedCart = JSON.parse(event.newValue);
      setCart(updatedCart);
    }
  });

  return (
    <CartContext.Provider value={{ cart, addToCart, changePrice, calculateTotal, removeFromCart, getCartItemCount, decreaseQuantity, increaseQuantity}}>
      {children}
    </CartContext.Provider>
  );
};
