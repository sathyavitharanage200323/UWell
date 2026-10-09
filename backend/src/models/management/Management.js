const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const managementSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
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
      default: 'IT Services',
    },
    position: {
      type: String,
      default: 'System Administrator',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'management',
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginHistory: [{ _id: false, at: { type: Date, required: true } }],
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

managementSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

managementSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

managementSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

managementSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Management', managementSchema);
