import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Admin from "./pages/Admin";

export default function App(){return <BrowserRouter><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/products/:id" element={<Product/>}/><Route path="/cart" element={<Cart/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/checkout/success" element={<Success/>}/><Route element={<ProtectedRoute/>}><Route path="/orders" element={<Orders/>}/></Route><Route element={<ProtectedRoute adminOnly/>}><Route path="/admin" element={<Admin/>}/></Route></Routes><footer>© {new Date().getFullYear()} MERNShop · Built with React, Node.js, Express & MongoDB</footer></BrowserRouter>}
