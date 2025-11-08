import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientEmail, setPatientEmail] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const res = await fetch('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }

  async function fetchPatients() {
    const res = await fetch('http://localhost:5000/api/prescriptions/patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPatients(data);
  }

  async function addPrescription(e) {
    e.preventDefault();
    setSuccess('');
    setLoading(true);
    
    const meds = medications.split('\n').map(l => {
      const [name, dose, freq] = l.split('|').map(s => s?.trim());
      return { name, dose, frequency: freq };
    }).filter(m => m.name);

    await fetch('http://localhost:5000/api/prescriptions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ patientEmail, medications: meds, notes })
    });

    setSuccess('✅ Prescription added successfully!');
    setPatientEmail('');
    setMedications('');
    setNotes('');
    setLoading(false);
    
    setTimeout(() => setSuccess(''), 3000);
  }

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
              👨‍⚕️ Doctor Dashboard
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
              Welcome back, Dr. {user.name}!
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
          📅 My Appointments
        </button>
        <button 
          onClick={() => setTab('prescriptions')}
          className={tab === 'prescriptions' ? 'active' : ''}
        >
          💊 Add Prescription
        </button>
        <button 
          onClick={() => setTab('patients')}
          className={tab === 'patients' ? 'active' : ''}
        >
          👥 Patients
        </button>
      </div>

      <div className="card">
        {tab === 'appointments' && (
          <div>
            <h3 style={{ color: '#667eea', marginBottom: 20 }}>📅 Your Scheduled Appointments ({appointments.length})</h3>
            {appointments.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                padding: 30,
                borderRadius: 16,
                textAlign: 'center',
                color: '#666'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                <p style={{ fontSize: 18 }}>No appointments scheduled yet.</p>
                <p>Patients will book appointments with you and they'll appear here.</p>
              </div>
            ) : (
              appointments.map(a => (
                <div key={a._id} style={{
                  background: 'linear-gradient(135deg, rgba(132, 250, 176, 0.1) 0%, rgba(143, 211, 244, 0.1) 100%)',
                  padding: 20,
                  borderRadius: 16,
                  marginBottom: 16,
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: '#667eea', marginBottom: 8 }}>
                        👤 {a.patientName}
                      </div>
                      <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                        📧 {a.patientEmail}
                      </div>
                      <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                        🕐 {new Date(a.date).toLocaleString('en-US', { 
                          dateStyle: 'full', 
                          timeStyle: 'short' 
                        })}
                      </div>
                      {a.reason && (
                        <div style={{
                          background: 'rgba(102, 126, 234, 0.05)',
                          padding: 10,
                          borderRadius: 8,
                          marginTop: 8
                        }}>
                          <strong style={{ color: '#667eea' }}>📝 Reason:</strong>
                          <div style={{ marginTop: 4, color: '#555' }}>{a.reason}</div>
                        </div>
                      )}
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {a.status || 'Scheduled'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'prescriptions' && (
          <div>
            <h3 style={{ color: '#667eea', marginBottom: 20 }}>💊 Add Prescription for Patient</h3>
            
            {success && (
              <div style={{
                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                color: 'white',
                padding: 16,
                borderRadius: 12,
                marginBottom: 20,
                fontWeight: 600,
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease'
              }}>
                {success}
              </div>
            )}

            <form onSubmit={addPrescription}>
              <div className="form-row">
                <label>Select Patient</label>
                <select 
                  value={patientEmail} 
                  onChange={e => setPatientEmail(e.target.value)}
                  required
                >
                  <option value="">-- Choose a patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p.email}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Medications (one per line: name | dose | frequency)</label>
                <textarea 
                  value={medications} 
                  onChange={e => setMedications(e.target.value)}
                  rows={5}
                  placeholder="Example:&#10;Amoxicillin | 500mg | Three times daily&#10;Paracetamol | 650mg | As needed for pain"
                  required
                />
              </div>

              <div className="form-row">
                <label>Additional Notes</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions or notes for the patient..."
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', fontSize: 16 }}>
                {loading ? '⏳ Adding...' : '✍️ Add Prescription'}
              </button>
            </form>
          </div>
        )}

        {tab === 'patients' && (
          <div>
            <h3 style={{ color: '#667eea', marginBottom: 16 }}>📋 Registered Patients ({patients.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {patients.map(p => (
                <div key={p._id} style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  padding: 16,
                  borderRadius: 12,
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>👤 {p.name}</div>
                  <div style={{ fontSize: 14, color: '#666' }}>📧 {p.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
