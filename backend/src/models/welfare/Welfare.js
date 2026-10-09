const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const welfareSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: [true, 'Staff ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{4,20}$/, 'Staff ID must be 4-20 alphanumeric characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Work email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    officeLocation: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: 'Dedicated to supporting university student wellbeing, mental health initiatives, and student advocacy.',
    },
    specializations: {
      type: [String],
      default: ['Student Wellbeing', 'Financial Aid Guidance', 'Housing Support', 'Crisis Intervention'],
    },
    officeHours: {
      type: String,
      trim: true,
      default: 'Monday – Friday, 8:30 AM – 4:30 PM',
    },
    qualifications: {
      type: String,
      trim: true,
      default: 'BSc in Social Work / Student Counseling',
    },
    yearsOfExperience: {
      type: String,
      trim: true,
      default: '3+ Years',
    },
    languages: {
      type: [String],
      default: ['English', 'Sinhala'],
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    workingSchedule: {
      type: String,
      trim: true,
      default: 'Full-time On Campus',
    },
    availabilityStatus: {
      type: String,
      trim: true,
      default: 'Available Today',
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    consultationMode: {
      type: String,
      trim: true,
      default: 'In-Person & Online',
    },
    emergencyAvailable: {
      type: Boolean,
      default: true,
    },
    availabilityNote: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'welfare',
      immutable: true,
    },
    // ── Approval System (Manager Approval Required) ──────────────────────
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

welfareSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

welfareSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

welfareSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

welfareSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Welfare', welfareSchema);
