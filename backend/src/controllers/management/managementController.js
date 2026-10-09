const jwt = require('jsonwebtoken');
const Management = require('../../models/management/Management');
const Counselor = require('../../models/counselor/Counselor');
const Welfare = require('../../models/welfare/Welfare');
const Student = require('../../models/student/Student');
const Appointment = require('../../models/management/AppointmentRecord');
const UsageReport = require('../../models/management/UsageReport');
const ServiceNote = require('../../models/management/ServiceNote');

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
      return res.status(400).json({ success: false, message: 'Email/Employee ID and password are required' });
    }

    const rawInput = email.trim();
    const emailLower = rawInput.toLowerCase();
    const idUpper = rawInput.toUpperCase();

    // Look up by email OR employeeId (ADM001, MGR001, EMP1010, MGR100, etc.)
    let manager = await Management.findOne({
      $or: [
        { email: emailLower },
        { employeeId: idUpper },
      ],
    }).select('+password');

    if (!manager) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email or employee ID and password.' });
    }

    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email or employee ID and password.' });
    }

    manager.lastLogin = new Date();
    manager.loginHistory = [...(manager.loginHistory || []), { at: manager.lastLogin }].slice(-5);
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
    const targetId = req.body.userId || req.body.id || req.body._id;
    const rawRole = (req.body.role || '').toLowerCase().trim();

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const isCounselor = rawRole.includes('counselor');
    let Model = isCounselor ? Counselor : Welfare;
    let actualRole = isCounselor ? 'counselor' : 'welfare';

    let user = await Model.findById(targetId);
    if (!user) {
      // Fallback: search the other collection in case role was omitted or mismatched
      const AltModel = isCounselor ? Welfare : Counselor;
      const altUser = await AltModel.findById(targetId);
      if (altUser) {
        Model = AltModel;
        user = altUser;
        actualRole = isCounselor ? 'welfare' : 'counselor';
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      user._id,
      {
        $set: {
          approvalStatus: 'approved',
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: req.user.id,
          rejectionReason: '',
        },
      },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      message: `${updatedUser.fullName || updatedUser.firstName} (${actualRole}) has been approved successfully. They can now log in.`,
      user: updatedUser.toSafeObject ? updatedUser.toSafeObject() : updatedUser,
    });
  } catch (error) {
    console.error('❌ approveRequest error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error approving request' });
  }
};

