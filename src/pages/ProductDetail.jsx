import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import commonApi from "../api/commonApi";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    // --- 1. STATE MANAGEMENT ---
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    // --- 2. DATA FETCHING (MASTER LOGIC) ---
    useEffect(() => {
        window.scrollTo(0, 0);

        // THE GUARD: Stop if ID is missing or literally the string "undefined"
        if (!id || id === "undefined") return;

        const fetchAllData = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch Product, Reviews, and Recommendations simultaneously
                const [productRes, reviewsRes, recsRes] = await Promise.all([
                    commonApi.get(`products/${id}/`),
                    commonApi.get(`products/${id}/reviews/`),
                    commonApi.get(`orders/products/${id}/finish-the-look/`).catch(() => ({ data: [] }))
                ]);

                setProduct(productRes.data);
                setReviews(reviewsRes.data);
                setRecommendations(recsRes.data);

                // Set initial UI states based on product data
                if (productRes.data.is_in_wishlist) setIsWishlisted(true);
                if (productRes.data.images?.length > 0) {
                    setMainImage(getFullImageUrl(productRes.data.images[0].image));
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Could not load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    // --- 3. HELPER FUNCTIONS ---
    const getFullImageUrl = (url) => {
        if (!url) return "/no-image.png";
        if (url.startsWith("http")) return url;
        return `http://127.0.0.1:8000${url}`;
    };

    const getDeliveryEstimate = () => {
        const today = new Date();
        const estimate = new Date(today);
        estimate.setDate(today.getDate() + 7);
        return estimate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    // --- 4. ACTION HANDLERS ---
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await commonApi.post(`reviews/products/${id}/reviews/`, {
                rating: parseInt(rating),
                comment
            });
            alert("Review submitted successfully!");
            setComment("");
            setRating(5);
            // Refresh just the reviews
            const reviewsRes = await commonApi.get(`products/${id}/reviews/`);
            setReviews(reviewsRes.data);
        } catch (err) {
            alert(err.response?.data?.error || "You must purchase this item to review it.");
        }
    };

    const toggleWishlist = async () => {
        try {
            await commonApi.post(`wishlist/toggle/`, { product_id: id });
            setIsWishlisted(!isWishlisted);
            alert(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist!");
        } catch (err) {
            alert(err.response?.status === 401 ? "Please login first." : "Update failed.");
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        const success = await addToCart(product, 1);
        if (success) alert(`${product.title} added to cart!`);
    };

    // --- 5. CONDITIONAL RENDERING ---
    if (loading) return <div style={centerStyle}>Loading product...</div>;
    if (error) return <div style={centerStyle}>{error}</div>;
    if (!product) return <div style={centerStyle}>No product found.</div>;

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto", fontFamily: "system-ui" }}>
            <div style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
                {/* LEFT: Image Section */}
                <div style={{ flex: "0.8", position: "sticky", top: "20px" }}>
                    <div style={mainImageContainer}>
                        <img src={mainImage} alt={product.title} style={mainImageStyle} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
                        {product.images?.map(img => (
                            <img
                                key={img.id}
                                src={getFullImageUrl(img.image)}
                                style={thumbnailStyle(mainImage === getFullImageUrl(img.image))}
                                onClick={() => setMainImage(getFullImageUrl(img.image))}
                                alt="thumbnail"
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: Product Details */}
                <div style={{ flex: "1.2" }}>
                    <h1>{product.title}</h1>

                    <p style={{ color: "#565959", lineHeight: "1.6" }}>{product.description}</p>
                    <div style={{ margin: "20px 0" }}>
                        {/* Current Price */}
                        <div style={{ display: "flex", alignItems: "flex-start", color: "#0F1111" }}>
                            <span style={{ fontSize: "14px", marginTop: "4px", marginRight: "2px" }}>₹</span>
                            <span style={{ fontSize: "28px", fontWeight: "500" }}>{product.price}</span>
                        </div>

                        {/* Old Price (M.R.P) and Discount % */}
                        {product.old_price > product.price && (
                            <div style={{ fontSize: "14px", color: "#565959", marginTop: "4px" }}>
                                M.R.P.: <span style={{ textDecoration: "line-through" }}>₹{product.old_price}</span>
                                <span style={{ color: "#CC0C39", marginLeft: "8px" }}>
                                    ({product.discount_percentage}% off)
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                        <p><strong>Availability:</strong> <span style={{ color: product.stock > 0 ? "green" : "red" }}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span></p>
                        <p><strong>Rating:</strong> {avgRating ? `★ ${avgRating} (${reviews.length} reviews)` : "No rating yet"}</p>
                        <p style={{ marginTop: "10px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
                            <strong>Get it by:</strong> <span style={{ color: "#b12704" }}>{getDeliveryEstimate()}</span>
                        </p>
                    </div>



                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleAddToCart} style={cartButtonStyle} disabled={product.stock <= 0}>
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button onClick={toggleWishlist} style={wishlistButtonStyle(isWishlisted)}>
                            {isWishlisted ? "❤️ In Your Wishlist" : "🤍 Add to Wishlist"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div style={{ marginTop: '50px' }}>
                    <h2>More from {product.brand?.name || "this brand"}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {recommendations.map(item => <ProductCard key={item.id} product={item} />)}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div style={{ marginTop: "50px", borderTop: "1px solid #eee", paddingTop: "30px" }}>
                <h2>Customer Reviews</h2>
                <div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", marginBottom: "40px" }}>
                    <form onSubmit={handleReviewSubmit}>
                        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ marginBottom: "10px", padding: "5px" }}>
                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                        <textarea required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Review here..." style={{ width: "100%", height: "80px", margin: "10px 0", padding: "10px" }} />
                        <button type="submit" style={{ ...cartButtonStyle, width: "auto" }}>Submit Review</button>
                    </form>
                </div>
                {reviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: "1px solid #eee", padding: "15px 0" }}>
                        <strong>{rev.user}</strong> - ★{rev.rating}
                        <p>{rev.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- STYLES ---
const centerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" };
const mainImageContainer = { border: "1px solid #eee", borderRadius: "8px", padding: "10px" };
const mainImageStyle = { width: "100%", height: "350px", objectFit: "contain" };
const cartButtonStyle = { padding: "15px", backgroundColor: "#f0c14b", border: "1px solid #a88734", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%" };
const thumbnailStyle = (isActive) => ({ width: "60px", height: "80px", cursor: "pointer", border: isActive ? "2px solid #f0c14b" : "1px solid #ddd", borderRadius: "4px" });
const wishlistButtonStyle = (isActive) => ({ padding: "12px", backgroundColor: isActive ? "#fce4e4" : "#fff", border: "1px solid #adb1b8", borderRadius: "8px", cursor: "pointer", width: "100%" });

export default ProductDetail;