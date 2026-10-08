const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger Middleware ───────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get(['/', '/api/health'], (req, res) => {
  res.json({
    status: 'OK',
    message: 'UWell Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Student Routes ───────────────────────────────────────────────────────────
const authRoutes = require('./src/routes/student/authRoutes');
app.use('/api/auth/student', authRoutes);
app.use('/api/auth', authRoutes);

// Profile: GET/PUT /api/student/profile  |  PUT /api/student/change-password
app.use('/api/student', require('./src/routes/student/studentRoutes'));

// Mood: CRUD /api/student/mood
app.use('/api/student/mood', require('./src/routes/student/moodRoutes'));

// Appointments: CRUD /api/student/appointments
app.use('/api/student/appointments', require('./src/routes/student/appointmentRoutes'));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── 404 Catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const ALT_PORT = parseInt(process.env.ALT_PORT, 10) || 8082;

// Listen on primary port (0.0.0.0 for IPv4 network access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ UWell Backend running on http://0.0.0.0:${PORT}`);
  console.log(`   Auth  → POST /api/auth/student/register`);
  console.log(`          POST /api/auth/student/login`);
  console.log(`   Student → GET/PUT /api/student/profile`);
  console.log(`             GET     /api/student/:studentId`);
});

// Listen on ALT_PORT (8082 is open in Windows Firewall 8081-8112 rule for mobile devices)
if (ALT_PORT && ALT_PORT !== PORT) {
  app.listen(ALT_PORT, '0.0.0.0', () => {
    console.log(`✅ UWell Backend also listening on http://0.0.0.0:${ALT_PORT} (Firewall-friendly port)`);
  });
}