import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import commonApi from "../api/commonApi";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await commonApi.post("login/", formData);

      // FIX: Django returns { "access": "...", "refresh": "..." }
      const actualToken = res.data.access;

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          token: actualToken, // This now saves the actual long JWT string
        })
      );

      login({
        username: formData.username,
        token: actualToken,
      });

      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",

      fontFamily: "Arial, sans-serif",
      color: "inherit"
    }}>



      <div style={{
        width: "350px",
        padding: "20px 26px",
        border: "1px solid rgba(128, 128, 128, 0.3)",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "18px" }}>Sign in</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #a6a6a6",
                borderRadius: "3px",
                backgroundColor: "transparent",
                color: "inherit",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", marginBottom: "4px" }}>
                Password
              </label>

              {/* --- ADD THIS LINK HERE --- */}
             
            </div>

            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #a6a6a6",
                borderRadius: "3px",
                backgroundColor: "transparent",
                color: "inherit",
                boxSizing: "border-box"
              }}
            />
             <Link
                to="/forgot-password"
                style={{
                  fontSize: "12px",
                  color: "#0066c0",
                  textDecoration: "none",
                  marginBottom: "4px"
                }}
                onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                onMouseOut={(e) => e.target.style.textDecoration = "none"}
              >
                Forgot your password?
              </Link>
          </div>

          <button type="submit" style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#f0c14b",
            border: "1px solid #a88734",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#111"
          }}>
            Sign in
          </button>
        </form>

        <div style={{ textAlign: "center", margin: "25px 0", position: "relative" }}>
          <hr style={{ border: "0", borderTop: "1px solid rgba(128,128,128,0.3)" }} />
          <span style={{
            position: "absolute",
            top: "-10px",
            background: "transparent",
            backdropFilter: "blur(20px)",
            padding: "0 10px",
            fontSize: "12px",
            left: "50%",
            transform: "translateX(-50%)"
          }}>New to our shop?</span>
        </div>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "transparent",
            border: "1px solid #adb1b8",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "13px",
            color: "inherit"
          }}
        >
          Create your account
        </button>
      </div>
    </div>
  );
};

export default Login;