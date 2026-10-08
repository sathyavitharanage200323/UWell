const jwt = require('jsonwebtoken');
const Management = require('../../models/management/Management');
const Counselor = require('../../models/counselor/Counselor');
const Welfare = require('../../models/welfare/Welfare');
const Student = require('../../models/student/Student');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ── Management Register ───────────────────────────────────────────────────────
exports.registerManagement = async (req, res) => {
  try {
    const { firstName, lastName, employeeId, email, department, position, phone, password } = req.body;

    if (!firstName || !lastName || !employeeId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existing = await Management.findOne({
      $or: [
        { employeeId: employeeId.trim().toUpperCase() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Employee ID or email is already registered' });
    }

    const manager = await Management.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      employeeId: employeeId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      department: department || 'IT Services',
      position: position || 'System Administrator',
      phone: phone ? phone.trim() : '',
      password,
      role: 'management',
      isApproved: true,
    });

    const token = signToken(manager._id, 'management');
    res.status(201).json({
      success: true,
      message: 'Management account registered successfully',
      token,
      user: manager.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ registerManagement error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during management registration' });
  }
};

// ── Management Login ──────────────────────────────────────────────────────────
exports.loginManagement = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let manager = await Management.findOne({ email: email.trim().toLowerCase() }).select('+password');

    // Default admin fallback auto-seed for development
    if (!manager && email.trim().toLowerCase() === 'admin@university.edu') {
      manager = await Management.create({
        firstName: 'Admin',
        lastName: 'Manager',
        employeeId: 'ADM001',
        email: 'admin@university.edu',
        department: 'Administration',
        position: 'System Administrator',
        password: password, // will be hashed by pre-save
        role: 'management',
        isApproved: true,
      });
    }

    if (!manager) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    manager.lastLogin = new Date();
    await manager.save({ validateBeforeSave: false });

    const token = signToken(manager._id, 'management');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: manager.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ loginManagement error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ── Get All Pending Registration Requests (Counselor & Welfare) ───────────────
exports.getPendingRequests = async (req, res) => {
  try {
    const [counselors, welfareOfficers] = await Promise.all([
      Counselor.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 }),
      Welfare.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 }),
    ]);

    const formattedCounselors = counselors.map((c) => ({
      id: c._id,
      role: 'counselor',
      roleLabel: 'Counselor (Clinical)',
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: c.fullName,
      staffId: c.staffId,
      email: c.email,
      phone: c.phone,
      officeLocation: c.officeLocation,
      qualification: c.qualification,
      specialization: c.specialization,
      yearsOfExperience: c.yearsOfExperience,
      approvalStatus: c.approvalStatus,
      createdAt: c.createdAt,
    }));

    const formattedWelfare = welfareOfficers.map((w) => ({
      id: w._id,
      role: 'welfare',
      roleLabel: 'Welfare Officer',
      firstName: w.firstName,
      lastName: w.lastName,
      fullName: w.fullName,
      staffId: w.staffId,
      email: w.email,
      phone: w.phone,
      officeLocation: w.officeLocation,
      department: w.department,
      position: w.position,
      approvalStatus: w.approvalStatus,
      createdAt: w.createdAt,
    }));

    const allPending = [...formattedCounselors, ...formattedWelfare].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      totalPending: allPending.length,
      counselorsPending: formattedCounselors.length,
      welfarePending: formattedWelfare.length,
      requests: allPending,
    });
  } catch (error) {
    console.error('❌ getPendingRequests error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pending requests' });
  }
};

// ── Get All Requests (Pending, Approved, Rejected) ────────────────────────────
exports.getAllRequests = async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = {};
    if (status) filter.approvalStatus = status;

    let counselors = [];
    let welfareOfficers = [];

    if (!role || role === 'counselor') {
      counselors = await Counselor.find(filter).sort({ createdAt: -1 });
    }
    if (!role || role === 'welfare') {
      welfareOfficers = await Welfare.find(filter).sort({ createdAt: -1 });
    }

    const formatted = [
      ...counselors.map((c) => ({
        id: c._id,
        role: 'counselor',
        roleLabel: 'Counselor (Clinical)',
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: c.fullName,
        staffId: c.staffId,
        email: c.email,
        phone: c.phone,
        officeLocation: c.officeLocation,
        qualification: c.qualification,
        specialization: c.specialization,
        yearsOfExperience: c.yearsOfExperience,
        approvalStatus: c.approvalStatus,
        isApproved: c.isApproved,
        approvedAt: c.approvedAt,
        rejectionReason: c.rejectionReason,
        createdAt: c.createdAt,
      })),
      ...welfareOfficers.map((w) => ({
        id: w._id,
        role: 'welfare',
        roleLabel: 'Welfare Officer',
        firstName: w.firstName,
        lastName: w.lastName,
        fullName: w.fullName,
        staffId: w.staffId,
        email: w.email,
        phone: w.phone,
        officeLocation: w.officeLocation,
        department: w.department,
        position: w.position,
        approvalStatus: w.approvalStatus,
        isApproved: w.isApproved,
        approvedAt: w.approvedAt,
        rejectionReason: w.rejectionReason,
        createdAt: w.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: formatted.length,
      requests: formatted,
    });
  } catch (error) {
    console.error('❌ getAllRequests error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching requests' });
  }
};

