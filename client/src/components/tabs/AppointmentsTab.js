import React, { useEffect, useState } from 'react';

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [specializationFilter, setSpecializationFilter] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // Update filtered doctors when doctors data or filter changes
  useEffect(() => {
    if (specializationFilter === 'all') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.specialization === specializationFilter));
    }
  }, [doctors, specializationFilter]);

  async function fetchDoctors() {
    try {
      const res = await fetch('http://localhost:5000/api/prescriptions/doctors', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      console.log('Fetched doctors:', data);
      setDoctors(data);
      setFilteredDoctors(data);
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
    // Look in filteredDoctors first, then fall back to all doctors
    const doctor = filteredDoctors.find(d => d.email === email) || doctors.find(d => d.email === email);
    if (doctor) {
      setDoctorName(doctor.name);
      setDoctorEmail(doctor.email);
    }
  }

  function handleSpecializationFilter(specialization) {
    setSpecializationFilter(specialization);
    // Reset selected doctor when filter changes
    setSelectedDoctor('');
    setDoctorName('');
    setDoctorEmail('');
    
    if (specialization === 'all') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.specialization === specialization));
    }
  }

  // Get unique specializations from doctors
  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))].sort();
  
  console.log('Doctors:', doctors);
  console.log('Specializations:', specializations);
  console.log('Filtered Doctors:', filteredDoctors);

  async function add(e) {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ doctorName, doctorEmail, date, time, reason })
    });
    setSelectedDoctor('');
    setDoctorName(''); 
    setDoctorEmail('');
    setDate('');
    setTime('');
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

      {/* Specialization Filter */}
      {doctors.length > 0 && (
        <div style={{ 
          marginBottom: 24, 
          padding: 20,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
          borderRadius: 12,
          border: '2px solid rgba(102, 126, 234, 0.15)'
        }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: '#667eea', 
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            🔍 Filter Doctors by Specialization
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 10 
          }}>
            <button
              type="button"
              onClick={() => handleSpecializationFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: specializationFilter === 'all' ? '2px solid #667eea' : '2px solid rgba(102, 126, 234, 0.3)',
                background: specializationFilter === 'all' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                color: specializationFilter === 'all' ? 'white' : '#667eea',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All Doctors ({doctors.length})
            </button>
            {specializations.length > 0 ? (
              specializations.map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleSpecializationFilter(spec)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: specializationFilter === spec ? '2px solid #667eea' : '2px solid rgba(102, 126, 234, 0.3)',
                    background: specializationFilter === spec 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'white',
                    color: specializationFilter === spec ? 'white' : '#667eea',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (specializationFilter !== spec) {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (specializationFilter !== spec) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  {spec} ({doctors.filter(d => d.specialization === spec).length})
                </button>
              ))
            ) : (
              <p style={{ color: '#999', fontSize: 14, fontStyle: 'italic' }}>
                No specializations available. Doctors need to add their specialization during registration.
              </p>
            )}
          </div>
          {filteredDoctors.length === 0 && specializationFilter !== 'all' && (
            <p style={{ color: '#999', marginTop: 12, fontStyle: 'italic', fontSize: 14 }}>
              No doctors found for this specialization.
            </p>
          )}
        </div>
      )}

      <form onSubmit={add} style={{ maxWidth: 640 }}>
        <div className="form-row">
          <label>Select Doctor <span style={{ color: '#ff6b6b' }}>*</span></label>
          <select 
            value={selectedDoctor}
            onChange={handleDoctorSelect}
            required
          >
            <option value="">-- Choose a doctor --</option>
            {filteredDoctors.map(d => (
              <option key={d._id} value={d.email}>
                Dr. {d.name} {d.specialization ? `- ${d.specialization}` : ''} ({d.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Appointment Date <span style={{ color: '#ff6b6b' }}>*</span></label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label>Appointment Time <span style={{ color: '#ff6b6b' }}>*</span></label>
          <input 
            type="time" 
            value={time} 
            onChange={e => setTime(e.target.value)}
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
                <div style={{ fontSize: 16, color: '#333', marginBottom: 4 }}>
                  � {new Date(a.date).toLocaleDateString('en-US', { 
                    dateStyle: 'full'
                  })}
                </div>
                <div style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
                  🕐 {a.time || 'Time not specified'}
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
