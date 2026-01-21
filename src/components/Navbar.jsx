import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./NavDrawer"; 
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        setHistory(savedHistory);
    }, []);

    const saveToHistory = (query) => {
        const cleanQuery = query.trim().replace(/[.,?]$/, "");
        if (!cleanQuery) return;

        const updatedHistory = [
            cleanQuery,
            ...history.filter((item) => item !== cleanQuery)
        ].slice(0, 5);

        setHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    };

    // --- NEW: CLEAR HISTORY LOGIC ---
    const clearHistory = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setHistory([]);
        localStorage.removeItem("searchHistory");
    };

    const handleSearchSubmit = (e, customQuery) => {
        if (e) e.preventDefault();
        const finalQuery = customQuery || searchQuery;
        if (finalQuery.trim()) {
            saveToHistory(finalQuery);
            navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
            setShowHistory(false);
        }
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice search. Please try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const cleanQuery = transcript.trim().replace(/[.,?]$/, "");
            setSearchQuery(cleanQuery);
            setIsListening(false);
            handleSearchSubmit(null, cleanQuery);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.start();
    };

    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    const cartCount = safeCartItems.reduce((acc, item) => acc + (parseInt(item.quantity) || 1), 0);

    return (
        <>
            <nav style={navBarStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <i className="fas fa-bars" onClick={() => setIsSidebarOpen(true)} style={iconStyle}></i>
                    <div style={{ cursor: "pointer", fontWeight: "bold", fontSize: "20px" }} onClick={() => navigate("/")}>
                        MyShop
                    </div>
                </div>

                <form onSubmit={handleSearchSubmit} style={searchFormStyle}>
                    <div style={searchWrapperStyle}>
                        <input 
                            type="text" 
                            placeholder="Search for products..." 
                            value={searchQuery}
                            onFocus={() => setShowHistory(true)}
                            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={searchInputStyle}
                        />
                        
                        {/* SEARCH HISTORY DROPDOWN */}
                        {showHistory && history.length > 0 && (
                            <div style={historyDropdownStyle}>
                                {history.map((item, index) => (
                                    <div 
                                        key={index} 
                                        style={historyItemStyle} 
                                        // Use onMouseDown to trigger before onBlur closes the menu
                                        onMouseDown={() => handleSearchSubmit(null, item)}
                                    >
                                        <i className="fas fa-history" style={{ color: "#888", marginRight: "10px" }}></i>
                                        {item}
                                    </div>
                                ))}
                                <div 
                                    onMouseDown={clearHistory} 
                                    style={clearHistoryButtonStyle}
                                >
                                    Clear History
                                </div>
                            </div>
                        )}

                        <div onClick={handleVoiceSearch} style={micContainerStyle}>
                            <i className={`fas fa-microphone ${isListening ? "fa-beat" : ""}`} 
                               style={{ color: isListening ? "#ff4757" : "#555" }}>
                            </i>
                        </div>
                    </div>
                    
                    <button type="submit" style={searchBtnStyle}>
                        <i className="fas fa-search"></i>
                    </button>
                </form>

                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
                    {user ? (
                        <>
                            <span style={userSpanStyle}>Hello, {user.username}</span>
                            <Link to="/cart" style={cartIconContainerStyle}>
                                <i className="fas fa-shopping-cart" style={{ fontSize: "22px", color: "#fff" }}></i>
                                {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
                            </Link>
                            <button onClick={logout} style={btnStyle("#f0c14b")}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>Login</Link>
                            <Link to="/register" style={linkStyle}>Register</Link>
                        </>
                    )}
                </div>
            </nav>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
        </>
    );
};

// --- STYLES ---

const historyDropdownStyle = {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: "#fff",
    borderRadius: "0 0 4px 4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    color: "#333",
    border: "1px solid #ddd",
    borderTop: "none",
    overflow: "hidden"
};

const historyItemStyle = {
    padding: "10px 15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    transition: "background 0.2s",
    borderBottom: "1px solid #f9f9f9"
};

const clearHistoryButtonStyle = {
    padding: "8px 15px",
    fontSize: "12px",
    color: "#007185",
    textAlign: "right",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    fontWeight: "bold",
    borderTop: "1px solid #eee"
};

const navBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#232f3e",
  color: "#fff",
};

const iconStyle = {
  fontSize: "22px",
  cursor: "pointer",
  color: "#fff", 
  padding: "5px"
};

const userSpanStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px"
};

const btnStyle = (bg) => ({
  padding: "5px 15px",
  borderRadius: "3px",
  border: "none",
  cursor: "pointer",
  backgroundColor: bg,
  color: "#111",
  fontWeight: "bold",
});

const cartIconContainerStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  marginRight: "10px"
};

const cartBadgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  backgroundColor: "#f08804", 
  color: "white",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
  fontWeight: "bold",
  minWidth: "15px",
  textAlign: "center"
};

const linkStyle = { color: "#fff", textDecoration: "none", fontWeight: "bold" };
const searchFormStyle = {
    display: "flex",
    flex: "1",
    margin: "0 20px",
    maxWidth: "700px",
};

const searchWrapperStyle = {
    position: "relative",
    flex: "1",
    display: "flex",
    alignItems: "center"
};

const searchInputStyle = {
    width: "100%",
    padding: "10px 45px 10px 15px",
    borderRadius: "4px 0 0 4px",
    border: "none",
    outline: "none",
    fontSize: "16px"
};

const micContainerStyle = {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    fontSize: "18px",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const searchBtnStyle = {
    backgroundColor: "#febd69",
    border: "none",
    padding: "0 20px",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontSize: "18px",
    color: "#333"
};

export default Navbar;