import { createContext, useState, useContext, useEffect } from "react";
import commonApi from "../api/commonApi";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await commonApi.get("cart/");
      const data = Array.isArray(res.data) 
        ? res.data 
        : (res.data.items || res.data.results || []);
      setCartItems(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("access");
  if (token) {
    fetchCart();
  } else {
    setLoading(false); // Stop loading if there's no user to fetch for
  }
}, []);
 const addToCart = async (product, quantity = 1) => {
  // DEBUG: Check what 'product' actually is in the console
  console.log("Product object received in Context:", product);

  if (!product || !product.id) {
    console.error("Cannot add to cart: Product or Product ID is missing!");
    return false;
  }

  try {
    const res = await commonApi.post("cart/add/", {
      product_id: product.id, // Django is explicitly asking for this key
      quantity: quantity,
    });
    await fetchCart();
    return true; 
  } catch (err) {
    console.error("Cart API Detail:", err.response?.data); 
    return false; 
  }
};
  // --- NEW: Update Quantity Function ---
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return; // Don't allow quantity less than 1

    try {
      // Sync with Django Backend
      await commonApi.post("cart/update/", {
        product_id: productId,
        quantity: newQty,
      });

      // Update Local State for instant UI feedback
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // CartContext.jsx
const removeFromCart = async (productId) => {
  try {
    // Sends DELETE to /api/cart/remove/7/
    await commonApi.delete(`cart/remove/${productId}/`);
    
    // Update frontend state only if the server request succeeds
    setCartItems(prevItems => prevItems.filter((item) => item.product.id !== productId));
  } catch (err) {
    console.error("Error removing item:", err);
    // Optional: Alert the user if deletion fails
    alert("Failed to remove item. Please try again.");
  }
};

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider 
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, loading, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};