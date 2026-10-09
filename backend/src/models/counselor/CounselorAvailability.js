const mongoose = require('mongoose');

const counselorAvailabilitySchema = new mongoose.Schema(
  {
    _id: { type: String },
    counselorId: { type: String, default: 'c1' },
    day: { type: String, default: '' },
    active: { type: Boolean, default: true },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '05:00 PM' },
    slots: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;   // expose string _id as `id` for consistency
        return ret;
      },
    },
  }
);

counselorAvailabilitySchema.index({ counselorId: 1, day: 1 });

module.exports = mongoose.model('CounselorAvailability', counselorAvailabilitySchema, 'counselor_availability');
