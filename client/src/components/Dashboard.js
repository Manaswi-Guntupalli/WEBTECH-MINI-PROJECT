import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentsTab from './tabs/AppointmentsTab';
import PrescriptionsTab from './tabs/PrescriptionsTab';
import ReportsTab from './tabs/ReportsTab';

export default function Dashboard() {
  const [tab, setTab] = useState('appointments');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', fontSize: 32, marginBottom: 8 }}>
              🏥 Patient Dashboard
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome back, {user.name}!
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 24px',
              fontSize: '14px'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          onClick={() => setTab('appointments')}
          className={tab === 'appointments' ? 'active' : ''}
        >
          📅 Appointments
        </button>
        <button 
          onClick={() => setTab('prescriptions')}
          className={tab === 'prescriptions' ? 'active' : ''}
        >
          💊 Prescriptions
        </button>
        <button 
          onClick={() => setTab('reports')}
          className={tab === 'reports' ? 'active' : ''}
        >
          📄 Reports
        </button>
      </div>

      <div className="card">
        {tab === 'appointments' && <AppointmentsTab />}
        {tab === 'prescriptions' && <PrescriptionsTab />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
