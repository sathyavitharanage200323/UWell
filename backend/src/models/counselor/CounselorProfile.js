const mongoose = require('mongoose');

const counselorProfileSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    role: { type: String, default: 'CLINICAL STAFF' },
    rating: { type: Number, default: 0 },
    sessionsReviewed: { type: Number, default: 0 },
    qualification: { type: String, default: '' },
    specialization: { type: String, default: '' },
    clinicalFocus: { type: [String], default: [] },
    officeLocation: { type: String, default: '' },
    email: { type: String, default: '' },
    avatarInitials: { type: String, default: 'EM' },
    bio: { type: String, default: '' },
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

module.exports = mongoose.model('CounselorProfile', counselorProfileSchema, 'counselor_profiles');
