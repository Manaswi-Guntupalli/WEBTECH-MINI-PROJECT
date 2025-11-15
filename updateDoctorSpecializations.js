const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

async function updateDoctors() {
  try {
    // Get all doctors without specialization
    const doctors = await User.find({ role: 'doctor' });
    
    console.log(`Found ${doctors.length} doctors in the database`);
    
    if (doctors.length === 0) {
      console.log('No doctors found in the database.');
      process.exit(0);
    }
    
    // Sample specializations to assign
    const specializations = [
      'General Physician',
      'Cardiologist',
      'Dermatologist',
      'Pediatrician',
      'Orthopedic',
      'Neurologist',
      'Gynecologist',
      'Psychiatrist'
    ];
    
    // Update each doctor with a specialization
    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      
      // If doctor doesn't have specialization, assign one
      if (!doctor.specialization) {
        const randomSpec = specializations[i % specializations.length];
        doctor.specialization = randomSpec;
        await doctor.save();
        console.log(`Updated Dr. ${doctor.name} with specialization: ${randomSpec}`);
      } else {
        console.log(`Dr. ${doctor.name} already has specialization: ${doctor.specialization}`);
      }
    }
    
    console.log('\n✅ All doctors updated successfully!');
    console.log('You can now see the filter buttons in the patient dashboard.');
    process.exit(0);
    
  } catch (error) {
    console.error('Error updating doctors:', error);
    process.exit(1);
  }
}

// Run the update
updateDoctors();
