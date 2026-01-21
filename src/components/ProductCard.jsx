import React from "react"; // Added explicit React import for safety
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    if (!product) return null;

    const getFullImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `https://rahna.pythonanywhere.com${path}`;
    };

    const imageUrl = getFullImageUrl(product.thumbnail);
    const price = product?.price || "0.00";
    const oldPrice = product?.old_price;
    const hasDiscount = oldPrice && Number(oldPrice) > Number(price);
    
    const discountPercentage = product.discount_percentage || (hasDiscount 
        ? Math.round(((oldPrice - price) / oldPrice) * 100) 
        : 0);

    const localFallback = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    // Dynamic hover handlers to avoid syntax issues with inline objects
    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.12)";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
    };

    return (
        <div 
            onClick={() => product?.id && navigate(`/product/${product.id}/`)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={cardStyle}
        >
            {discountPercentage > 0 && (
                <div style={badgeStyle}>{discountPercentage}% OFF</div>
            )}

            <div style={imageContainerStyle}>
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={product?.title} 
                        style={imageStyle} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = localFallback; 
                        }}
                    />
                ) : (
                    <div style={noImagePlaceholderStyle}>No Image</div>
                )}
            </div>

            <div style={infoStyle}>
                <h4 style={titleStyle}>{product?.title || "Untitled Product"}</h4>
                <div style={priceContainerStyle}>
                    <span style={currentPriceStyle}>₹{price}</span>
                    {hasDiscount && <span style={oldPriceStyle}>₹{oldPrice}</span>}
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const cardStyle = {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "15px",
    cursor: "pointer",
    backgroundColor: "#fff",
    position: "relative",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    height: "auto",
};

const badgeStyle = {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "#cc0c39",
    color: "white",
    padding: "4px 10px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    borderRadius: "4px",
    zIndex: 1
};

const imageContainerStyle = {
    width: "100%",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
};

const imageStyle = {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain"
};

const noImagePlaceholderStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    borderRadius: "8px"
};

const titleStyle = {
    fontSize: "1rem",
    margin: "0 0 10px 0",
    color: "#111",
    height: "2.4em",
    lineHeight: "1.2em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    fontWeight: "500"
};

const infoStyle = { 
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flexGrow: 1 
};

const priceContainerStyle = {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginTop: "auto"
};

const currentPriceStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#B12704"
};

const oldPriceStyle = {
    fontSize: "0.85rem",
    color: "#565959",
    textDecoration: "line-through"
};

export default ProductCard;