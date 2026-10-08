const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    // ─── Unique Identifier ────────────────────────────────────────────────
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{4,20}$/, 'Student ID must be 4-20 alphanumeric characters'],
    },

    // ─── Personal Information ─────────────────────────────────────────────
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

    // ─── Academic Information ─────────────────────────────────────────────
    faculty: {
      type: String,
      required: [true, 'Faculty is required'],
      enum: [
        'Faculty of Computing',
        'Faculty of Engineering',
        'Faculty of Business',
        'Faculty of Humanities and Sciences',
        'School of Architecture',
        'Faculty of Hospitality & Culinary',
        'Others (postgraduate, MPhil, and PhD)',
      ],
    },
    degreeProgram: {
      type: String,
      required: [true, 'Degree program is required'],
      enum: [
        'Computer Science',
        'Information Technology',
        'Psychology',
        'Business Administration',
        'Law',
        'Medicine',
        'Education',
        'Engineering',
        'Social Work',
        'Other',
      ],
    },
    yearOfStudy: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate', 'PhD'],
    },

    // ─── Contact Information ──────────────────────────────────────────────
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // ─── Security ─────────────────────────────────────────────────────────
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries
    },

    // ─── Role & Status ────────────────────────────────────────────────────
    role: {
      type: String,
      default: 'student',
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ─── Profile ──────────────────────────────────────────────────────────
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },

    // ─── Timestamps ───────────────────────────────────────────────────────
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// ─── Virtual: Full Name ───────────────────────────────────────────────────────
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Pre-save: Hash Password ──────────────────────────────────────────────────
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method: Compare Password ─────────────────────────────────────────────────
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Method: Safe Profile (no password) ──────────────────────────────────────
studentSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Student', studentSchema);
