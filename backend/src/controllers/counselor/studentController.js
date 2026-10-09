const CounselorStudent = require('../../models/counselor/CounselorStudent');
const Student = require('../../models/student/Student');

const normaliseEmail = (email) => (email || '').trim().toLowerCase();

// Resolve each counselor student's real mobile number from the Student
// collection by matching email. Never fabricates a number: unmatched
// students receive an empty string so the UI can disable calling.
const withPhoneNumber = async (counselorStudents) => {
  const emails = [
    ...new Set(counselorStudents.map((s) => normaliseEmail(s.email)).filter(Boolean)),
  ];
  const phoneByEmail = {};

  if (emails.length) {
    const students = await Student.find({ email: { $in: emails } }).select('email phone');
    students.forEach((s) => {
      phoneByEmail[normaliseEmail(s.email)] = s.phone || '';
    });
  }

  return counselorStudents.map((s) => ({
    ...s.toJSON(),
    phone: phoneByEmail[normaliseEmail(s.email)] || '',
  }));
};

// GET /api/counselor/students
exports.getStudents = async (req, res) => {
  try {
    const students = await CounselorStudent.find().sort({ createdAt: 1 });
    const payload = await withPhoneNumber(students);
    return res.status(200).json(payload);
  } catch (error) {
    console.error('❌ counselor getStudents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// GET /api/counselor/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await CounselorStudent.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const [payload] = await withPhoneNumber([student]);
    return res.status(200).json(payload);
  } catch (error) {
    console.error('❌ counselor getStudentById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch student' });
  }
};

// POST /api/counselor/students/:id/notes
exports.saveSessionNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const student = await CounselorStudent.findByIdAndUpdate(
      req.params.id,
      { $set: { sessionNotesHistory: notes || '' } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error('❌ counselor saveSessionNotes error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save notes' });
  }
};
