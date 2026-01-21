import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import commonApi from "../api/commonApi";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    
    // 1. Get query and handle null/undefined
    const rawQuery = new URLSearchParams(location.search).get("q") || "";

    // 2. STRENGTHENED DETECTION:
    // We trim first so that "iPhone ." becomes "iPhone."
    const cleanQueryForCheck = rawQuery.trim();
    const hasErrorPunctuation = /[.,?]$/.test(cleanQueryForCheck);
    
    // Create the suggested query by removing the trailing punctuation
    const suggestedQuery = cleanQueryForCheck.replace(/[.,?]$/, "");

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                // Encode the query to handle spaces/dots in URL correctly
                const res = await commonApi.get(`products/?search=${encodeURIComponent(rawQuery)}`);
                const fetchedData = res.data.results ? res.data.results : res.data;
                setProducts(fetchedData);
            } catch (err) {
                console.error("Search fetch error:", err);
            }
        };

        if (rawQuery) {
            fetchSearchResults();
        }
    }, [rawQuery]);

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "5px" }}>Results for "{rawQuery}"</h2>

            {/* --- DID YOU MEAN SECTION --- */}
            {/* Added extra visible styling (background and border) to ensure it's not "invisible" */}
            {hasErrorPunctuation && (
                <div style={suggestionBoxStyle}>
                    <i className="fas fa-lightbulb" style={{ color: "#f0c14b", marginRight: "8px" }}></i>
                    <span style={{ color: "#555" }}>Did you mean: </span>
                    <Link 
                        to={`/search?q=${encodeURIComponent(suggestedQuery)}`} 
                        style={suggestionLinkStyle}
                    >
                        {suggestedQuery}
                    </Link>
                </div>
            )}

            <hr style={{ margin: "20px 0", borderTop: "1px solid #eee" }} />
            
            <div style={gridStyle}>
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div style={noResultsStyle}>
                        <i className="fas fa-search" style={{ fontSize: "40px", color: "#ccc", marginBottom: "10px" }}></i>
                        <p style={{ fontSize: "18px", fontWeight: "500" }}>No products found matching your search.</p>
                        
                        {hasErrorPunctuation && (
                            <div style={{ marginTop: "15px" }}>
                                <p style={{ fontSize: "15px", color: "#444" }}>
                                    Your search included punctuation (<strong>{rawQuery}</strong>).
                                </p>
                                <Link 
                                    to={`/search?q=${encodeURIComponent(suggestedQuery)}`}
                                    style={{ color: "#007185", fontWeight: "bold", textDecoration: "underline" }}
                                >
                                    Click here to search for "{suggestedQuery}" instead
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- UPDATED STYLES FOR VISIBILITY ---

const suggestionBoxStyle = {
    fontSize: "16px",
    margin: "15px 0",
    padding: "12px 15px",
    backgroundColor: "#fffaf0", // Light cream/yellow background
    border: "1px solid #f0e0b0",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center"
};

const suggestionLinkStyle = {
    color: "#c45500", 
    textDecoration: "none",
    fontWeight: "bold",
    borderBottom: "2px solid #c45500", // Thicker dashed line
    marginLeft: "5px",
    fontSize: "17px"
};

const noResultsStyle = {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "50px 0",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
};

export default SearchPage;