// ── Approve Request ───────────────────────────────────────────────────────────
exports.approveRequest = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'userId and role are required' });
    }

    const Model = role === 'counselor' ? Counselor : Welfare;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: `${role} account not found` });
    }

    user.approvalStatus = 'approved';
    user.isApproved = true;
    user.approvedAt = new Date();
    user.approvedBy = req.user?.id || 'Admin';
    user.rejectionReason = '';

    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.fullName} (${role}) has been approved successfully. They can now log in.`,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ approveRequest error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error approving request' });
  }
};

// ── Reject Request ────────────────────────────────────────────────────────────
exports.rejectRequest = async (req, res) => {
  try {
    const { userId, role, reason } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'userId and role are required' });
    }

    const Model = role === 'counselor' ? Counselor : Welfare;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: `${role} account not found` });
    }

    user.approvalStatus = 'rejected';
    user.isApproved = false;
    user.rejectionReason = reason || 'Registration rejected by administrator.';

    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.fullName} (${role}) registration request has been rejected.`,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ rejectRequest error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error rejecting request' });
  }
};

// ── Dashboard Overview Stats ──────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      pendingCounselors,
      pendingWelfare,
      approvedCounselors,
      approvedWelfare,
      totalStudents,
    ] = await Promise.all([
      Counselor.countDocuments({ approvalStatus: 'pending' }),
      Welfare.countDocuments({ approvalStatus: 'pending' }),
      Counselor.countDocuments({ approvalStatus: 'approved' }),
      Welfare.countDocuments({ approvalStatus: 'approved' }),
      Student.countDocuments({ isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPendingRequests: pendingCounselors + pendingWelfare,
        pendingCounselors,
        pendingWelfare,
        activeStudents: totalStudents,
        totalCounselors: approvedCounselors,
        totalWelfareOfficers: approvedWelfare,
        totalUsers: totalStudents + approvedCounselors + approvedWelfare,
      },
    });
  } catch (error) {
    console.error('❌ getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard stats' });
  }
};

// ── Management Profile & Logout ───────────────────────────────────────────────
exports.getManagementProfile = async (req, res) => {
  try {
    const { id, email } = req.query;
    let query = {};
    if (id) {
      query._id = id;
    } else if (email) {
      query.email = email.trim().toLowerCase();
    } else if (req.user?.id) {
      query._id = req.user.id;
    } else {
      query.email = 'admin@university.edu';
    }

    let manager = await Management.findOne(query);
    if (!manager) {
      manager = await Management.findOne({ email: 'admin@university.edu' });
    }

    if (!manager) {
      manager = await Management.create({
        firstName: 'Admin',
        lastName: 'Manager',
        employeeId: 'ADM001',
        email: email?.trim().toLowerCase() || 'admin@university.edu',
        department: 'Administration',
        position: 'System Administrator',
        password: 'password123',
        role: 'management',
        isApproved: true,
      });
    }

    res.status(200).json({
      success: true,
      profile: manager.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ getManagementProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

exports.updateManagementProfile = async (req, res) => {
  try {
    const { id, email, firstName, lastName, phone, department, position } = req.body;
    let query = {};
    if (id) query._id = id;
    else if (email) query.email = email.trim().toLowerCase();
    else if (req.user?.id) query._id = req.user.id;
    else query.email = 'admin@university.edu';

    let manager = await Management.findOne(query);
    if (!manager) {
      manager = await Management.findOne({ email: 'admin@university.edu' });
    }

    if (!manager) {
      manager = await Management.create({
        firstName: firstName ? firstName.trim() : 'Admin',
        lastName: lastName ? lastName.trim() : 'Manager',
        employeeId: 'ADM001',
        email: email?.trim().toLowerCase() || 'admin@university.edu',
        department: department ? department.trim() : 'Administration',
        position: position ? position.trim() : 'System Administrator',
        phone: phone ? phone.trim() : '',
        password: 'password123',
        role: 'management',
        isApproved: true,
      });
    }

    if (firstName) manager.firstName = firstName.trim();
    if (lastName) manager.lastName = lastName.trim();
    if (phone !== undefined) manager.phone = phone.trim();
    if (department) manager.department = department.trim();
    if (position) manager.position = position.trim();

    await manager.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: manager.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ updateManagementProfile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating profile' });
  }
};

exports.logoutManagement = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
