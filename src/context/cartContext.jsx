import React, { createContext, useState, useEffect } from 'react';
import { db } from '../utils/db';
import useFunctions from '../utils/functions';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { syncCart } = useFunctions();

  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      localStorage.setItem('cart_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    // Load cart from Dexie on mount
    const loadCart = async () => {
      try {
        const savedCart = await db.cart.toArray();
        setCart(savedCart);
      } catch (error) {
        console.error('Error loading cart from Dexie:', error);
      }
      setIsLoaded(true);
    };
    loadCart();
  }, []);

  const saveCartToDb = async (updatedCart) => {
    try {
      // Clear existing cart and add new items
      await db.cart.clear();
      if (updatedCart.length > 0) {
        await db.cart.bulkAdd(updatedCart);
      }

      // Sync with backend
      if (sessionId) {
        await syncCart({
          session_id: sessionId,
          cart_items: updatedCart
        }).catch(err => console.error('Cart sync failed:', err));
      }
    } catch (error) {
      console.error('Error saving cart to Dexie:', error);
    }
  };

  useEffect(() => {
    // Save cart to Dexie and sync with backend whenever it changes (but only after initial load)
    if (isLoaded && sessionId) {
      saveCartToDb(cart);
    }
  }, [cart, isLoaded, sessionId]);

  const addToCart = (product) => {
    // Check if product with same id and heat_level exists
    const existingProduct = cart.find((p) =>
      p.productId === product.id && p.heat_level === product.heat_level
    );

    if (existingProduct) {
      // Update quantity if product already exists
      const updatedCart = cart.map((p) =>
        p.productId === product.id && p.heat_level === product.heat_level
          ? { ...p, quantity: p.quantity + product.quantity }
          : p
      );
      setCart(updatedCart);
      return;
    }

    // Add new product with productId instead of id
    setCart([...cart, { ...product, productId: product.id }]);
  };

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.unit_price * item.quantity;
    });
    return total;
  };

  const decreaseQuantity = (productId, quantity) => {
    const updatedCart = cart.map((product) =>
      product.productId === productId && product.quantity > 1
        ? { ...product, quantity: quantity }
        : product
    );
    setCart(updatedCart);
  };

  const increaseQuantity = (productId, quantity) => {
    const updatedCart = cart.map((product) =>
      product.productId === productId ? { ...product, quantity: quantity + 1 } : product
    );
    setCart(updatedCart);
  };

  const changePrice = (productId, quantity, heatLevel = null) => {
    const updatedCart = cart.map((product) => {
      // If heat level is provided, match both id and heat_level
      if (heatLevel !== null) {
        return product.productId === productId && product.heat_level === heatLevel
          ? { ...product, price: product.unit_price * quantity, quantity: quantity }
          : product;
      }
      // Otherwise just match by id
      return product.productId === productId
        ? { ...product, price: product.unit_price * quantity, quantity: quantity }
        : product;
    });
    setCart(updatedCart);
  };

  const removeFromCart = (productId, heatLevel = null) => {
    setCart(cart.filter((product) => {
      // If heat level is provided, match both id and heat_level
      if (heatLevel !== null) {
        return !(product.productId === productId && product.heat_level === heatLevel);
      }
      // Otherwise just match by id (for products without heat levels)
      return product.productId !== productId;
    }));
  };

  const getProductPrice = (productId) => {
    const productItem = cart.map((product) =>
      product.productId === productId ?  product.price  : null
    );

    return productItem
  }

  const getCartItemCount = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, changePrice, calculateTotal, removeFromCart, getCartItemCount, decreaseQuantity, increaseQuantity, getProductPrice}}>
      {children}
    </CartContext.Provider>
  );
};
