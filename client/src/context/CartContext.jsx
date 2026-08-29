import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    if (!user) return setCart({ items: JSON.parse(localStorage.getItem("guestCart") || "[]") });
    api.get("/cart").then(r => setCart(r.data)).catch(() => {});
  }, [user]);

  const items = cart.items || [];
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + (i.product?.price || i.price || 0) * i.quantity, 0);

  async function add(product, quantity = 1) {
    if (user) {
      const { data } = await api.post("/cart", { productId: product._id, quantity });
      setCart(data);
    } else {
      const next = [...items];
      const found = next.find(i => (i.product?._id || i.product) === product._id);
      if (found) found.quantity += quantity;
      else next.push({ product, quantity });
      setCart({ items: next });
      localStorage.setItem("guestCart", JSON.stringify(next));
    }
  }

  async function update(productId, quantity) {
    if (user) {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
    } else {
      const next = items.map(i => ((i.product?._id || i.product) === productId ? { ...i, quantity } : i));
      setCart({ items: next });
      localStorage.setItem("guestCart", JSON.stringify(next));
    }
  }

  async function remove(productId) {
    if (user) {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
    } else {
      const next = items.filter(i => (i.product?._id || i.product) !== productId);
      setCart({ items: next });
      localStorage.setItem("guestCart", JSON.stringify(next));
    }
  }

  return <CartContext.Provider value={{ items, count, total, add, update, remove }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
