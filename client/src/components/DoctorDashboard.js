import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrescriptionModal from './PrescriptionModal';

export default function DoctorDashboard() {
  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [success, setSuccess] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handlePrescriptionSubmit = async (prescriptionData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/prescriptions/from-appointment/${selectedAppointment._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(prescriptionData)
      });

      if (res.ok) {
        setSuccess('✅ Prescription added successfully!');
        fetchAppointments(); // Refresh appointments
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add prescription');
      }
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription. Please try again.');
    }
  };

  const getAppointmentCardStyle = (appointment) => {
    if (appointment.timeStatus === 'completed') {
      return {
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
        border: '2px solid rgba(59, 130, 246, 0.4)',
        cursor: 'default'
      };
    } else if (appointment.timeStatus === 'active') {
      return {
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '2px solid rgba(34, 197, 94, 0.6)',
        cursor: 'pointer'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(107, 114, 128, 0.1) 100%)',
        border: '2px solid rgba(156, 163, 175, 0.3)',
        cursor: 'not-allowed',
        opacity: 0.7
      };
    }
  };

  const getStatusBadge = (appointment) => {
    if (appointment.timeStatus === 'completed') {
      return { text: '✅ Prescription Added', color: '#3b82f6' };
    } else if (appointment.timeStatus === 'active') {
      return { text: '⏰ Ready', color: '#22c55e' };
    } else {
      return { text: '🔒 Future', color: '#9ca3af' };
    }
  };

  return (
    <div>
      {showModal && selectedAppointment && (
        <PrescriptionModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onSubmit={handlePrescriptionSubmit}
        />
      )}

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
              appointments.map(a => {
                const cardStyle = getAppointmentCardStyle(a);
                const statusBadge = getStatusBadge(a);
                const isClickable = a.timeStatus === 'active';

                return (
                  <div 
                    key={a._id} 
                    style={{
                      ...cardStyle,
                      padding: 20,
                      borderRadius: 16,
                      marginBottom: 16,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      if (isClickable) {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.3)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => isClickable && openPrescriptionModal(a)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 600, color: '#667eea', marginBottom: 8 }}>
                          👤 {a.patientName}
                        </div>
                        <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
                          📧 {a.patientEmail}
                        </div>
                        <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                          � {new Date(a.date).toLocaleDateString('en-US', { 
                            dateStyle: 'full'
                          })}
                        </div>
                        <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                          🕐 {a.time || 'Time not specified'}
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
                        background: statusBadge.color,
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {statusBadge.text}
                      </div>
                    </div>

                    {isClickable && (
                      <div style={{
                        marginTop: 16,
                        padding: '12px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#22c55e',
                        fontWeight: 600
                      }}>
                        ✍️ Click to add prescription
                      </div>
                    )}

                    {a.timeStatus === 'future' && (
                      <div style={{
                        marginTop: 16,
                        padding: '12px',
                        background: 'rgba(156, 163, 175, 0.1)',
                        borderRadius: 10,
                        textAlign: 'center',
                        color: '#6b7280',
                        fontWeight: 600
                      }}>
                        🔒 Appointment time not reached yet
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'patients' && (
          <div>
            <h3 style={{ color: '#667eea', marginBottom: 16 }}>📋 Your Patients ({patients.length})</h3>
            <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
              Patients who have scheduled appointments with you
            </p>
            {patients.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999',
                fontStyle: 'italic'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                <div>No patients have scheduled appointments with you yet.</div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
