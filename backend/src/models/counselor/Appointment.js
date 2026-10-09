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
      required: true,
    },
    counselorSpecialization: {
      type: String,
      default: 'Student Counselling',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    sessionType: {
      type: String,
      enum: ['Online', 'In Person', 'Phone'],
      default: 'Online',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema, 'appointments');
