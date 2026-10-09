const mongoose = require('mongoose');

const counselorMessageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    studentId: { type: String, default: '' },
    counselorId: { type: String, default: 'c1' },
    studentName: { type: String, default: '' },
    avatarInitials: { type: String, default: '' },
    lastMessage: { type: String, default: '' },
    timestamp: { type: String, default: '' },
    unread: { type: Boolean, default: false },
    chatHistory: { type: Array, default: [] },
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

counselorMessageSchema.index({ counselorId: 1, studentId: 1 });

module.exports = mongoose.model('CounselorMessage', counselorMessageSchema, 'counselor_messages');
