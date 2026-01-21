import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import commonApi from "../api/commonApi";
import { useNavigate } from "react-router-dom";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutPage = () => {
    const { cartItems, loading, clearCart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        full_name: "",
        phone: "",
        address_line: "", // Changed from street_address
        city: "",
        state: "",
        pincode: ""       // Changed from zip_code
    });

    // Update your input fields accordingly:

    const finalTotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.product?.price || 0);
        const qty = parseInt(item.quantity || 1);
        return acc + (price * qty);
    }, 0);

    const handlePlaceOrder = async (e, method) => {
    if (e) e.preventDefault();

    try {
        const payload = {
            address: {
                full_name: address.full_name,
                phone: address.phone,
                address_line: address.address_line, // MUST match Django .get('address_line')
                city: address.city,
                state: address.state,
                pincode: address.pincode        // MUST match Django .get('pincode')
            },
            total_amount: parseFloat(finalTotal.toFixed(2)),
            payment_method: method
        };

        const orderRes = await commonApi.post("orders/place-order/", payload);

            // 🚨 CHECK THIS PART: 
            if (method === "cod") {
                clearCart();
                await fetchCart();
                alert("Order Placed Successfully!");
                navigate("/my-orders");
                return; // 👈 CRITICAL: Stop here for COD
            }

            // --- RAZORPAY LOGIC STARTS HERE ---
            // If it reaches here, method MUST be "razorpay"

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load.");
                return;
            }

            const { razorpay_order_id, razorpay_key, amount } = orderRes.data;

            const options = {
                key: razorpay_key,
                amount: amount,
                currency: "INR",
                name: "Your Store Name",
                order_id: razorpay_order_id,
                handler: async function (response) {
                    // This ONLY runs AFTER the user pays in the popup
                    await commonApi.post("orders/payment/verify/", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    clearCart()
                    await fetchCart();
                    alert("Payment Successful!");
                    navigate("/my-orders");
                },
                prefill: {
                    name: address.full_name,
                    contact: address.phone
                },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: function () {
                        alert("Payment cancelled. You can pay later from My Orders.");
                        navigate("/my-orders");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
        // Change this alert to see the actual message from your Django 'except' block
        const errorMsg = err.response?.data?.error || "Check terminal for error details";
        alert("Order Failed: " + errorMsg);
        console.error("Full Error Object:", err.response?.data);
    }
};
    if (loading) return <div style={{ padding: "50px" }}>Loading Checkout...</div>;

    return (
        <div style={containerStyle}>
            <div style={formWrapper}>
                <h2>Shipping Information</h2>
                <form style={formStyle}>
                    <input style={inputStyle} type="text" placeholder="Full Name" required
                        onChange={(e) => setAddress({ ...address, full_name: e.target.value })} />

                    <input style={inputStyle} type="text" placeholder="Phone Number" required
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })} />

                    <textarea
                        style={{ ...inputStyle, height: "80px" }}
                        placeholder="Street Address"
                        required
                        // CHANGE THIS: street_address -> address_line
                        onChange={(e) => setAddress({ ...address, address_line: e.target.value })}
                    />

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input style={inputStyle} type="text" placeholder="City" required
                            onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                        <input style={inputStyle} type="text" placeholder="State" required
                            onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                    </div>

                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="ZIP / Pincode"
                        required
                        // CHANGE THIS: zip_code -> pincode
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />

                    <div style={summaryBox}>
                        <h3>Order Total: ₹{finalTotal.toFixed(2)}</h3>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                            type="button"
                            onClick={(e) => handlePlaceOrder(e, "cod")}
                            style={{ ...placeOrderBtn, backgroundColor: "#fff", color: "#333" }}
                        >
                            Cash on Delivery
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handlePlaceOrder(e, "razorpay")}
                            style={placeOrderBtn}
                        >
                            Pay with Razorpay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styles remain the same as your previous code...
const summaryBox = { marginTop: "10px", padding: "15px", backgroundColor: "#e7f3ff", borderRadius: "4px", textAlign: "right" };
const containerStyle = { padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" };
const formWrapper = { backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", border: "1px solid #ddd" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" };
const inputStyle = { padding: "12px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", width: "100%", boxSizing: "border-box" };
const placeOrderBtn = { flex: 1, backgroundColor: "#f0c14b", border: "1px solid #a88734", padding: "15px", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };

export default CheckoutPage;