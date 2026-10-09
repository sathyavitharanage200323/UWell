const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
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
      enum: ['Online', 'In Person'],
      default: 'Online',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
