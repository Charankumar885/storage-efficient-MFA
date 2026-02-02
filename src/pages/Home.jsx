import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      
      {/* Badge */}
      <div style={{
        background: '#eff6ff', 
        color: '#2563eb', 
        padding: '8px 16px', 
        borderRadius: '20px', 
        fontSize: '0.9rem', 
        fontWeight: '600',
        marginBottom: '20px',
        border: '1px solid #dbeafe'
      }}>
        ✨ Next-Generation Authentication
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '10px',
        lineHeight: '1.1'
      }}>
        Storage Efficient<br />
        <span style={{ color: '#06b6d4' }}>Image Grid MFA</span>
      </h1>

      {/* Description */}
      <p style={{
        maxWidth: '600px',
        color: '#64748b',
        fontSize: '1.1rem',
        marginTop: '20px',
        lineHeight: '1.6'
      }}>
        Revolutionary multi-factor authentication using dynamic image grids and 
        cell addresses. Reduce storage by <b>94.7%</b> while maintaining enterprise-grade security.
      </p>

      {/* Buttons */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
        <Link to="/register" style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '12px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
        }}>
          Get Started →
        </Link>

        <Link to="/login" style={{
          backgroundColor: 'white',
          color: '#0f172a',
          padding: '12px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          border: '1px solid #e2e8f0'
        }}>
          Login
        </Link>
      </div>

    </div>
  );
};

export default Home;