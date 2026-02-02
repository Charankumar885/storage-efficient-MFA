import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageGrid from "../components/ImageGrid";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [patternData, setPatternData] = useState([]); // Stores { index, hash }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (patternData.length !== 3) {
      alert("Please upload exactly 3 images for your pattern.");
      return;
    }

    // Extract only the hashes and indices for the database
    // This is the "Storage Efficient" part
    const secretPattern = patternData.map(item => ({
      cellIndex: item.cellIndex,
      imageHash: item.hash
    }));

    try {
      const response = await axios.post("https://storage-efficient-mfa.onrender.com/register", {
        email: formData.email,
        password: formData.password,
        secretPattern: secretPattern // Sending JSON, not Image Blobs!
      });

      if (response.data.status === 'ok') {
        alert("Registration Successful!");
        navigate('/login');
      } else {
        alert("Error: " + response.data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Upload 3 secret images to the grid</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Your 3 Images</label>
            {/* Pass the handler to receive the hashes */}
            <ImageGrid onPatternChange={setPatternData} />
            <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '8px'}}>
              Selected: {patternData.length} / 3
            </p>
          </div>

          <button type="submit" className="btn-primary">Complete Registration</button>
        </form>
      </div>
    </div>
  );
};

export default Register;