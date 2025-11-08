const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const appointmentRoutes = require('./src/routes/appointments');
const prescriptionRoutes = require('./src/routes/prescriptions');
const reportRoutes = require('./src/routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
