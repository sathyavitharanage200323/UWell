const mongoose = require('mongoose');

const videoSessionSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, default: '' },
    sessionId: { type: String, unique: true },
    status: { type: String, default: 'active' },
    joinUrl: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
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

module.exports = mongoose.model('VideoSession', videoSessionSchema, 'video_sessions');
