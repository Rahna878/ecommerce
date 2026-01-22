import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import commonApi from "../api/commonApi";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id || id === "undefined") return;

        const fetchAllData = async () => {
            setLoading(true);
            setError("");
            try {
                const [productRes, reviewsRes, recsRes] = await Promise.all([
                    commonApi.get(`products/${id}/`),
                    commonApi.get(`products/${id}/reviews/`),
                    commonApi.get(`orders/products/${id}/finish-the-look/`).catch(() => ({ data: [] }))
                ]);

                setProduct(productRes.data);
                setReviews(reviewsRes.data);
                setRecommendations(recsRes.data);

                if (productRes.data.is_in_wishlist) setIsWishlisted(true);
                if (productRes.data.images?.length > 0) {
                    setMainImage(getFullImageUrl(productRes.data.images[0].image));
                }
            } catch (err) {
                setError("Could not load product details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const getFullImageUrl = (url) => {
        if (!url) return "/no-image.png";
        if (url.startsWith("http")) return url;
        return `https://rahna.pythonanywhere.com${url}`;
    };

    const getDeliveryEstimate = () => {
        const today = new Date();
        const estimate = new Date(today);
        estimate.setDate(today.getDate() + 7);
        return estimate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
    };

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
        } catch (err) {
            alert("Update failed.");
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        const success = await addToCart(product, 1);
        if (success) alert(`${product.title} added to cart!`);
    };

    if (loading) return <div style={centerStyle}>Loading product...</div>;
    if (error) return <div style={centerStyle}>{error}</div>;
    if (!product) return <div style={centerStyle}>No product found.</div>;

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="product-page-wrapper">
            <div className="product-main-container">
                {/* LEFT: Image Section */}
                <div className="image-column">
                    <div style={mainImageContainer}>
                        <img src={mainImage} alt={product.title} className="detail-main-img" />
                    </div>
                    <div className="detail-thumb-row">
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

                {/* RIGHT: Details Section */}
                <div className="info-column">
                    <h1 className="detail-title">{product.title}</h1>
                    <p className="detail-description">{product.description}</p>
                    
                    <div className="detail-price-box">
                        <div className="new-price">
                            <span className="currency">₹</span>
                            <span className="price-val">{product.price}</span>
                        </div>

                        {product.old_price > product.price && (
                            <div className="mrp-row">
                                M.R.P.: <span className="old-price-val">₹{product.old_price}</span>
                                <span className="discount-tag">({product.discount_percentage}% off)</span>
                            </div>
                        )}
                    </div>

                    <div className="detail-status-card">
                        <p><strong>Availability:</strong> <span style={{ color: product.stock > 0 ? "green" : "red" }}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span></p>
                        <p><strong>Rating:</strong> {avgRating ? `★ ${avgRating} (${reviews.length} reviews)` : "No rating yet"}</p>
                        <p><strong>Get it by:</strong> <span className="delivery-highlight">{getDeliveryEstimate()}</span></p>
                    </div>

                    <div className="detail-btn-group">
                        <button onClick={handleAddToCart} className="add-cart-btn" disabled={product.stock <= 0}>
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button onClick={toggleWishlist} className={`wish-btn ${isWishlisted ? 'active' : ''}`}>
                            {isWishlisted ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="recommendations-section">
                    <h2 style={{ marginBottom: "20px" }}>More from {product.brand?.name || "this brand"}</h2>
                    <div className="recommendation-grid">
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



// --- STYLES (Keep existing objects for specific JS logic) ---
const centerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" };
const mainImageContainer = { border: "1px solid #eee", borderRadius: "8px", padding: "10px", background: "#fff" };
const thumbnailStyle = (isActive) => ({ width: "60px", height: "80px", cursor: "pointer", border: isActive ? "2px solid #f0c14b" : "1px solid #ddd", borderRadius: "4px", objectFit: "cover" });

export default ProductDetail;