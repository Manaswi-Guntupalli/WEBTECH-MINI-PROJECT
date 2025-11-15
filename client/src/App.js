import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';

function App() {
  const location = useLocation();
  
  // Hide header on dashboard pages AND homepage
  const hideHeader = location.pathname === '/dashboard' || 
                     location.pathname === '/doctor-dashboard' ||
                     location.pathname === '/';

  return (
    <div className="app">
      {!hideHeader && (
        <header>
          <h1>VitalLink</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
