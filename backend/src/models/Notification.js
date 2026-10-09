const mongoose = require('mongoose');

/**
 * Notification model – stores push/in-app notifications for students,
 * counselors, and welfare officers.
 *
 * recipientType: 'student' | 'counselor' | 'welfare'
 * recipientId  : ObjectId reference to the relevant user document
 */
const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipientType: {
      type: String,
      enum: ['student', 'counselor', 'welfare'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['appointment_updated', 'appointment_cancelled', 'appointment_deleted', 'appointment_rescheduled', 'general'],
      default: 'general',
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
