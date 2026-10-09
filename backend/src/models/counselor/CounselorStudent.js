const mongoose = require('mongoose');

const counselorStudentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, default: '' },
    yearCourse: { type: String, default: '' },
    sessionsCompleted: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    avatarInitials: { type: String, default: '' },
    email: { type: String, default: '' },
    moodHistory: { type: Array, default: [] },
    diagnosisNotes: { type: String, default: '' },
    sessionNotesHistory: { type: String, default: '' },
    counselorId: { type: String, default: 'c1' },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('CounselorStudent', counselorStudentSchema, 'counselor_students');
