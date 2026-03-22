# VitalLink Healthcare Portal - Run Commands

## 🚀 Minimal Commands to Run the Application

### Prerequisites
Make sure MongoDB is installed and running on your system.

### Single Command to Run Everything

```bash
npx kill-port 5000 3000; npm run dev
```

This command will:
1. Kill any processes running on ports 5000 and 3000
2. Start the backend server (Express.js) on port 5000
3. Start the frontend server (React) on port 3000
4. Connect to MongoDB on localhost:27017

---

## 📋 Alternative Commands (If needed)

### If ports are already free
```bash
npm run dev
```

### If you need to kill ports separately
```bash
npx kill-port 5000 3000
```

### To run backend only
```bash
npm run server
```

### To run frontend only
```bash
npm run client
```

---

## ✅ Success Indicators

After running the command, you should see:
- `[0] Server running on port 5000`
- `[0] MongoDB Connected: localhost`
- `[1] Compiled successfully!`
- `[1] Local: http://localhost:3000`

---

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017/healthcare

---

## 🛑 To Stop the Application

Press `Ctrl + C` in the terminal

---

## 📝 Notes

- The application uses `concurrently` to run both servers simultaneously
- MongoDB must be running before starting the application
- Default MongoDB connection: `mongodb://localhost:27017/healthcare`
- JWT tokens expire after 12 hours
