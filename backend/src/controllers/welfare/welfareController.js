const Welfare = require('../../models/welfare/Welfare');
const Counselor = require('../../models/counselor/Counselor');
const Appointment = require('../../models/counselor/Appointment');

// ── Get Logged-In Welfare Officer Profile ─────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const welfareId = req.user?.id;
    let welfare = null;

    if (welfareId) {
      welfare = await Welfare.findById(welfareId);
    }

    // Fallback: check query email or staffId if provided (for management lookup)
    if (!welfare && req.query.staffId) {
      welfare = await Welfare.findOne({ staffId: req.query.staffId.trim().toUpperCase() });
    } else if (!welfare && req.query.email) {
      welfare = await Welfare.findOne({ email: req.query.email.trim().toLowerCase() });
    }

    if (!welfare) {
      return res.status(404).json({ success: false, message: 'Welfare officer not found' });
    }

    res.status(200).json({
      success: true,
      user: welfare.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ getProfile welfare error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching welfare profile' });
  }
};

// ── Get Welfare Officer by Unique Staff ID ────────────────────────────────────
exports.getByStaffId = async (req, res) => {
  try {
    const staffId = req.params.staffId?.trim().toUpperCase();
    if (!staffId) {
      return res.status(400).json({ success: false, message: 'Staff ID is required' });
    }

    const welfare = await Welfare.findOne({ staffId });
    if (!welfare) {
      return res.status(404).json({
        success: false,
        message: `Welfare officer with Staff ID "${staffId}" not found`,
      });
    }

    res.status(200).json({
      success: true,
      officer: welfare.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ getByStaffId error:', error);
    res.status(500).json({ success: false, message: 'Server error looking up Staff ID' });
  }
};

// ── Update Logged-In Welfare Officer Profile ──────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const welfareId = req.user?.id;
    const {
      firstName,
      lastName,
      phone,
      department,
      position,
      officeLocation,
      bio,
      specializations,
      officeHours,
      qualifications,
      yearsOfExperience,
      languages,
      emergencyContactPhone,
      workingSchedule,
      availabilityStatus,
      workingDays,
      consultationMode,
      emergencyAvailable,
      availabilityNote,
    } = req.body;

    let welfare = await Welfare.findById(welfareId);
    if (!welfare) {
      return res.status(404).json({ success: false, message: 'Welfare officer not found' });
    }

    if (firstName) welfare.firstName = firstName.trim();
    if (lastName) welfare.lastName = lastName.trim();
    if (phone) welfare.phone = phone.trim();
    if (department) welfare.department = department.trim();
    if (position) welfare.position = position.trim();
    if (officeLocation !== undefined) welfare.officeLocation = officeLocation.trim();
    if (bio !== undefined) welfare.bio = bio.trim();
    if (specializations !== undefined) {
      welfare.specializations = Array.isArray(specializations)
        ? specializations
        : specializations.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (officeHours !== undefined) welfare.officeHours = officeHours.trim();
    if (qualifications !== undefined) welfare.qualifications = qualifications.trim();
    if (yearsOfExperience !== undefined) welfare.yearsOfExperience = yearsOfExperience.trim();
    if (languages !== undefined) {
      welfare.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((l) => l.trim()).filter(Boolean);
    }
    if (emergencyContactPhone !== undefined) welfare.emergencyContactPhone = emergencyContactPhone.trim();
    if (workingSchedule !== undefined) welfare.workingSchedule = workingSchedule.trim();
    if (availabilityStatus !== undefined) welfare.availabilityStatus = availabilityStatus.trim();
    if (workingDays !== undefined) {
      welfare.workingDays = Array.isArray(workingDays)
        ? workingDays
        : workingDays.split(',').map((d) => d.trim()).filter(Boolean);
    }
    if (consultationMode !== undefined) welfare.consultationMode = consultationMode.trim();
    if (emergencyAvailable !== undefined) welfare.emergencyAvailable = Boolean(emergencyAvailable);
    if (availabilityNote !== undefined) welfare.availabilityNote = availabilityNote.trim();

    await welfare.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: welfare.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ updateProfile welfare error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating profile' });
  }
};

// ── Get Welfare Dashboard Data ────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const welfareId = req.user?.id;
    const welfare = await Welfare.findById(welfareId);

    if (!welfare) {
      return res.status(404).json({ success: false, message: 'Welfare officer not found' });
    }

    res.status(200).json({
      success: true,
      officer: welfare.toSafeObject(),
      stats: {
        totalSupported: 142,
        activeCases: 28,
        referrals: 19,
        resolvedCases: 95,
      },
    });
  } catch (error) {
    console.error('❌ getDashboard welfare error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
  }
};

// ── Get All Welfare Officers (For Management or Directory) ────────────────────
exports.getAllWelfareOfficers = async (req, res) => {
  try {
    const officers = await Welfare.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: officers.length,
      officers: officers.map((o) => o.toSafeObject()),
    });
  } catch (error) {
    console.error('❌ getAllWelfareOfficers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching welfare officers' });
  }
};

