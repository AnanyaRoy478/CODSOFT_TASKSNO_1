import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders").then(r => setOrders(r.data)); }, []);
  return <main className="orders"><p className="eyebrow">ACCOUNT</p><h1>Your orders</h1>{!orders.length ? <p className="muted">No orders yet.</p> : <div className="order-list">{orders.map(o => <article className="order" key={o._id}><div className="order-head"><strong>Order #{o._id.slice(-8).toUpperCase()}</strong><span className={`status ${o.status}`}>{o.status}</span></div><p className="muted">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p><div className="order-items">{o.items.map(i => <span key={i.name}>{i.name} × {i.quantity}</span>)}</div><strong>${o.amount.toFixed(2)}</strong></article>)}</div>}</main>;
}
