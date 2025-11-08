const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String },
  patientEmail: { type: String },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String },
  date: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
