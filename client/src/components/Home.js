import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>VitalLink</h1>
        <p>Your Health, Our Priority - Manage Your Medical Journey Seamlessly</p>
        <div className="hero-buttons">
          <Link to="/login">
            <button>Login to Dashboard</button>
          </Link>
          <Link to="/register">
            <button className="btn-secondary">Create New Account</button>
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Easy Appointments</h3>
          <p>Schedule and manage appointments with your healthcare providers effortlessly</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💊</div>
          <h3>Prescriptions</h3>
          <p>Access all your prescriptions and medication details in one secure place</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Medical Reports</h3>
          <p>Upload, store, and access your medical reports anytime, anywhere</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure & Private</h3>
          <p>Your health data is encrypted and protected with industry-standard security</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-time Updates</h3>
          <p>Get instant notifications about appointments and prescription updates</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👨‍⚕️</div>
          <h3>Doctor Connect</h3>
          <p>Seamless communication between patients and healthcare providers</p>
        </div>
      </div>
    </div>
  );
}
