import { useEffect, useState } from "react";
import api from "../services/api";

const blank = { name:"", description:"", price:"", category:"", image:"", stock:"" };

export default function Admin() {
  const [products,setProducts]=useState([]); const [orders,setOrders]=useState([]); const [form,setForm]=useState(blank); const [editing,setEditing]=useState(null);
  async function load(){ const p=await api.get("/products"); setProducts(p.data.products); const o=await api.get("/orders/all"); setOrders(o.data); }
  useEffect(()=>{load()},[]);
  async function save(e){e.preventDefault(); if(editing) await api.put(`/products/${editing}`, {...form,price:Number(form.price),stock:Number(form.stock)}); else await api.post("/products", {...form,price:Number(form.price),stock:Number(form.stock)}); setForm(blank);setEditing(null);load();}
  async function del(id){if(confirm("Delete this product?")){await api.delete(`/products/${id}`);load()}}
  async function status(id,status){await api.patch(`/orders/${id}/status`,{status});load()}
  return <main className="admin"><p className="eyebrow">ADMIN</p><h1>Store management</h1><div className="admin-grid"><section><h2>{editing?"Edit product":"Add product"}</h2><form onSubmit={save} className="admin-form">{Object.keys(blank).map(k=><input key={k} required={k!=="image" || true} placeholder={k} type={["price","stock"].includes(k)?"number":"text"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}<div><button className="primary">{editing?"Save changes":"Create product"}</button>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}</div></form><div className="admin-list">{products.map(p=><div className="admin-item" key={p._id}><img src={p.image}/><div><strong>{p.name}</strong><span className="muted">${p.price.toFixed(2)} · stock {p.stock}</span></div><button className="secondary" onClick={()=>{setEditing(p._id);setForm({name:p.name,description:p.description,price:p.price,category:p.category,image:p.image,stock:p.stock})}}>Edit</button><button className="danger" onClick={()=>del(p._id)}>Delete</button></div>)}</div></section><section><h2>Orders</h2><div className="admin-list">{orders.map(o=><div className="admin-item" key={o._id}><div><strong>#{o._id.slice(-8).toUpperCase()}</strong><span className="muted">{o.user?.email} · ${o.amount.toFixed(2)}</span></div><select value={o.status} onChange={e=>status(o._id,e.target.value)}>{["pending","paid","processing","shipped","delivered","cancelled"].map(s=><option key={s}>{s}</option>)}</select></div>)}</div></section></div></main>;
}
