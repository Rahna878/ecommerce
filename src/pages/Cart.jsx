import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import commonApi from "../api/commonApi";

const CartPage = () => {
    // Destructure updateQuantity and removeFromCart from context
    const { cartItems, loading, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [couponInput, setCouponInput] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [couponMessage, setCouponMessage] = useState({ text: "", color: "" });

    const safeItems = Array.isArray(cartItems) ? cartItems : (cartItems?.items || []);

    const handleApplyCoupon = async () => {
        try {
            // Added 'orders/' before the endpoint
            const res = await commonApi.post("orders/apply-coupon/", { code: couponInput });

            setDiscountPercent(res.data.coupon.discount_percent);
            setCouponMessage({
                text: `Success! ${res.data.coupon.discount_percent}% off applied.`,
                color: "green"
            });
        } catch (err) {
            setDiscountPercent(0);
            // Changed to 'error' to match common Django error keys
            const msg = err.response?.data?.error || err.response?.data?.message || "Invalid coupon";
            setCouponMessage({ text: msg, color: "red" });
        }
    };
    const subtotal = safeItems.reduce((acc, item) => {
        const price = parseFloat(item.product?.price || item.price || 0);
        const qty = parseInt(item.quantity || 1);
        return acc + (price * qty);
    }, 0);

    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;

    if (loading) return <div style={{ padding: "20px" }}>Loading your cart...</div>;

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2>Shopping Cart</h2>
            <hr />

            {safeItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go Shopping</Link></p>
            ) : (
                <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>

                    <div style={{ flex: 2 }}>
                        {safeItems.map(item => (
                            <div key={item.id} style={itemStyle}>
                                <img
                                    src={`https://rahna.pythonanywhere.com${item.product?.thumbnail}`}
                                    alt={item.product?.title}
                                    style={{ width: "120px", height: "120px", objectFit: "contain" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ marginBottom: "5px" }}>{item.product?.title}</h4>
                                    <p style={{ fontWeight: "bold" }}>Price: ₹{item.product?.price}</p>

                                    {/* Quantity Controls */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                                        <button
                                            style={qtyBtnStyle}
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                            - </button>

                                        <span style={{ fontWeight: "bold", width: "20px", textAlign: "center" }}>
                                            {item.quantity}
                                        </span>

                                        <button
                                            style={qtyBtnStyle}
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        > + </button>

                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            style={deleteBtnStyle}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={summaryStyle}>
                        <h3>Order Summary</h3>
                        <div style={{ margin: "20px 0" }}>
                            <p>Subtotal: <b>₹{subtotal.toFixed(2)}</b></p>

                            <div style={{ display: "flex", marginTop: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Enter Coupon"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    style={{ padding: "8px", flex: 1 }}
                                />
                                <button onClick={handleApplyCoupon} style={applyBtnStyle}>Apply</button>
                            </div>

                            {couponMessage.text && (
                                <p style={{ fontSize: "12px", color: couponMessage.color, marginTop: "5px" }}>
                                    {couponMessage.text}
                                </p>
                            )}

                            {discountPercent > 0 && (
                                <p style={{ color: "green" }}>Discount: -₹{discountAmount.toFixed(2)}</p>
                            )}
                            <hr />
                            <h3 style={{ color: "#B12704" }}>Total: ₹{finalTotal.toFixed(2)}</h3>
                        </div>

                       <button
                            onClick={() => navigate("/checkout")}
                            disabled={safeItems.length === 0}
                            style={checkoutBtnStyle}
                        >
                            Proceed to Buy ({safeItems.length} items)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const itemStyle = { display: "flex", gap: "20px", borderBottom: "1px solid #eee", padding: "20px 0" };
const summaryStyle = { flex: 1, border: "1px solid #ddd", padding: "20px", borderRadius: "8px", height: "fit-content", backgroundColor: "#fff" };
const applyBtnStyle = { padding: "8px", marginLeft: "5px", cursor: "pointer", backgroundColor: "#232f3e", color: "white", border: "none" };
const checkoutBtnStyle = { width: "100%", padding: "12px", marginTop: "20px", backgroundColor: "#f0c14b", border: "1px solid #a88734", fontWeight: "bold", cursor: "pointer", borderRadius: "8px" };

const qtyBtnStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #d5d9d9",
    backgroundColor: "#f0f2f2",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "18px",
    boxShadow: "0 2px 5px rgba(213,217,217,.5)"
};

const deleteBtnStyle = {
    marginLeft: "20px",
    color: "#007185",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "underline"
};

export default CartPage;