import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return <header className="header">
    <Link className="brand" to="/">MERN<span>Shop</span></Link>
    <nav>
      <Link to="/">Shop</Link>
      {user && <Link to="/orders">Orders</Link>}
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      <Link className="cart-link" to="/cart"><ShoppingBag size={19}/> Cart <b>{count}</b></Link>
      {user ? <button className="icon-btn" onClick={() => { logout(); navigate("/"); }} title="Log out"><LogOut size={18}/></button> : <Link className="icon-btn" to="/login"><User size={18}/></Link>}
    </nav>
  </header>;
}
