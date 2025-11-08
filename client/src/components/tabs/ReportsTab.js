import React, { useEffect, useState } from 'react';

export default function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchReports(); }, []);

  async function fetchReports() {
    const res = await fetch('http://localhost:5000/api/reports', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const data = await res.json();
    setReports(data);
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('report', file);
    await fetch('http://localhost:5000/api/reports', { 
      method: 'POST', 
      headers: { Authorization: `Bearer ${token}` }, 
      body: fd 
    });
    setFile(null);
    setUploading(false);
    fetchReports();
  }

  return (
    <div>
      <h3 style={{ color: '#667eea', marginBottom: 20, fontSize: 24 }}>
        📤 Upload Medical Report
      </h3>
      <form onSubmit={upload} style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        padding: 24,
        borderRadius: 16,
        border: '2px dashed rgba(102, 126, 234, 0.3)',
        marginBottom: 30
      }}>
        <div className="form-row">
          <label style={{ fontSize: 16, fontWeight: 600 }}>Select File (PDF, Image, Document)</label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files[0])}
            style={{ 
              padding: 16,
              background: 'white',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{ width: '100%', marginTop: 12 }}
        >
          {uploading ? '⏳ Uploading...' : '📤 Upload Report'}
        </button>
      </form>

      <h3 style={{ color: '#667eea', fontSize: 24, marginBottom: 16 }}>
        📁 Your Medical Reports ({reports.length})
      </h3>
      {reports.length === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: 30,
          borderRadius: 16,
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ fontSize: 18 }}>No reports uploaded yet.</p>
          <p>Upload your medical reports, lab results, or prescriptions above.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {reports.map(r => (
            <div key={r._id} style={{
              background: 'white',
              padding: 20,
              borderRadius: 12,
              border: '2px solid rgba(102, 126, 234, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                  📄 {r.originalname}
                </div>
                <div style={{ color: '#999', fontSize: 14 }}>
                  📅 Uploaded: {new Date(r.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <a 
                href={`http://localhost:5000/uploads/${r.filename}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <button type="button" style={{ padding: '10px 24px' }}>
                  👁️ View
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
