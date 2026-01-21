import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import commonApi from "../api/commonApi";

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await commonApi.post("password-reset-confirm/", {
                uid: uid,
                token: token,
                new_password: newPassword
            });
            alert("Password reset successful! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            alert("Link is invalid or has expired.");
        }
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Create New Password</h2>
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordConfirm;