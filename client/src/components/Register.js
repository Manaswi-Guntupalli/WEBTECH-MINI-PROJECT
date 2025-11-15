import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, specialization: role === 'doctor' ? specialization : undefined })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }
      
      const data = await res.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Route based on role
      if (data.user && data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ maxWidth: 450, width: '100%' }}>
        <h2 style={{ color: 'white', marginBottom: 24, fontSize: 32, textAlign: 'center' }}>
          ✨ Create Account
        </h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <label style={{ color: 'white' }}>Full Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
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
              placeholder="Create a strong password"
              required
            />
          </div>
          <div className="form-row">
            <label style={{ color: 'white' }}>Register As</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          {role === 'doctor' && (
            <div className="form-row">
              <label style={{ color: 'white' }}>Specialization</label>
              <select 
                value={specialization} 
                onChange={e => setSpecialization(e.target.value)}
                required
              >
                <option value="">-- Select Specialization --</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
                <option value="ENT Specialist">ENT Specialist</option>
                <option value="Dentist">Dentist</option>
                <option value="Urologist">Urologist</option>
              </select>
            </div>
          )}
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
              Create Account 🎉
            </button>
          </div>
          <p style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
            Already have an account? <a href="/login" style={{ color: '#a8edea', fontWeight: 600 }}>Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}
