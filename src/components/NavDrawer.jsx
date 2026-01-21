import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const Sidebar = ({ isOpen, onClose, user }) => {

  

  const { logout } = useContext(AuthContext); // Get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose(); // Close sidebar after logout
    navigate("/login");
  };

  return (
    <>
      {/* Dark Overlay behind the drawer */}
      {isOpen && <div style={overlayStyle} onClick={onClose}></div>}

      {/* Side Drawer */}
      <div style={{ ...drawerStyle, left: isOpen ? "0" : "-350px" }}>
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fas fa-user-circle"></i>
            <span>Hello, {user ? user.username : "Sign In"}</span>
          </div>
          <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>

        <div style={contentStyle}>
         

          <hr style={dividerStyle} />

          <div style={sectionTitleStyle}>My Account</div>
          <Link to="/profile" onClick={onClose} style={linkStyle}>Account Details</Link>

          {/* --- ADDED MY ORDERS LINK --- */}
          <Link to="/my-orders" onClick={onClose} style={linkStyle}>
            <i className="fas fa-box" style={{ color: "#2ecc71", marginRight: "10px" }}></i>
            My Orders
          </Link>

          {/* Wishlist Link */}
          <Link to="/wishlist" onClick={onClose} style={linkStyle}>
            <i className="fas fa-heart" style={{ color: "#ff4757", marginRight: "10px" }}></i>
            My Wishlist
          </Link>

          <hr style={dividerStyle} />

          <div style={sectionTitleStyle}>Shop by Category</div>
          <Link to="/category/1" onClick={onClose} style={linkStyle}>Electronics</Link>
          <Link to="/category/3" onClick={onClose} style={linkStyle}>Fashion</Link>
          <Link to="/category/2" onClick={onClose} style={linkStyle}>Beauty and Personal Care</Link>
        </div>
        {/* This pushes the logout to the very bottom */}
        {user && (
          <div style={footerStyle}>
            <div
              onClick={handleLogout}
              style={{ ...linkStyle, cursor: "pointer", color: "#d9534f", fontWeight: "bold" }}
            >
              <i className="fas fa-sign-out-alt" style={{ marginRight: "10px" }}></i>
              Sign Out
            </div>
          </div>
        )}
      </div>
    </>
  );
};
// --- Styles ---

const drawerStyle = {
  position: "fixed",
  top: 0,
  height: "100%",
  width: "300px",
  backgroundColor: "white",
  boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
  transition: "0.3s ease",
  zIndex: 2000,
  display: "flex",         // Added for layout
  flexDirection: "column", // Stack content and footer
};
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 1999, // Just below the drawer
};
const headerStyle = {
  backgroundColor: "#232f3e",
  color: "white",
  padding: "20px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const closeButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  fontSize: "2rem",
  cursor: "pointer",
  lineHeight: "1",
};

const contentStyle = {
  padding: "10px 0",
  flex: 1,                 // This makes the content area take up available space
  overflowY: "auto",       // Allows scrolling for long categories
};

const footerStyle = {
  padding: "15px 0",
  borderTop: "1px solid #eee",
  backgroundColor: "#f9f9f9"
};

const sectionTitleStyle = {
  padding: "15px 20px 5px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  color: "#111",
};

const linkStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#444",
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "background 0.2s",
};

const dividerStyle = {
  border: "0",
  borderTop: "1px solid #eee",
  margin: "10px 0",
};

export default Sidebar;