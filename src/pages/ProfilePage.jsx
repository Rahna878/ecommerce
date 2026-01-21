import React, { useEffect, useState } from "react";
import commonApi from "../api/commonApi";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
    const [formData, setFormData] = useState({ username: "", email: "" });

    const fetchProfile = async () => {
        try {
            const res = await commonApi.get("profile/");
            setProfile(res.data);
            setFormData({ username: res.data.username, email: res.data.email });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Sends PUT request to the UserProfileView we created in Django
            const res = await commonApi.put("profile/", formData);
            setProfile(res.data);
            setIsEditing(false); // Switch back to view mode
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Update failed. Username might be taken.");
        }
    };

    if (loading) return <div style={centerStyle}>Loading...</div>;
    if (!profile) return <div style={centerStyle}>Please login to view profile.</div>;

    return (
        <div style={containerStyle}>
            <h1>My Dashboard</h1>
            <div style={dashboardGrid}>
                <div style={profileCard}>
                    <h3 style={cardTitle}>Personal Information</h3>
                    
                    {!isEditing ? (
                        <>
                            <div style={infoRow}><strong>Username:</strong> {profile.username}</div>
                            <div style={infoRow}><strong>Email:</strong> {profile.email}</div>
                            <button onClick={() => setIsEditing(true)} style={editBtnStyle}>
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Username:</label>
                                <input 
                                    style={inputStyle}
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label>Email:</label>
                                <input 
                                    style={inputStyle}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <button type="submit" style={saveBtnStyle}>Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={cancelBtnStyle}>Cancel</button>
                        </form>
                    )}
                </div>
                {/* Stats Card remains same... */}
            </div>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { 
    padding: "40px 20px", 
    maxWidth: "1000px", 
    margin: "0 auto", 
    fontFamily: "system-ui" 
};

const centerStyle = { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "50vh",
    fontSize: "1.2rem",
    color: "#555"
};

const dashboardGrid = { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    gap: "20px" 
};

const profileCard = { 
    padding: "25px", 
    borderRadius: "12px", 
    border: "1px solid #eee", 
    backgroundColor: "#fff", 
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)" 
};

const statsCard = { 
    ...profileCard, 
    backgroundColor: "#232f3e", 
    color: "#fff" 
};

const cardTitle = { 
    borderBottom: "1px solid #ddd", 
    paddingBottom: "10px", 
    marginBottom: "15px" 
};

const infoRow = { 
    marginBottom: "12px", 
    fontSize: "16px" 
};

const inputStyle = { 
    width: "100%", 
    padding: "8px", 
    marginTop: "5px", 
    borderRadius: "4px", 
    border: "1px solid #ccc",
    boxSizing: "border-box"
};

const editBtnStyle = { 
    marginTop: "15px", 
    padding: "10px 20px", 
    backgroundColor: "#f0c14b", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontWeight: "bold" 
};

const saveBtnStyle = { 
    padding: "10px 15px", 
    backgroundColor: "#2ecc71", 
    color: "white", 
    border: "none", 
    borderRadius: "5px", 
    cursor: "pointer", 
    marginRight: "10px",
    fontWeight: "bold"
};

const cancelBtnStyle = { 
    padding: "10px 15px", 
    backgroundColor: "#e74c3c", 
    color: "white", 
    border: "none", 
    borderRadius: "5px", 
    cursor: "pointer",
    fontWeight: "bold"
};

const statBoxContainer = { display: "flex", gap: "20px", marginTop: "20px" };
const statBox = { flex: 1, textAlign: "center", padding: "15px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px" };
const statNumber = { display: "block", fontSize: "24px", fontWeight: "bold" };
const statLabel = { fontSize: "12px", opacity: 0.8 };

export default ProfilePage;