// ── Update Schedule & Availability ──────────────────────────────────────────
exports.updateSchedule = async (req, res) => {
  try {
    const welfareId = req.user?.id;
    const {
      workingSchedule,
      officeHours,
      availabilityStatus,
      workingDays,
      consultationMode,
      emergencyAvailable,
      availabilityNote,
      officeLocation,
    } = req.body;

    const welfare = await Welfare.findById(welfareId);
    if (!welfare) {
      return res.status(404).json({ success: false, message: 'Welfare officer not found' });
    }

    if (workingSchedule !== undefined) welfare.workingSchedule = workingSchedule.trim();
    if (officeHours !== undefined) welfare.officeHours = officeHours.trim();
    if (availabilityStatus !== undefined) welfare.availabilityStatus = availabilityStatus.trim();
    if (workingDays !== undefined) {
      welfare.workingDays = Array.isArray(workingDays)
        ? workingDays
        : workingDays.split(',').map((d) => d.trim()).filter(Boolean);
    }
    if (consultationMode !== undefined) welfare.consultationMode = consultationMode.trim();
    if (emergencyAvailable !== undefined) welfare.emergencyAvailable = Boolean(emergencyAvailable);
    if (availabilityNote !== undefined) welfare.availabilityNote = availabilityNote.trim();
    if (officeLocation !== undefined) welfare.officeLocation = officeLocation.trim();

    await welfare.save();

    res.status(200).json({
      success: true,
      message: 'Work schedule & availability updated successfully',
      officer: welfare.toSafeObject(),
      schedule: {
        workingSchedule: welfare.workingSchedule,
        officeHours: welfare.officeHours,
        availabilityStatus: welfare.availabilityStatus,
        workingDays: welfare.workingDays,
        consultationMode: welfare.consultationMode,
        emergencyAvailable: welfare.emergencyAvailable,
        availabilityNote: welfare.availabilityNote,
        officeLocation: welfare.officeLocation,
      },
    });
  } catch (error) {
    console.error('❌ updateSchedule error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating schedule' });
  }
};

// ── Get Counseling Services Overview (Counselors + Live Sessions) ────────────
exports.getCounselingServices = async (req, res) => {
  try {
    // 1. Fetch approved Counselors
    const counselorsDoc = await Counselor.find({ isApproved: true }).sort({ firstName: 1 });
    const counselors = counselorsDoc.map((c) => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      staffId: c.staffId,
      name: `${c.firstName} ${c.lastName}`.trim(),
      firstName: c.firstName,
      lastName: c.lastName,
      specialization: c.specialization,
      qualification: c.qualification,
      yearsOfExperience: c.yearsOfExperience,
      officeLocation: c.officeLocation || 'Main Welfare Centre',
      phone: c.phone,
      email: c.email,
      status: c.status || 'Available',
    }));

    // 2. Fetch Appointments & Live Sessions
    const appointmentsDoc = await Appointment.find()
      .populate('student', 'firstName lastName name studentId email')
      .sort({ createdAt: -1 });

    const liveSessions = appointmentsDoc
      .filter((a) => a.date === 'Today' || a.status === 'in-session' || a.status === 'In Session' || a.status === 'upcoming' || a.status === 'Scheduled')
      .slice(0, 10)
      .map((a) => {
        let studentName = a.studentName;
        if (!studentName && a.student) {
          studentName = `${a.student.firstName || ''} ${a.student.lastName || ''}`.trim();
        }
        return {
          id: a._id.toString(),
          _id: a._id.toString(),
          student: studentName || 'Student',
          studentId: a.student?.studentId || '',
          counselor: a.counselorName,
          specialization: a.counselorSpecialization || 'Student Counselling',
          date: a.date,
          time: a.time,
          sessionType: a.sessionType || 'Online',
          status: (a.status === 'in-session' || a.status === 'In Session') ? 'In Session' : (a.status === 'cancelled' ? 'Cancelled' : 'Scheduled'),
          notes: a.notes || '',
        };
      });

    // 3. Compute Service Demand
    const demandDays = [
      { id: '1', day: 'Mon', sessions: 0, dateLabel: 'Oct 12' },
      { id: '2', day: 'Tue', sessions: 0, dateLabel: 'Oct 13' },
      { id: '3', day: 'Wed', sessions: 0, dateLabel: 'Oct 14' },
      { id: '4', day: 'Thu', sessions: 0, dateLabel: 'Oct 15' },
      { id: '5', day: 'Fri', sessions: 0, dateLabel: 'Oct 16' },
    ];
    appointmentsDoc.forEach((apt) => {
      const d = (apt.date || '').toLowerCase();
      if (d.includes('mon')) demandDays[0].sessions++;
      else if (d.includes('tue')) demandDays[1].sessions++;
      else if (d.includes('wed')) demandDays[2].sessions++;
      else if (d.includes('thu')) demandDays[3].sessions++;
      else if (d.includes('fri')) demandDays[4].sessions++;
    });
    demandDays.forEach((item, idx) => {
      if (item.sessions === 0) item.sessions = [4, 6, 5, 3, 4][idx];
    });

    res.status(200).json({
      success: true,
      serviceAvailability: 'Open',
      dutyStatus: 'On Duty Today',
      counselors,
      liveSessions,
      upcomingServiceDemand: demandDays,
      stats: {
        totalCounselors: counselors.length,
        availableCounselors: counselors.filter((c) => c.status === 'Available').length,
        inSessionCounselors: counselors.filter((c) => c.status === 'In Session').length,
        todayLiveSessions: liveSessions.length,
      },
    });
  } catch (error) {
    console.error('❌ getCounselingServices error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching counseling services' });
  }
};

// ── Update Counselor Status (Available / In Session / Out of Office) ──────────
exports.updateCounselorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['Available', 'In Session', 'Out of Office', 'On Leave'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const counselor = await Counselor.findByIdAndUpdate(id, { status }, { new: true });
    if (!counselor) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Counselor status updated',
      counselor: counselor.toSafeObject(),
    });
  } catch (error) {
    console.error('❌ updateCounselorStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error updating counselor status' });
  }
};
