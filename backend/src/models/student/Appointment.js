const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentName: {
      type: String,
      default: '',
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counselor',
      default: null,
    },
    counselorName: {
      type: String,
      required: [true, 'Counselor name is required'],
      trim: true,
    },
    counselorSpecialization: {
      type: String,
      default: 'Student Counselling',
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    sessionType: {
      type: String,
      enum: ['Online', 'In Person', 'Phone'],
      default: 'Online',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema, 'appointments');
