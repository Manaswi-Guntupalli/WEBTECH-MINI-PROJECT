const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorName, doctorEmail, date, reason } = req.body;
    
    // Get patient info
    const patient = await User.findById(req.user.id);
    
    const appt = new Appointment({ 
      patient: req.user.id, 
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName, 
      doctorEmail,
      date, 
      reason 
    });
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get patient's appointments
router.get('/', auth, async (req, res) => {
  try {
    const appts = await Appointment.find({ patient: req.user.id }).sort({ date: 1 });
    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get appointments for a specific doctor (by email)
router.get('/doctor', auth, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const appts = await Appointment.find({ doctorEmail: doctor.email }).sort({ date: 1 });
    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
