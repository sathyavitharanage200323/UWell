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

// ─── Role Routes ──────────────────────────────────────────────────────────────
const studentAuthRoutes = require('./src/routes/student/authRoutes');
const counselorAuthRoutes = require('./src/routes/counselor/authRoutes');
const welfareAuthRoutes = require('./src/routes/welfare/authRoutes');
const managementRoutes = require('./src/routes/management/managementRoutes');

app.use('/api/auth/student', studentAuthRoutes);
app.use('/api/auth/counselor', counselorAuthRoutes);
app.use('/api/auth/welfare', welfareAuthRoutes);
app.use('/api/auth/management', managementRoutes);

// ─── Manager Workflow Routes ──────────────────────────────────────────────────
// Pending requests, approval, rejection, and dashboard stats
app.use('/api/management', managementRoutes);

// ─── Unified Auth Endpoints ───────────────────────────────────────────────────
app.post('/api/auth/login', (req, res, next) => {
  const role = req.body.role || 'student';
  if (role === 'counselor') {
    return require('./src/controllers/counselor/authController').loginCounselor(req, res, next);
  }
  if (role === 'welfare') {
    return require('./src/controllers/welfare/authController').loginWelfare(req, res, next);
  }
  if (role === 'management') {
    return require('./src/controllers/management/managementController').loginManagement(req, res, next);
  }
  return require('./src/controllers/student/authController').loginStudent(req, res, next);
});

// Student Profile
app.use('/api/student', require('./src/routes/student/studentRoutes'));

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