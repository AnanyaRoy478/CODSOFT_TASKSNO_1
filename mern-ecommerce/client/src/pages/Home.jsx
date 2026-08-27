import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/products", { params: { search, category, sort } });
    setProducts(data.products); setCategories(data.categories); setLoading(false);
  }
  useEffect(() => { load(); }, [category, sort]);

  return <main>
    <section className="hero"><div><p className="eyebrow">CURATED EVERYDAY GOODS</p><h1>Good products.<br/><em>Simply delivered.</em></h1><p className="hero-copy">Discover thoughtfully selected essentials for your everyday life.</p><a className="primary" href="#products">Shop collection</a></div></section>
    <section id="products" className="shop-section">
      <div className="section-head"><div><p className="eyebrow">THE COLLECTION</p><h2>Shop all products</h2></div><span className="muted">{products.length} products</span></div>
      <div className="filters">
        <div className="search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} placeholder="Search products…"/></div>
        <select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
        <button className="filter-submit" onClick={load}><SlidersHorizontal size={17}/> Apply</button>
      </div>
      {loading ? <div className="loading">Loading products…</div> : <div className="grid">{products.map(p => <ProductCard key={p._id} product={p}/>)}</div>}
    </section>
  </main>;
}
