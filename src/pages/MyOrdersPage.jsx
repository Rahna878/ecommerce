import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import commonApi from "../api/commonApi";

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getFullImageUrl = (url) => {
        if (!url) return "https://placehold.jp/50x50.png"; // Fallback
        if (url.startsWith("http")) return url;
        return `http://127.0.0.1:8000${url}`;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await commonApi.get("orders/my/");
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);
    const OrderStepper = ({ currentStatus }) => {
        const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];

        // If the order is cancelled, we don't show the progress bar
        if (currentStatus === 'Cancelled') return null;

        const activeIndex = steps.indexOf(currentStatus);

        return (
            <div style={stepperContainer}>
                <div style={progressLineBackground} />
                <div style={progressLineActive(activeIndex, steps.length)} />
                {steps.map((step, index) => (
                    <div key={step} style={stepItem}>
                        <div style={stepCircle(index <= activeIndex)}>
                            {index < activeIndex ? '✓' : index + 1}
                        </div>
                        <span style={stepLabel(index === activeIndex)}>{step}</span>
                    </div>
                ))}
            </div>
        );
    };

    // --- Add the handleCancel logic here inside the component ---
    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const response = await commonApi.post(`orders/${orderId}/cancel/`);
            alert(response.data.message);

            // Update local state to show 'Cancelled' immediately
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'Cancelled' } : order
                )
            );
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Something went wrong";
            alert(errorMsg);
        }
    };

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading your orders...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerSection}>
                <h1>My Orders</h1>
                <button onClick={() => navigate("/")} style={continueBtnStyle}>
                    Continue Shopping
                </button>
            </div>

            {orders.length === 0 ? (
                <div style={emptyStateStyle}>
                    <h3>No orders yet!</h3>
                    <p>Looks like you haven't made your first purchase.</p>
                    <button onClick={() => navigate("/")} style={shopNowBtn}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} style={orderCard}>
                        {/* 1. Order Header */}
                        <div style={orderHeader}>
                            <div>
                                
                                <div style={dateText}>{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                            <span style={statusBadge(order.payment_status)}>
                                {order.payment_status}
                            </span>
                        </div>

                        {/* 2. Product Items List */}
                        <div style={itemsSection}>
                            {order.items?.map((item) => (
                                <div key={item.id} style={productRow}>
                                    <div style={productRow}>
                                        <img
                                            src={item.product_image || "https://placehold.jp/50x50.png"}
                                            alt={item.product_name}
                                            style={itemImage}
                                            onError={(e) => {
                                                e.target.src = "https://placehold.jp/50x50.png";
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            {/* This will now show the Product Title instead of 'Unknown Product' */}
                                            <div style={productName}>{item.product_name || "Unknown Product"}</div>
                                            <div style={productMeta}>
                                                Qty: {item.quantity} × ₹{item.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr style={dividerStyle} />

                        {/* 3. Shipping Address */}
                        {order.address && (
                            <div style={addressBox}>
                                <div style={addressLabel}>SHIPPING TO:</div>
                                <div style={addressText}>
                                    <strong>{order.address.full_name}</strong><br />
                                    {order.address.address_line}, {order.address.city}, {order.address.state} - {order.address.pincode}
                                </div>
                            </div>
                        )}
                        {/* ... after the shipping address box ... */}

                        <div style={trackingSection}>
                            <div style={estimatedDeliveryBox}>
                                <span style={deliveryIcon}>🚚</span>
                                <span>
                                    {order.status === 'Delivered' ? 'Delivered on: ' : 'Estimated Delivery: '}
                                    <strong>{new Date(order.estimated_delivery).toDateString()}</strong>
                                </span>
                            </div>

                            <OrderStepper currentStatus={order.status} />
                        </div>

                        {/* ... before the order footer ... */}

                        {/* 4. Order Footer */}
                        <div style={orderFooter}>
                            <div style={statusText}>
                                Status: <strong style={{ color: '#2ecc71' }}>{order.status}</strong>
                            </div>

                            <div style={{ display: "flex", gap: "15px" }}>
                                {/* If Delivered, show Review button instead of Cancel */}
                                {order.status === 'Delivered' ? (
                                    <button
                                        onClick={() => {
                                            // Check for product_id first, fallback to product
                                            const pid = order.items[0]?.product_id || order.items[0]?.product;
                                            if (pid) {
                                                navigate(`/product/${pid}`);
                                            } else {
                                                alert("Error: Could not find Product ID");
                                            }
                                        }}
                                        style={reviewBtnStyle}
                                    >
                                        Rate & Review
                                    </button>
                                ) : (
                                    ['Placed', 'Packed'].includes(order.status) && (
                                        <button onClick={() => handleCancel(order.id)} style={cancelBtnStyle}>
                                            Cancel Order
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

// --- Styles (Add cancelBtnStyle here) ---
const containerStyle = { padding: "40px 20px", maxWidth: "800px", margin: "0 auto", fontFamily: "'Segoe UI', Roboto, sans-serif" };
const headerSection = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const continueBtnStyle = { padding: "10px 18px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const orderCard = { border: "1px solid #eee", padding: "24px", borderRadius: "12px", marginBottom: "20px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const orderHeader = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" };
const orderIdText = { fontSize: "18px", fontWeight: "bold", color: "#232f3e" };
const dateText = { fontSize: "13px", color: "#777", marginTop: "4px" };
const itemsSection = { marginBottom: "15px" };
const productRow = { display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" };
const itemImage = { width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #f0f0f0" };
const productName = { fontWeight: "600", color: "#333", fontSize: "15px" };
const productMeta = { color: "#666", fontSize: "13px", marginTop: "2px" };
const dividerStyle = { border: "0", borderTop: "1px solid #f0f0f0", margin: "15px 0" };
const addressBox = { backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "20px" };
const addressLabel = { fontSize: "11px", color: "#999", fontWeight: "bold", letterSpacing: "0.5px", marginBottom: "5px" };
const addressText = { fontSize: "13px", lineHeight: "1.5", color: "#444" };
const orderFooter = { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "15px" };
const statusText = { fontSize: "14px", color: "#555" };
const totalAmountText = { fontSize: "18px", fontWeight: "bold", color: "#B12704" };

const cancelBtnStyle = {
    padding: "6px 14px",
    backgroundColor: "#fff",
    color: "#d9534f",
    border: "1px solid #d9534f",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
};

const statusBadge = (status) => ({
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    backgroundColor: status === "Paid" ? "#e6f4ea" : "#fff8e1",
    color: status === "Paid" ? "#1e7e34" : "#b78103",
    textTransform: "uppercase"
});

const emptyStateStyle = { textAlign: "center", padding: "60px 20px", backgroundColor: "#fcfcfc", borderRadius: "12px", border: "1px dashed #ddd" };
const shopNowBtn = { marginTop: "20px", padding: "12px 30px", backgroundColor: "#f0c14b", border: "1px solid #a88734", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const trackingSection = { margin: "20px 0", padding: "10px 0" };
const estimatedDeliveryBox = {
    fontSize: "14px",
    color: "#232f3e",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
};
const deliveryIcon = { fontSize: "18px" };

const stepperContainer = { display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "20px" };
const progressLineBackground = { position: "absolute", top: "15px", left: "0", right: "0", height: "2px", backgroundColor: "#e0e0e0", zIndex: 0 };
const progressLineActive = (index, total) => ({
    position: "absolute", top: "15px", left: "0", height: "2px",
    backgroundColor: "#f0c14b", zIndex: 0,
    width: `${(index / (total - 1)) * 100}%`,
    transition: "width 0.4s ease"
});
const stepItem = { zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "60px" };
const stepCircle = (active) => ({
    width: "30px", height: "30px", borderRadius: "50%",
    backgroundColor: active ? "#f0c14b" : "#fff",
    border: `2px solid ${active ? "#f0c14b" : "#e0e0e0"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "bold", color: active ? "#fff" : "#999"
});
const stepLabel = (isCurrent) => ({
    fontSize: "11px", marginTop: "8px", color: isCurrent ? "#232f3e" : "#888", fontWeight: isCurrent ? "bold" : "normal"
});
const reviewBtnStyle = {
    padding: "6px 14px",
    backgroundColor: "#f0c14b", // Amazon-like yellow
    color: "#111",
    border: "1px solid #a88734",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
};

export default MyOrdersPage;