import { useState, useEffect, useContext } from "react";
import commonApi from "../api/commonApi";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null); // Track which item is being added
    
    const { addToCart } = useContext(CartContext);
    const backendUrl = "http://127.0.0.1:8000";

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const userString = localStorage.getItem("user");
        if (!userString) {
            setLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(userString);
            const token = userData.token; 
            if (!token) { setLoading(false); return; }

            const res = await commonApi.get("wishlist/");
            setWishlist(res.data);
        } catch (err) {
            console.error("Error fetching wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        setAddingId(product.id); // Start loading for this specific button
        await addToCart(product);
        setAddingId(null); // Stop loading
    };

    const removeItem = async (productId) => {
        try {
            await commonApi.post("wishlist/toggle/", { product_id: productId });
            setWishlist(prev => prev.filter(item => item.product.id !== productId));
        } catch (err) {
            alert("Error removing item.");
        }
    };
    const handleMoveToCart = async (product) => {
    try {
        // 1. Add to cart using the context function
        await addToCart(product); 
        
        // 2. Alert the user (Since your context doesn't do it)
        alert(`${product.title} added to cart!`);

        // 3. Remove from wishlist (Backend call)
        await commonApi.post("wishlist/toggle/", { product_id: product.id });

        // 4. Update the local UI state so it disappears from the screen immediately
        setWishlist(prev => prev.filter(item => item.product.id !== product.id));

    } catch (err) {
        console.error("Move to cart failed:", err);
        alert("Something went wrong while moving the item.");
    }
};

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Wishlist...</div>;

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "30px" }}>My Wishlist ({wishlist.length})</h2>

            {wishlist.length === 0 ? (
                <p>Your wishlist is empty. <Link to="/">Go shopping!</Link></p>
            ) : (
                <div style={gridStyle}>
                    {wishlist.map((item) => (
                        <div key={item.id} style={cardStyle}>
                            <Link to={`/product/${item.product?.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <img
                                    src={item.product?.thumbnail ? `${backendUrl}${item.product.thumbnail}` : "https://placehold.co/300x300?text=No+Image"}
                                    alt={item.product?.title}
                                    style={imageStyle}
                                    onError={(e) => { e.target.src = "https://placehold.co/300x300?text=Image+Error"; }}
                                />
                                <h4 style={{ margin: "10px 0" }}>{item.product?.title || "Product Name"}</h4>
                                <p style={{ fontWeight: "bold" }}>₹{item.product?.price}</p>
                            </Link>

                            <button 
                                onClick={() => handleMoveToCart(item.product)} 
                                disabled={addingId === item.product.id}
                                style={{ 
                                    ...cartBtnStyle, 
                                    opacity: addingId === item.product.id ? 0.7 : 1,
                                    cursor: addingId === item.product.id ? "not-allowed" : "pointer" 
                                }}
                            >
                                {addingId === item.product.id ? "Adding..." : "Add to Cart"}
                            </button>

                            <button onClick={() => removeItem(item.product.id)} style={removeBtnStyle}>
                                Remove from Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Styles moved outside for performance ---
const gridStyle = {
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
    gap: "25px"
};

const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
};

const imageStyle = { width: "100%", height: "200px", objectFit: "contain" };

const cartBtnStyle = {
    backgroundColor: "#f0c14b",
    border: "1px solid #a88734",
    padding: "8px",
    borderRadius: "5px",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "10px"
};

const removeBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#007185",
    cursor: "pointer",
    fontSize: "0.9rem",
    textDecoration: "underline"
};

export default WishlistPage;