import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import ImageGrid from "../components/ImageGrid";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate(); // Hook for redirection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [patternData, setPatternData] = useState([]); // Stores { index, hash }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-Side Check
    if (patternData.length !== 3) {
      alert(`You registered with 3 images, but you only selected ${patternData.length}. Please upload all 3.`);
      return;
    }

    // 2. Prepare Data (Extract Hashes)
    const secretPattern = patternData.map(item => ({
      cellIndex: item.cellIndex,
      imageHash: item.hash
    }));

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
        secretPattern
      });

      console.log("Server Response:", response.data);

      if (response.data.status === 'ok') {
        alert("✅ Login Successful! Access Granted.");
        // Redirect to a dashboard or home page if you have one
        navigate('/'); 
      } else {
        alert("❌ Login Failed: " + response.data.error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Connection Error.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Enter credentials & upload your secret images</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verify Your Pattern</label>
            {/* The Grid */}
            <ImageGrid onPatternChange={setPatternData} />
            
            {/* Helper Text */}
            <p style={{
              fontSize: '0.8rem', 
              color: patternData.length === 3 ? 'green' : '#64748b', 
              marginTop: '8px',
              fontWeight: '600'
            }}>
              {patternData.length === 3 
                ? "✓ 3 Images Ready" 
                : `Selected: ${patternData.length} / 3 images`}
            </p>
          </div>

          {/* Button is disabled until 3 images are picked */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={patternData.length !== 3}
            style={{ opacity: patternData.length !== 3 ? 0.6 : 1 }}
          >
            Verify & Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;