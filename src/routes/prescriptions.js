const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// Add prescription (doctors add for patients)
router.post('/', auth, async (req, res) => {
  try {
    const { patientEmail, medications, notes } = req.body;
    
    // Get doctor info
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    // Find patient by email
    let patientId = req.user.id; // Default to self
    if (patientEmail) {
      const patient = await User.findOne({ email: patientEmail });
      if (patient) patientId = patient.id;
    }
    
    const p = new Prescription({ 
      patient: patientId, 
      doctorName: doctor.name, 
      medications, 
      notes 
    });
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get patient's prescriptions
router.get('/', auth, async (req, res) => {
  try {
    const list = await Prescription.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all patients (for doctors)
router.get('/patients', auth, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('name email');
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all doctors (for patient appointments)
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
