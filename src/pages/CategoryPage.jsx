import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import commonApi from "../api/commonApi";
import { useCart } from "../context/CartContext";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (!categoryId) return;
            setLoading(true);
            try {
                const res = await commonApi.get(`products/?category=${categoryId}`);
                const fetchedData = res.data.results ? res.data.results : res.data;
                setProducts(fetchedData);
            } catch (err) {
                console.error("Failed to fetch category products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [categoryId]);

    const handleAddToCart = (e, product) => {
        e.preventDefault(); 
        addToCart(product);
        alert(`${product.title} added to cart!`);
    };

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Products...</div>;

    return (
        <div style={pageWrapper}>
            <h2 style={headerStyle}>Results for Category</h2>

            <div style={gridContainer}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} style={cardStyle}>
                            {/* FIX: Use product.id to match App.js route: /product/:id */}
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={imageWrapper}>
                                    <img
                                        src={product.thumbnail ? `https://rahna.pythonanywhere.com${product.thumbnail}` : "/no-image.png"}
                                        alt={product.title}
                                        style={imgStyle}
                                    />
                                </div>
                                <div style={contentBox}>
                                    <h4 style={titleStyle}>{product.title}</h4>
                                    <div style={priceContainer}>
                                        <span style={priceText}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                                        {product.old_price && (
                                            <div style={discountRow}>
                                                <span style={oldPriceText}>₹{Number(product.old_price).toLocaleString('en-IN')}</span>
                                                <span style={percentText}>{product.discount_percentage}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            <button onClick={(e) => handleAddToCart(e, product)} style={btnStyle}>
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={emptyState}>
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- REFINED STYLES FOR CARD GRID ---
const pageWrapper = {
    padding: "20px",
    maxWidth: "1400px", 
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box"
};

const headerStyle = {
    fontSize: "22px",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    fontWeight: "600"
};

const gridContainer = {
    display: "grid",
    // This creates a responsive grid that wraps cards automatically
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
    gap: "20px",
    width: "100%"
};

const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    transition: "box-shadow 0.2s ease",
    justifyContent: "space-between",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
};

const imageWrapper = {
    width: "100%",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px"
};

const imgStyle = {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain"
};

const contentBox = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: "5px 0"
};

const titleStyle = {
    fontSize: "15px",
    height: "42px",
    overflow: "hidden",
    margin: "0 0 10px 0",
    fontWeight: "500",
    lineHeight: "21px",
    color: "#333"
};

const priceContainer = {
    margin: "5px 0"
};

const priceText = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#B12704"
};

const discountRow = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px"
};

const oldPriceText = {
    fontSize: "13px",
    textDecoration: "line-through",
    color: "#565959"
};

const percentText = {
    color: "#CC0C39",
    fontWeight: "bold",
    fontSize: "13px"
};

const btnStyle = {
    backgroundColor: "#FFD814",
    border: "1px solid #FCD200",
    padding: "10px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginTop: "15px",
    boxShadow: "0 2px 5px rgba(213,217,217,.5)"
};

const emptyState = {
    gridColumn: "1 / -1", 
    textAlign: "center", 
    padding: "100px 0", 
    fontSize: "18px", 
    color: "#666"
};

export default CategoryPage;