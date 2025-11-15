const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorName, doctorEmail, date, time, reason } = req.body;
    
    // Get patient info
    const patient = await User.findById(req.user.id);
    
    const appt = new Appointment({ 
      patient: req.user.id, 
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName, 
      doctorEmail,
      date,
      time,
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
    
    // Add status based on current time
    const now = new Date();
    const appointmentsWithStatus = appts.map(appt => {
      const apptObj = appt.toObject();
      
      // Combine date and time to check if appointment time has passed
      const appointmentDate = new Date(appt.date);
      if (appt.time) {
        const [hours, minutes] = appt.time.split(':');
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0);
      }
      
      // Determine status
      if (appt.prescriptionAdded) {
        apptObj.timeStatus = 'completed';
      } else if (appointmentDate <= now) {
        apptObj.timeStatus = 'active'; // Time has passed, can add prescription
      } else {
        apptObj.timeStatus = 'future'; // Future appointment, locked
      }
      
      return apptObj;
    });
    
    res.json(appointmentsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
