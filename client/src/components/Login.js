import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }
      
      const data = await res.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Route to appropriate dashboard based on role
      if (data.user && data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: 450, width: '100%' }}>
        <h2 style={{ color: 'white', marginBottom: 24, fontSize: 32, textAlign: 'center' }}>
          🔐 Welcome Back
        </h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <label style={{ color: 'white' }}>Email Address</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-row">
            <label style={{ color: 'white' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div style={{ 
              color: '#ff6b6b', 
              background: 'rgba(255, 107, 107, 0.1)',
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <button type="submit" style={{ width: '100%', padding: 16, fontSize: 18 }}>
              Login to Dashboard 🚀
            </button>
          </div>
          <p style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
            Don't have an account? <a href="/register" style={{ color: '#a8edea', fontWeight: 600 }}>Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}
