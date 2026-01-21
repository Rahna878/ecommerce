import { useState } from "react";
import commonApi from "../api/commonApi";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            await commonApi.post("password-reset/", { email });
            setMessage("Check your email for the reset link!");
        } catch (err) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleRequest}>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "10px", width: "250px" }}
                />
                <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
                    Send Link
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;