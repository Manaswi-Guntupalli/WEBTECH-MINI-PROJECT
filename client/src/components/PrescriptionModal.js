import React, { useState } from 'react';

export default function PrescriptionModal({ appointment, onClose, onSubmit }) {
  const [medications, setMedications] = useState([{ name: '', dose: '', frequency: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dose: '', frequency: '' }]);
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const removeMedication = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({ medications, notes });
      onClose();
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to add prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Prescription</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="prescription-patient-info">
            <p><strong>Patient:</strong> {appointment.patientName}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="medications-section">
              <h3>Medications</h3>
              {medications.map((med, index) => (
                <div key={index} className="medication-row">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dose}
                    onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    required
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeMedication(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-add-med" onClick={addMedication}>
                + Add Another Medication
              </button>
            </div>

            <div className="form-row">
              <label>Additional Notes</label>
              <textarea
                rows="4"
                placeholder="Any additional instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Prescription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
