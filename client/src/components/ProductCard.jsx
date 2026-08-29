import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  return <article className="card">
    <Link to={`/products/${product._id}`}><img src={product.image} alt={product.name}/></Link>
    <div className="card-body">
      <div className="muted">{product.category}</div>
      <Link className="product-name" to={`/products/${product._id}`}>{product.name}</Link>
      <div className="card-bottom"><strong>${product.price.toFixed(2)}</strong><button className="add-btn" disabled={!product.stock} onClick={() => add(product)}><ShoppingCart size={17}/> {product.stock ? "Add" : "Sold out"}</button></div>
    </div>
  </article>;
}
