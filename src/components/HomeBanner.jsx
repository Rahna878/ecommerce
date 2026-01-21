import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import commonApi from "../api/commonApi";

const HomeBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await commonApi.get("banners/");
                setBanners(res.data);
            } catch (err) {
                console.error("Banner fetch failed", err);
            }
        };
        fetchBanners();
    }, []);

    // Auto-slide logic
    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [currentIndex, banners]);

    const handleBannerClick = (bannerItem) => {
        // 1. Check if category is an object: bannerItem.category.id
        if (bannerItem.category && typeof bannerItem.category === 'object') {
            navigate(`/category/${bannerItem.category.id}`);
        }
        // 2. Check if category is just an ID number: bannerItem.category
        else if (bannerItem.category) {
            navigate(`/category/${bannerItem.category}`);
        }
        else {
            console.warn("No category found for this banner");
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    if (banners.length === 0) return null;

    const current = banners[currentIndex];

    return (
        <div style={containerStyle}>
            {/* Arrows */}
            <button onClick={prevSlide} style={arrowLeft}>❮</button>
            <button onClick={nextSlide} style={arrowRight}>❯</button>

            {/* Banner Content */}
            <div style={slideStyle}>
                <img src={current.image} alt={current.title} style={imageStyle} />
                <div style={overlayStyle}>
                    <h1 style={titleStyle}>{current.title || "Exclusive Deals"}</h1>
                    <button
                        onClick={() => handleBannerClick(current)} // Use the helper with the 'current' banner
                        style={ctaButton}
                    >
                        SHOP NOW
                    </button>
                </div>
            </div>

            {/* Indicators (Dots) */}
            <div style={dotContainer}>
                {banners.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={dotStyle(idx === currentIndex)}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Styles ---
const containerStyle = {
    position: "relative",
    width: "100%",
    height: "400px",
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "30px",
    backgroundColor: "#eee"
};

const slideStyle = { width: "100%", height: "100%", position: "relative" };

const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.5s ease-in-out"
};

const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)", // Darken image slightly
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
};

const titleStyle = { fontSize: "3rem", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" };

const ctaButton = {
    marginTop: "20px",
    padding: "12px 35px",
    backgroundColor: "#f0c14b",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem"
};

const arrowLeft = { position: "absolute", left: "15px", top: "50%", zIndex: 10, background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" };
const arrowRight = { ...arrowLeft, left: "auto", right: "15px" };

const dotContainer = { position: "absolute", bottom: "15px", width: "100%", display: "flex", justifyContent: "center", gap: "10px" };
const dotStyle = (active) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: active ? "#f0c14b" : "rgba(255,255,255,0.5)",
    cursor: "pointer"
});

export default HomeBanner;