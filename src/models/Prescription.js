const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }, // Link to appointment
  medications: [{ name: String, dose: String, frequency: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
