const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Add prescription from appointment (doctors only)
router.post('/from-appointment/:appointmentId', auth, async (req, res) => {
  try {
    const { medications, notes } = req.body;
    const { appointmentId } = req.params;
    
    // Get appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Check if prescription already added
    if (appointment.prescriptionAdded) {
      return res.status(400).json({ message: 'Prescription already added for this appointment' });
    }
    
    // Get doctor info
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can add prescriptions' });
    }
    
    // Create prescription
    const prescription = new Prescription({ 
      patient: appointment.patient,
      doctorName: doctor.name,
      appointment: appointmentId,
      medications,
      notes 
    });
    await prescription.save();
    
    // Mark appointment as prescription added
    appointment.prescriptionAdded = true;
    appointment.status = 'completed';
    await appointment.save();
    
    res.json({ prescription, appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

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

// Get all patients who have appointments with the logged-in doctor
router.get('/patients', auth, async (req, res) => {
  try {
    // Get the logged-in doctor's email
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can access this' });
    }

    // Find all appointments for this doctor
    const appointments = await Appointment.find({ doctorEmail: doctor.email }).populate('patient');
    
    // Extract unique patients from appointments
    const patientMap = new Map();
    appointments.forEach(appointment => {
      if (appointment.patient && !patientMap.has(appointment.patient._id.toString())) {
        patientMap.set(appointment.patient._id.toString(), {
          _id: appointment.patient._id,
          name: appointment.patient.name,
          email: appointment.patient.email
        });
      }
    });

    const patients = Array.from(patientMap.values());
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all doctors (for patient appointments)
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
