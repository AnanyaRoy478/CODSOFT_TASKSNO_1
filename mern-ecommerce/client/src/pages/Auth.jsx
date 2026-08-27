import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode = "login" }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const nav = useNavigate(); const loc = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      isLogin ? await login(form.email, form.password) : await register(form.name, form.email, form.password); nav(new URLSearchParams(loc.search).get("next") || "/");
    }
    catch (e) { setError(e.response?.data?.message || "Something went wrong"); }
  }
  return <main className="auth"><div className="auth-card"><p className="eyebrow">WELCOME</p><h1>{isLogin ? "Sign in" : "Create account"}</h1><form onSubmit={submit}>{!isLogin && <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}<input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><input required minLength="6" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />{error && <div className="error">{error}</div>}<button className="primary wide">{isLogin ? "Sign in" : "Create account"}</button></form><p className="switch">{isLogin ? "New here?" : "Already have an account?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link></p></div></main>;
}
