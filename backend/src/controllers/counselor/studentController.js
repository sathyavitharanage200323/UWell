const CounselorStudent = require('../../models/counselor/CounselorStudent');

// GET /api/counselor/students
exports.getStudents = async (req, res) => {
  try {
    const students = await CounselorStudent.find().sort({ createdAt: 1 });
    return res.status(200).json(students);
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
    return res.status(200).json(student);
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
