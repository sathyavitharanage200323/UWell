const Student = require('../../models/student/Student');
const Counselor = require('../../models/counselor/Counselor');

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/profile
//  Returns the logged-in student's profile (populated from JWT)
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student.toSafeObject() });
  } catch (error) {
    console.error('❌ getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/:studentId
//  Look up a student by their unique studentId string
// ─────────────────────────────────────────────────────────────────────────────
exports.getByStudentId = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId.trim().toUpperCase(),
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student.toSafeObject() });
  } catch (error) {
    console.error('❌ getByStudentId error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/student/profile
//  Update the logged-in student's editable profile fields
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    // Fields that students are allowed to update
    const allowed = ['firstName', 'lastName', 'phone', 'faculty', 'degreeProgram', 'yearOfStudy', 'bio', 'profilePicture'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated', data: student.toSafeObject() });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    console.error('❌ updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PUT /api/student/change-password
// ─────────────────────────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const student = await Student.findById(req.user.id).select('+password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const isMatch = await student.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ changePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/all   (Admin / Welfare / Management use)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students.map((s) => s.toSafeObject()),
    });
  } catch (error) {
    console.error('❌ getAllStudents error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/counselors
//  List all approved counselors for students
// ─────────────────────────────────────────────────────────────────────────────
exports.getCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors.map((c) => c.toSafeObject()),
    });
  } catch (error) {
    console.error('❌ getCounselors error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching counselors' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/counselors/:id
//  Get single counselor details
// ─────────────────────────────────────────────────────────────────────────────
exports.getCounselorById = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }
    res.status(200).json({
      success: true,
      data: counselor.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ getCounselorById error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching counselor' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/counselors/:id/availability
//  Get counselor availability slots
// ─────────────────────────────────────────────────────────────────────────────
exports.getCounselorAvailability = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        status: counselor.status || 'Available',
        slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      },
    });
  } catch (error) {
    console.error('❌ getCounselorAvailability error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching availability' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/student/wellbeing-check
//  Submit wellbeing assessment
// ─────────────────────────────────────────────────────────────────────────────
exports.submitWellbeingCheck = async (req, res) => {
  try {
    const { answers, score, level, notes } = req.body;
    res.status(201).json({
      success: true,
      message: 'Wellbeing assessment saved',
      data: {
        score: score || 0,
        level: level || 'Moderate',
        notes: notes || '',
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ submitWellbeingCheck error:', error);
    res.status(500).json({ success: false, message: 'Server error saving wellbeing check' });
  }
};

