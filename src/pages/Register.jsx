import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import commonApi from "../api/commonApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await commonApi.post("register/", formData);

    console.log("Register success:", res.data);
    alert("Registration successful!");
    navigate("/login");

  } catch (err) {
    console.error("Register error:", err);

    if (err.response) {
      alert(
        err.response.data?.detail ||
        err.response.data?.error ||
        "Registration failed"
      );
    } else {
      alert("Server not responding. Is backend running?");
    }
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
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "inherit", 
      padding: "20px"
    }}>
      
      

      
      <div style={{
        width: "100%",
        maxWidth: "380px",
        padding: "25px 30px",
        border: "1px solid rgba(128, 128, 128, 0.3)", 
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.03)", 
        backdropFilter: "blur(12px)", 
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "500", marginBottom: "20px" }}>Create account</h1>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "5px" }}>
              Your name
            </label>
            <input
              type="text"
              name="username"
              placeholder="First and last name"
              onChange={handleChange}
              required
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid rgba(128, 128, 128, 0.5)", 
                borderRadius: "6px",
                backgroundColor: "transparent",
                color: "inherit",
                boxSizing: "border-box" 
              }}
            />
          </div>

          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "5px" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid rgba(128, 128, 128, 0.5)", 
                borderRadius: "6px",
                backgroundColor: "transparent",
                color: "inherit",
                boxSizing: "border-box" 
              }}
            />
          </div>

          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "5px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              onChange={handleChange}
              required
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid rgba(128, 128, 128, 0.5)", 
                borderRadius: "6px",
                backgroundColor: "transparent",
                color: "inherit",
                boxSizing: "border-box"
              }}
            />
          </div>

          
          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#f0c14b", 
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#111", 
            transition: "0.3s"
          }}>
            Create your account
          </button>
        </form>

        <p style={{ fontSize: "12px", marginTop: "20px", opacity: "0.8", lineHeight: "1.5" }}>
          By creating an account, you agree to our <span style={{ color: "#0066c0", cursor: "pointer" }}>Conditions of Use</span> and <span style={{ color: "#0066c0", cursor: "pointer" }}>Privacy Notice</span>.
        </p>

        <hr style={{ margin: "25px 0", border: "0", borderTop: "1px solid rgba(128, 128, 128, 0.2)" }} />

        <div style={{ fontSize: "14px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0066c0", textDecoration: "none", fontWeight: "bold" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;