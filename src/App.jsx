import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import WishlistPage from "./pages/Wishlist";
import { useEffect } from "react";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import Footer from "./components/Footer";
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import ProfilePage from './pages/ProfilePage';
import "./App.css";



function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
    document.head.appendChild(link);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
    </Routes>
    <Footer />
    </>
    </div>
  );
}

export default App;
