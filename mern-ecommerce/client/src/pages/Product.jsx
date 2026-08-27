import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { api.get(`/products/${id}`).then(r => setProduct(r.data)); }, [id]);
  if (!product) return <div className="loading">Loading…</div>;
  return <main className="detail"><Link className="back" to="/">← Back to shop</Link><div className="detail-grid"><img className="detail-image" src={product.image} alt={product.name}/><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><div className="price">${product.price.toFixed(2)}</div><p>{product.description}</p><p className="muted">{product.stock} in stock</p><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity-1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity+1))}>+</button></div><button className="primary wide" disabled={!product.stock} onClick={() => add(product, quantity)}>Add to cart</button></div></div></main>;
}
