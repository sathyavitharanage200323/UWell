const jwt = require('jsonwebtoken');
const Counselor = require('../../models/counselor/Counselor');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.registerCounselor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      staffId,
      email,
      qualification,
      specialization,
      yearsOfExperience,
      phone,
      officeLocation,
      password,
    } = req.body;

    // Check required fields
    if (!firstName || !lastName || !staffId || !email || !qualification || !specialization || !yearsOfExperience || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check duplicate
    const existing = await Counselor.findOne({
      $or: [
        { staffId: staffId.trim().toUpperCase() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existing) {
      const field = existing.staffId === staffId.trim().toUpperCase() ? 'staffId' : 'email';
      return res.status(409).json({
        success: false,
        message: `${field === 'staffId' ? 'Staff ID' : 'Email'} is already registered`,
        field,
      });
    }

    // Create counselor with pending approval
    const counselor = await Counselor.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      staffId: staffId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      qualification,
      specialization,
      yearsOfExperience,
      phone: phone.trim(),
      officeLocation: officeLocation ? officeLocation.trim() : '',
      password,
      role: 'counselor',
      approvalStatus: 'pending',
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      isPendingApproval: true,
      message: 'Counselor registration submitted successfully. Your account is pending manager approval.',
      user: counselor.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ registerCounselor error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

exports.loginCounselor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email/Staff ID and password are required' });
    }

    const rawInput = (email || '').trim();
    const emailLower = rawInput.toLowerCase();
    const idUpper = rawInput.toUpperCase();

    // Support login by email OR staffId
    const counselor = await Counselor.findOne({
      $or: [
        { email: emailLower },
        { staffId: idUpper },
      ],
    }).select('+password');

    if (!counselor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email or Staff ID.' });
    }

    // Check Manager Approval first: account cannot log in until manager approves
    if (counselor.approvalStatus === 'pending' || !counselor.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your account is pending manager approval. Please wait for an administrator to review and approve your registration.',
      });
    }

    if (counselor.approvalStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: `Your registration was rejected by management.${counselor.rejectionReason ? ' Reason: ' + counselor.rejectionReason : ''}`,
      });
    }

    const isMatch = await counselor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    counselor.lastLogin = new Date();
    await counselor.save({ validateBeforeSave: false });

    const token = signToken(counselor._id, 'counselor');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: counselor.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ loginCounselor error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
