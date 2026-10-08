const jwt = require('jsonwebtoken');
const Welfare = require('../../models/welfare/Welfare');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.registerWelfare = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      staffId,
      department,
      position,
      email,
      phone,
      officeLocation,
      password,
    } = req.body;

    if (!firstName || !lastName || !staffId || !department || !position || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existing = await Welfare.findOne({
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

    const welfare = await Welfare.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      staffId: staffId.trim().toUpperCase(),
      department,
      position,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      officeLocation: officeLocation ? officeLocation.trim() : '',
      password,
      role: 'welfare',
      approvalStatus: 'pending',
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      isPendingApproval: true,
      message: 'Welfare officer registration submitted successfully. Your account is pending manager approval.',
      user: welfare.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ registerWelfare error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

exports.loginWelfare = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const welfare = await Welfare.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!welfare) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check Manager Approval first: account cannot log in until manager approves
    if (welfare.approvalStatus === 'pending' || !welfare.isApproved) {
      return res.status(403).json({
        success: false,
        isPendingApproval: true,
        message: 'Your account is pending manager approval. Please wait for an administrator to review and approve your registration.',
      });
    }

    if (welfare.approvalStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: `Your registration was rejected by management.${welfare.rejectionReason ? ' Reason: ' + welfare.rejectionReason : ''}`,
      });
    }

    const isMatch = await welfare.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    welfare.lastLogin = new Date();
    await welfare.save({ validateBeforeSave: false });

    const token = signToken(welfare._id, 'welfare');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: welfare.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ loginWelfare error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
