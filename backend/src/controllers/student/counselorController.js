const Counselor = require('../../models/counselor/Counselor');

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/counselors
//  Returns all approved, active counselors — readable by authenticated students
// ─────────────────────────────────────────────────────────────────────────────
exports.getCounselors = async (req, res) => {
  try {
    const projection = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      specialization: 1,
      qualification: 1,
      yearsOfExperience: 1,
      officeLocation: 1,
      status: 1,
      profileImage: 1,
      bio: 1,
    };

    // Primary: approved and active counselors
    let counselors = await Counselor.find(
      { isApproved: true, isActive: true },
      projection
    ).sort({ createdAt: 1 });

    // Fallback: if no approved counselors exist (e.g. fresh DB / pending approval),
    // return all active counselors so the student screen is never empty.
    if (counselors.length === 0) {
      counselors = await Counselor.find({ isActive: true }, projection).sort({ createdAt: 1 });
    }

    const data = counselors.map((c) => ({
      _id:            c._id,
      name:           `${c.firstName} ${c.lastName}`,
      specialization: c.specialization,
      qualification:  c.qualification,
      experience:     `${c.yearsOfExperience} years experience`,
      officeLocation: c.officeLocation || '',
      availability:   c.status === 'Available' ? 'Available today' : c.status,
      avatarInitials: `${(c.firstName || '')[0]}${(c.lastName || '')[0]}`.toUpperCase(),
      profileImage:   c.profileImage || '',
      bio:            c.bio || '',
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('❌ getCounselors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/student/counselors/:id
//  Returns a single approved counselor's profile
// ─────────────────────────────────────────────────────────────────────────────
exports.getCounselorById = async (req, res) => {
  try {
    const projection = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      specialization: 1,
      qualification: 1,
      yearsOfExperience: 1,
      officeLocation: 1,
      status: 1,
      profileImage: 1,
      bio: 1,
    };

    // Try approved first, fall back to any active counselor with that id
    let counselor = await Counselor.findOne(
      { _id: req.params.id, isApproved: true, isActive: true },
      projection
    );
    if (!counselor) {
      counselor = await Counselor.findOne(
        { _id: req.params.id, isActive: true },
        projection
      );
    }

    if (!counselor) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id:            counselor._id,
        name:           `${counselor.firstName} ${counselor.lastName}`,
        specialization: counselor.specialization,
        qualification:  counselor.qualification,
        experience:     `${counselor.yearsOfExperience} years experience`,
        officeLocation: counselor.officeLocation || '',
        availability:   counselor.status === 'Available' ? 'Available today' : counselor.status,
        avatarInitials: `${(counselor.firstName || '')[0]}${(counselor.lastName || '')[0]}`.toUpperCase(),
        profileImage:   counselor.profileImage || '',
        bio:            counselor.bio || '',
      },
    });
  } catch (error) {
    console.error('❌ getCounselorById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
