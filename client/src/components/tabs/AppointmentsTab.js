import React, { useEffect, useState } from 'react';

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const res = await fetch('http://localhost:5000/api/prescriptions/doctors', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  }

  async function fetchAppointments() {
    const res = await fetch('http://localhost:5000/api/appointments', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const data = await res.json();
    setAppointments(data);
  }

  function handleDoctorSelect(e) {
    const email = e.target.value;
    setSelectedDoctor(email);
    const doctor = doctors.find(d => d.email === email);
    if (doctor) {
      setDoctorName(doctor.name);
      setDoctorEmail(doctor.email);
    }
  }

  async function add(e) {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ doctorName, doctorEmail, date, reason })
    });
    setSelectedDoctor('');
    setDoctorName(''); 
    setDoctorEmail('');
    setDate(''); 
    setReason('');
    setLoading(false);
    fetchAppointments();
  }

  return (
    <div>
      <h3 style={{ color: '#667eea', marginBottom: 20, fontSize: 24 }}>
        📅 Schedule New Appointment
      </h3>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        <span style={{ color: '#ff6b6b' }}>*</span> All fields are required
      </p>
      <form onSubmit={add} style={{ maxWidth: 640 }}>
        <div className="form-row">
          <label>Select Doctor <span style={{ color: '#ff6b6b' }}>*</span></label>
          <select 
            value={selectedDoctor}
            onChange={handleDoctorSelect}
            required
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map(d => (
              <option key={d._id} value={d.email}>Dr. {d.name} ({d.email})</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Appointment Date & Time <span style={{ color: '#ff6b6b' }}>*</span></label>
          <input 
            type="datetime-local" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label>Reason for Visit <span style={{ color: '#ff6b6b' }}>*</span></label>
          <textarea
            value={reason} 
            onChange={e => setReason(e.target.value)}
            placeholder="Brief description of your symptoms or reason for visit..."
            rows={3}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Scheduling...' : '📌 Schedule Appointment'}
        </button>
      </form>

      <h3 style={{ marginTop: 32, color: '#667eea', fontSize: 24 }}>
        🗓️ Your Upcoming Appointments ({appointments.length})
      </h3>
      {appointments.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic', marginTop: 16 }}>
          No appointments scheduled yet. Schedule your first appointment above!
        </p>
      ) : (
        appointments.map(a => (
          <div key={a._id} className="list-item" style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            border: '2px solid rgba(102, 126, 234, 0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateX(5px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#667eea', marginBottom: 4 }}>
                  👨‍⚕️ Dr. {a.doctorName}
                </div>
                <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  🕐 {new Date(a.date).toLocaleString('en-US', { 
                    dateStyle: 'full', 
                    timeStyle: 'short' 
                  })}
                </div>
                {a.reason && (
                  <div style={{ color: '#666', fontSize: 14 }}>
                    📝 {a.reason}
                  </div>
                )}
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600
              }}>
                {a.status || 'Scheduled'}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
