import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import commonApi from "../api/commonApi";
import { CartContext } from "../context/CartContext";
import HomeBanner from "../components/HomeBanner";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext); // Context function
    const navigate = useNavigate();

    // Unified handler for all buttons
    const handleAddToCartAction = async (product) => {
        console.log("Attempting to add to cart:", product);
        
        if (!product || !product.id) {
            console.error("Product ID is missing!");
            return;
        }

        const success = await addToCart(product, 1);
        if (success) {
            alert(`${product.title} added to cart!`);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await commonApi.get("products/");
                setProducts(res.data);
                const featured = res.data.filter(p => p.is_featured);
                setFeaturedProducts(featured);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };
        fetchProducts();
    }, []);

    // Reusable Product Card Component to avoid code duplication
    const ProductCard = ({ product }) => (
        <div style={cardStyle} className="product-card">
            <img
                src={product.thumbnail ? `https://rahna.pythonanywhere.com${product.thumbnail}` : "/no-image.png"}
                alt={product.title}
                style={imgStyle}
                onClick={() => navigate(`/product/${product.id}`)}
            />
            <h4 style={{ margin: "10px 0", fontSize: "16px", minHeight: "40px" }}>
                {product.title}
            </h4>
            <div style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    ₹{Number(product.price).toFixed(2)}
                </span>
                {product.old_price && (
                    <span style={oldPriceStyle}>
                        ₹{Number(product.old_price).toFixed(2)}
                    </span>
                )}
            </div>
            {product.discount_percentage > 0 && (
                <span style={{ color: "green", fontSize: "13px", marginBottom: "8px", display: "block" }}>
                    {product.discount_percentage}% OFF
                </span>
            )}
           <button
                onClick={() => handleAddToCartAction(product)}
                style={buttonStyle}
                className="add-to-cart-btn" 
            >
                Add to Cart
            </button>
        </div>
    );

    return (
        <div style={{ padding: "20px" }}>
            <HomeBanner />
            
            <h2 style={{ margin: "20px 0" }}>Featured Products</h2>
            <div style={gridStyle} className="product-grid">
                {featuredProducts.map(product => (
                    <ProductCard key={`featured-${product.id}`} product={product} />
                ))}
            </div>

            <h2 style={{ margin: "20px 0" }}>Our Products</h2>
            <div style={gridStyle} className="product-grid">
                {products.map(product => (
                    <ProductCard key={`all-${product.id}`} product={product} />
                ))}
            </div>
        </div>
    );
};

// --- Styles ---
const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
};

const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const imgStyle = {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    marginBottom: "10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const buttonStyle = {
    padding: "10px",
    backgroundColor: "#f0c14b",
    border: "1px solid #a88734",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "auto"
};

const oldPriceStyle = {
    marginLeft: "8px",
    textDecoration: "line-through",
    color: "#777",
    fontSize: "14px",
};

export default Home;