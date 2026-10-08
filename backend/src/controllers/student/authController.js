const jwt = require('jsonwebtoken');
const Student = require('../../models/student/Student');

// ─── Helper: Sign JWT ─────────────────────────────────────────────────────────
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── Helper: Send Token Response ─────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id, user.role);
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      studentId: user.studentId,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      faculty: user.faculty,
      degreeProgram: user.degreeProgram,
      yearOfStudy: user.yearOfStudy,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/student/register
// ─────────────────────────────────────────────────────────────────────────────
exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      studentId,
      faculty,
      degreeProgram,
      yearOfStudy,
      email,
      phone,
      password,
    } = req.body;

    // ── Required-field guard ──────────────────────────────────────────────
    const required = { firstName, lastName, studentId, faculty, degreeProgram, yearOfStudy, email, password };
    const missing = Object.entries(required)
      .filter(([, v]) => !v || String(v).trim() === '')
      .map(([k]) => k);

    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        fields: missing,
      });
    }

    // ── Duplicate check (studentId OR email) ──────────────────────────────
    const existing = await Student.findOne({
      $or: [
        { studentId: studentId.trim().toUpperCase() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existing) {
      const field = existing.studentId === studentId.trim().toUpperCase() ? 'studentId' : 'email';
      return res.status(409).json({
        success: false,
        message:
          field === 'studentId'
            ? `Student ID "${studentId}" is already registered`
            : `Email "${email}" is already registered`,
        field,
      });
    }

    // ── Create student ────────────────────────────────────────────────────
    const student = await Student.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: studentId.trim().toUpperCase(),
      faculty,
      degreeProgram,
      yearOfStudy,
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password,
      role: 'student',
    });

    sendTokenResponse(student, 201, res, 'Student registered successfully');
  } catch (error) {
    // Mongoose duplicate-key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field === 'studentId' ? 'Student ID' : 'Email'} already exists`,
        field,
      });
    }

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    console.error('❌ registerStudent error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/student/login
// ─────────────────────────────────────────────────────────────────────────────
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Fetch student WITH password field
    const student = await Student.findOne({ email: email.trim().toLowerCase() }).select('+password');

    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!student.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update lastLogin
    student.lastLogin = new Date();
    await student.save({ validateBeforeSave: false });

    sendTokenResponse(student, 200, res, 'Login successful');
  } catch (error) {
    console.error('❌ loginStudent error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
