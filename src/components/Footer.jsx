import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer style={footerContainer}>
            
            {/* Main Footer Links */}
            <div style={footerMain}>
                <div style={footerColumn}>
                    <h4 style={footerTitle}>Get to Know Us</h4>
                    <span style={footerLink}>About MyShop</span>
                    <span style={footerLink}>Careers</span>
                    <span style={footerLink}>Press Releases</span>
                </div>

                <div style={footerColumn}>
                    <h4 style={footerTitle}>Connect with Us</h4>
                    <span style={footerLink}>Facebook</span>
                    <span style={footerLink}>Twitter</span>
                    <span style={footerLink}>Instagram</span>
                </div>

                <div style={footerColumn}>
                    <h4 style={footerTitle}>Let Us Help You</h4>
                    <span onClick={() => navigate("/orders")} style={footerLink}>Your Orders</span>
                    <span style={footerLink}>Shipping Rates</span>
                    <span style={footerLink}>Returns & Replacements</span>
                    <span style={footerLink}>Help Center</span>
                </div>
            </div>

            {/* Bottom Branding */}
            <div style={footerBottom}>
                <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>MyShop</div>
                <div style={{ fontSize: "12px", color: "#ccc" }}>
                    © 2026, MyShop.com, Inc. or its affiliates
                </div>
            </div>
        </footer>
    );
};

// --- Styles ---
const footerContainer = {
    marginTop: "auto", // Pushes footer to bottom if page is short
    backgroundColor: "#232f3e",
    color: "#fff",
};

const backToTopStyle = {
    backgroundColor: "#37475a",
    padding: "15px",
    textAlign: "center",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.3s",
    ":hover": { backgroundColor: "#485769" }
};

const footerMain = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    padding: "40px 10%",
    maxWidth: "1200px",
    margin: "0 auto",
};

const footerColumn = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

const footerTitle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
};

const footerLink = {
    fontSize: "14px",
    color: "#ddd",
    cursor: "pointer",
    textDecoration: "none",
};

const footerBottom = {
    borderTop: "1px solid #3a4553",
    padding: "30px 0",
    textAlign: "center",
    backgroundColor: "#131a22",
};

export default Footer;