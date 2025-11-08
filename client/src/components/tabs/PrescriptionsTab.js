import React, { useEffect, useState } from 'react';

export default function PrescriptionsTab() {
  const [prescriptions, setPrescriptions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => { 
    fetchList(); 
  }, []);

  async function fetchList() {
    const res = await fetch('http://localhost:5000/api/prescriptions', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const data = await res.json();
    setPrescriptions(data);
  }

  return (
    <div>
      <h3 style={{ color: '#667eea', marginBottom: 20, fontSize: 24 }}>
        💊 Your Prescriptions
      </h3>
      
      {prescriptions.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: 30,
          borderRadius: 16,
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
          <p style={{ fontSize: 18 }}>No prescriptions yet.</p>
          <p>Your doctor will add prescriptions here after your appointments.</p>
        </div>
      ) : (
        prescriptions.map(p => (
          <div key={p._id} style={{
            background: 'linear-gradient(135deg, rgba(132, 250, 176, 0.1) 0%, rgba(143, 211, 244, 0.1) 100%)',
            padding: 20,
            borderRadius: 16,
            marginBottom: 16,
            border: '2px solid rgba(102, 126, 234, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#667eea', marginBottom: 4 }}>
                  👨‍⚕️ Dr. {p.doctorName}
                </div>
                <div style={{ color: '#999', fontSize: 14 }}>
                  📅 {new Date(p.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            {p.notes && (
              <div style={{
                background: 'rgba(102, 126, 234, 0.05)',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                borderLeft: '4px solid #667eea'
              }}>
                <strong style={{ color: '#667eea' }}>📝 Notes:</strong>
                <div style={{ marginTop: 4, color: '#555' }}>{p.notes}</div>
              </div>
            )}
            
            <div style={{ marginTop: 12 }}>
              <strong style={{ color: '#333', fontSize: 16 }}>💊 Medications:</strong>
              <div style={{ marginTop: 8 }}>
                {p.medications.map((m, i) => (
                  <div key={i} style={{
                    background: 'white',
                    padding: 12,
                    borderRadius: 10,
                    marginBottom: 8,
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: 12,
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#333' }}>{m.name}</div>
                    </div>
                    <div style={{ color: '#667eea', fontWeight: 500 }}>
                      💊 {m.dose}
                    </div>
                    <div style={{ color: '#764ba2', fontWeight: 500 }}>
                      🕐 {m.frequency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