// ── Reject Request ────────────────────────────────────────────────────────────
exports.rejectRequest = async (req, res) => {
  try {
    const targetId = req.body.userId || req.body.id || req.body._id;
    const rawRole = (req.body.role || '').toLowerCase().trim();
    const reason = req.body.reason || 'Registration rejected by administrator.';

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const isCounselor = rawRole.includes('counselor');
    let Model = isCounselor ? Counselor : Welfare;
    let actualRole = isCounselor ? 'counselor' : 'welfare';

    let user = await Model.findById(targetId);
    if (!user) {
      const AltModel = isCounselor ? Welfare : Counselor;
      const altUser = await AltModel.findById(targetId);
      if (altUser) {
        Model = AltModel;
        user = altUser;
        actualRole = isCounselor ? 'welfare' : 'counselor';
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      user._id,
      {
        $set: {
          approvalStatus: 'rejected',
          isApproved: false,
          rejectionReason: reason,
        },
      },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      message: `${updatedUser.fullName || updatedUser.firstName} (${actualRole}) registration request has been rejected.`,
      user: updatedUser.toSafeObject ? updatedUser.toSafeObject() : updatedUser,
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
    const manager = await Management.findById(req.user.id);
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Management account not found' });
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
    const { firstName, lastName, phone, department, position } = req.body;

    const manager = await Management.findById(req.user.id);
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Management account not found' });
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

// ── Appointment Summary ───────────────────────────────────────────────────────
// Appointments are stored with mixed status spellings, so map them to four buckets.
const normaliseStatus = (status = '') => {
  const v = String(status).toLowerCase().trim();
  if (['completed', 'done'].includes(v)) return 'completed';
  if (['cancelled', 'canceled'].includes(v)) return 'cancelled';
  if (['in session', 'in_session', 'ongoing'].includes(v)) return 'in session';
  return 'upcoming';
};

const MANAGED_STATUSES = ['upcoming', 'completed', 'cancelled'];

const formatAppointment = (a) => ({
  id: a._id,
  studentName: a.studentName || 'Student',
  counselorName: a.counselorName,
  specialization: a.counselorSpecialization,
  date: a.date,
  time: a.time,
  sessionType: a.sessionType,
  notes: a.notes || '',
  status: normaliseStatus(a.status),
});

exports.getManagementAppointments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const all = (await Appointment.find().sort({ createdAt: -1 })).map(formatAppointment);

    const summary = { total: all.length, upcoming: 0, 'in session': 0, completed: 0, cancelled: 0 };
    all.forEach((a) => { summary[a.status] += 1; });

    const term = (search || '').trim().toLowerCase();
    const appointments = all.filter((a) => {
      if (status && status !== 'all' && a.status !== status) return false;
      if (!term) return true;
      return [a.studentName, a.counselorName, a.specialization]
        .some((v) => (v || '').toLowerCase().includes(term));
    });

    res.status(200).json({ success: true, summary, count: appointments.length, appointments });
  } catch (error) {
    console.error('❌ getManagementAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching appointments' });
  }
};

exports.updateManagementAppointment = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (status === undefined && notes === undefined) {
      return res.status(400).json({ success: false, message: 'Provide a status or notes to update' });
    }
    if (status !== undefined && !MANAGED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${MANAGED_STATUSES.join(', ')}` });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status !== undefined) appointment.status = status;
    if (notes !== undefined) appointment.notes = String(notes).trim().slice(0, 500);
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: formatAppointment(appointment),
    });
  } catch (error) {
    console.error('❌ updateManagementAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error updating appointment' });
  }
};

// ── Usage Reports ─────────────────────────────────────────────────────────────
const rangeStart = (range) => {
  const now = new Date();
  switch (range) {
    case 'This Week': {
      const d = new Date(now);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'This Quarter':
      return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case 'This Year':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
};

const groupBy = (items, keyFn) => {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item) || 'Unspecified';
    map.set(key, [...(map.get(key) || []), item]);
  });
  return [...map.entries()];
};

const buildUsageReport = async (type, range) => {
  const since = rangeStart(range);
  const appointments = (await Appointment.find({ createdAt: { $gte: since } })).map(formatAppointment);
  const count = (list, st) => list.filter((a) => a.status === st).length;

  if (type === 'Appointments') {
    return {
      totalRecords: appointments.length,
      summary: [
        { label: 'Total', value: appointments.length },
        { label: 'Upcoming', value: count(appointments, 'upcoming') + count(appointments, 'in session') },
        { label: 'Completed', value: count(appointments, 'completed') },
        { label: 'Cancelled', value: count(appointments, 'cancelled') },
      ],
      rows: groupBy(appointments, (a) => a.sessionType).map(([label, list]) => ({
        label, value: list.length, detail: 'sessions by type',
      })),
    };
  }

  if (type === 'Department Usage') {
    const groups = groupBy(appointments, (a) => a.specialization);
    return {
      totalRecords: appointments.length,
      summary: [
        { label: 'Departments', value: groups.length },
        { label: 'Appointments', value: appointments.length },
      ],
      rows: groups.map(([label, list]) => ({
        label, value: list.length, detail: `${count(list, 'completed')} completed`,
      })).sort((a, b) => b.value - a.value),
    };
  }

  if (type === 'Counselor Performance') {
    const groups = groupBy(appointments, (a) => a.counselorName);
    return {
      totalRecords: appointments.length,
      summary: [
        { label: 'Counselors', value: groups.length },
        { label: 'Completed', value: count(appointments, 'completed') },
        { label: 'Cancelled', value: count(appointments, 'cancelled') },
      ],
      rows: groups.map(([label, list]) => ({
        label,
        value: list.length,
        detail: `${Math.round((count(list, 'completed') / list.length) * 100)}% completed`,
      })).sort((a, b) => b.value - a.value),
    };
  }

  // User Activity
  const [newStudents, activeStudents, counselors, welfare] = await Promise.all([
    Student.countDocuments({ createdAt: { $gte: since } }),
    Student.countDocuments({ isActive: true }),
    Counselor.countDocuments({ approvalStatus: 'approved' }),
    Welfare.countDocuments({ approvalStatus: 'approved' }),
  ]);
  return {
    totalRecords: activeStudents + counselors + welfare,
    summary: [
      { label: 'Active students', value: activeStudents },
      { label: 'New students', value: newStudents },
      { label: 'Counselors', value: counselors },
      { label: 'Welfare officers', value: welfare },
    ],
    rows: groupBy(appointments, (a) => a.studentName).map(([label, list]) => ({
      label, value: list.length, detail: 'bookings in period',
    })).sort((a, b) => b.value - a.value).slice(0, 5),
  };
};

const validateReportInput = (type, range) => {
  if (!UsageReport.REPORT_TYPES.includes(type)) return `Report type must be one of: ${UsageReport.REPORT_TYPES.join(', ')}`;
  if (!UsageReport.DATE_RANGES.includes(range)) return `Date range must be one of: ${UsageReport.DATE_RANGES.join(', ')}`;
  return null;
};

exports.generateUsageReport = async (req, res) => {
  try {
    const { type, range } = req.body;
    const problem = validateReportInput(type, range);
    if (problem) return res.status(400).json({ success: false, message: problem });

    const report = await buildUsageReport(type, range);
    res.status(200).json({ success: true, report: { type, range, generatedAt: new Date(), ...report } });
  } catch (error) {
    console.error('❌ generateUsageReport error:', error);
    res.status(500).json({ success: false, message: 'Server error generating report' });
  }
};

exports.saveUsageReport = async (req, res) => {
  try {
    const { type, range } = req.body;
    const problem = validateReportInput(type, range);
    if (problem) return res.status(400).json({ success: false, message: problem });

    // Rebuilt on the server so a saved report always reflects real data
    const built = await buildUsageReport(type, range);
    const saved = await UsageReport.create({ type, range, ...built, generatedBy: req.user.id });
    res.status(201).json({ success: true, message: 'Report saved', report: saved });
  } catch (error) {
    console.error('❌ saveUsageReport error:', error);
    res.status(500).json({ success: false, message: 'Server error saving report' });
  }
};

exports.getSavedReports = async (req, res) => {
  try {
    const reports = await UsageReport.find({ generatedBy: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    console.error('❌ getSavedReports error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching saved reports' });
  }
};

exports.deleteSavedReport = async (req, res) => {
  try {
    const deleted = await UsageReport.findOneAndDelete({ _id: req.params.id, generatedBy: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('❌ deleteSavedReport error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting report' });
  }
};

// ── Usage Details ─────────────────────────────────────────────────────────────
exports.getUsageDetails = async (req, res) => {
  try {
    const monthStart = rangeStart('This Month');
    const [appointmentDocs, activeStudents, newStudents, counselors, welfare, notes] = await Promise.all([
      Appointment.find(),
      Student.countDocuments({ isActive: true }),
      Student.countDocuments({ createdAt: { $gte: monthStart } }),
      Counselor.countDocuments({ approvalStatus: 'approved' }),
      Welfare.countDocuments({ approvalStatus: 'approved' }),
      ServiceNote.find().sort({ createdAt: -1 }).limit(30),
    ]);
    const appointments = appointmentDocs.map(formatAppointment);
    const total = appointments.length;
    const count = (list, st) => list.filter((a) => a.status === st).length;

    const departments = groupBy(appointments, (a) => a.specialization)
      .map(([department, list]) => ({
        department,
        sessions: list.length,
        completed: count(list, 'completed'),
        cancelled: count(list, 'cancelled'),
        percentage: total ? Math.round((list.length / total) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    const timeSlots = groupBy(appointments, (a) => a.time).sort((a, b) => b[1].length - a[1].length);

    res.status(200).json({
      success: true,
      overview: {
        totalUsers: activeStudents + counselors + welfare,
        activeStudents,
        newStudentsThisMonth: newStudents,
        totalAppointments: total,
        avgAppointmentsPerStudent: activeStudents ? Math.round((total / activeStudents) * 10) / 10 : 0,
      },
      insights: {
        mostActiveDepartment: departments[0] ? departments[0].department : 'No data',
        peakTime: timeSlots[0] ? timeSlots[0][0] : 'No data',
      },
      departments,
      notes: notes.map((n) => ({
        id: n._id,
        department: n.department,
        text: n.text,
        authorName: n.authorName,
        mine: String(n.createdBy) === String(req.user.id),
        createdAt: n.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ getUsageDetails error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching usage details' });
  }
};

exports.addServiceNote = async (req, res) => {
  try {
    const department = String(req.body.department || '').trim();
    const text = String(req.body.text || '').trim();
    if (!department || !text) {
      return res.status(400).json({ success: false, message: 'Department and note text are required' });
    }
    if (text.length > 300) {
      return res.status(400).json({ success: false, message: 'Notes cannot exceed 300 characters' });
    }

    const manager = await Management.findById(req.user.id);
    const note = await ServiceNote.create({
      department,
      text,
      createdBy: req.user.id,
      authorName: manager ? manager.fullName : '',
    });
    res.status(201).json({ success: true, message: 'Note added', note });
  } catch (error) {
    console.error('❌ addServiceNote error:', error);
    res.status(500).json({ success: false, message: 'Server error adding note' });
  }
};

exports.deleteServiceNote = async (req, res) => {
  try {
    const deleted = await ServiceNote.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Note not found, or it belongs to another manager' });
    }
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('❌ deleteServiceNote error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting note' });
  }
};

// ── Privacy & Security ────────────────────────────────────────────────────────
exports.getSecurityInfo = async (req, res) => {
  try {
    const manager = await Management.findById(req.user.id);
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Management account not found' });
    }

    res.status(200).json({
      success: true,
      account: {
        fullName: manager.fullName,
        email: manager.email,
        employeeId: manager.employeeId,
        createdAt: manager.createdAt,
        lastLogin: manager.lastLogin,
        passwordChangedAt: manager.passwordChangedAt,
      },
      recentLogins: (manager.loginHistory || []).map((l) => l.at).reverse(),
    });
  } catch (error) {
    console.error('❌ getSecurityInfo error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching security information' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }
    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the current one' });
    }

    const manager = await Management.findById(req.user.id).select('+password');
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Management account not found' });
    }
    if (!(await manager.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    manager.password = newPassword;
    manager.passwordChangedAt = new Date();
    await manager.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ changePassword error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};
