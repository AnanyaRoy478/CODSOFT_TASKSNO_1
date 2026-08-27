import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Cart() {
  const { items, total, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function checkout() {
    if (!user) return navigate("/login?next=/cart");
    try {
      const { data } = await api.post("/payments/create-checkout-session");
      window.location.href = data.url;
    } catch (e) { alert(e.response?.data?.message || "Checkout failed"); }
  }

  if (!items.length) return <main className="empty"><h1>Your cart is empty</h1><p className="muted">Add something you love from the collection.</p><Link className="primary" to="/">Continue shopping</Link></main>;

  return <main className="cart-page"><p className="eyebrow">YOUR BAG</p><h1>Shopping cart</h1><div className="cart-layout"><div>{items.map(i => { const p = i.product; return <div className="cart-row" key={p?._id || i.product}><img src={p?.image} alt={p?.name}/><div className="cart-info"><Link to={`/products/${p?._id}`}>{p?.name}</Link><span className="muted">${p?.price?.toFixed(2)}</span></div><div className="quantity"><button onClick={() => i.quantity > 1 ? update(p._id, i.quantity-1) : remove(p._id)}>−</button><span>{i.quantity}</span><button onClick={() => update(p._id, Math.min(p.stock, i.quantity+1))}>+</button></div><strong>${((p?.price || 0)*i.quantity).toFixed(2)}</strong><button className="icon-btn" onClick={() => remove(p._id)}><Trash2 size={17}/></button></div>})}</div><aside className="summary"><h2>Summary</h2><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><hr/><div className="total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="primary wide" onClick={checkout}>Proceed to checkout</button>{!user && <small className="muted">You'll need to sign in before payment.</small>}</aside></div></main>;
}
