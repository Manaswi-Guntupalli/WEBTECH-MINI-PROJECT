# Healthcare MERN (Patient Dashboard)

This is a minimal MERN (MongoDB, Express, React, Node) application scaffold for a patient-facing healthcare portal. It includes:

- User register/login with JWT
- Patient dashboard with tabs for Appointments, Prescriptions, and Reports
- Appointment scheduling (stored in MongoDB)
- Prescription creation/listing (stored in MongoDB)
- Report file upload and listing (files stored in `uploads/`)

Requirements
- Node.js and npm
- A running MongoDB instance (Atlas or local)

Setup (PowerShell)

1. Copy `.env.example` to `.env` and fill in values:

   $env:MONGODB_URI = "your_mongo_uri"; $env:JWT_SECRET = "secret"; $env:PORT = "5000"

2. Install root dependencies and client dependencies:

   npm install
   cd client; npm install

3. Run in dev (starts backend and frontend concurrently):

   cd ..; npm run dev

Server runs on http://localhost:5000 and client on http://localhost:3000 by default.

Notes
- This is a starter project. For production, add validations, rate-limiting, HTTPS, file scanning, pagination, and stricter CORS.
