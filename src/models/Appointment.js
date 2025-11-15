const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String },
  patientEmail: { type: String },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "14:30"
  reason: { type: String },
  status: { type: String, default: 'scheduled' },
  prescriptionAdded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
