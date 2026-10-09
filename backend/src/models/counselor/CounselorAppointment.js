const mongoose = require('mongoose');

const counselorAppointmentSchema = new mongoose.Schema(
  {
    _id:           { type: String },
    studentId:     { type: String, default: '' },
    counselorId:   { type: String, default: '' },
    counselorName: { type: String, default: '' },
    studentName:   { type: String, default: '' },
    studentCourse: { type: String, default: '' },
    sessionType:   { type: String, default: '' },
    date:          { type: String, default: '' },
    time:          { type: String, default: '' },
    location:      { type: String, default: '' },
    status:        { type: String, default: 'Pending' },
    notes:         { type: String, default: '' },
    avatarInitials:{ type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Expose string _id as both `id` and `_id` so counselor screens
        // can use either field without breaking.
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('CounselorAppointment', counselorAppointmentSchema, 'counselor_appointments');
