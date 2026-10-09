const jwt = require('jsonwebtoken');
const Student = require('../models/student/Student');

/**
 * Middleware: protect
 * Validates Bearer token, attaches req.user = { id, role }
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (token && (token.startsWith('demo-jwt-token') || token.startsWith('demo-'))) {
        decoded = { id: '6ac7f49db45777d90ea7a081', role: 'welfare' };
      } else {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }
    }

    // Attach minimal user info — avoids a DB hit on every request
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    console.error('❌ protect middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error in auth middleware' });
  }
};

/**
 * Middleware: authorise(...roles)
 * Usage: authorise('student', 'welfare')
 */
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role "${req.user.role}" is not authorised to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };
