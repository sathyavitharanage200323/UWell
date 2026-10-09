const CounselorProfile = require('../../models/counselor/CounselorProfile');

const DEFAULT_PROFILE = {
  _id: 'c1',
  name: 'Dr. Evelyn Martinez, PhD',
  title: 'Senior Student Cognitive Psychologist',
  role: 'CLINICAL STAFF',
  rating: 4.9,
  sessionsReviewed: 148,
  qualification: 'PhD in Clinical Psychology, Stanford',
  specialization: 'Cognitive Behavioral Therapy (CBT)',
  clinicalFocus: ['Academic Burnout', 'ADHD Management', 'Anxiety Disorder', 'Social Adjustment'],
  officeLocation: 'Clinic Hall B, Room 302',
  email: 'e.martinez@university.edu',
  avatarInitials: 'EM',
  bio: 'Dedicated senior psychologist with over 10 years of experience supporting university students through academic, emotional, and social challenges.',
};

// GET /api/counselor/profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await CounselorProfile.findOne();
    if (!profile) {
      profile = await CounselorProfile.create(DEFAULT_PROFILE);
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error('❌ counselor getProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch counselor profile' });
  }
};

// PUT /api/counselor/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      'name',
      'title',
      'qualification',
      'specialization',
      'clinicalFocus',
      'officeLocation',
      'email',
      'avatarInitials',
      'bio',
      'rating',
      'sessionsReviewed',
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    let profile = await CounselorProfile.findOne();
    if (!profile) {
      profile = await CounselorProfile.create({ ...DEFAULT_PROFILE, ...updates });
    } else {
      profile.set(updates);
      await profile.save();
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('❌ counselor updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update counselor profile' });
  }
};

// GET /api/counselor/stats
exports.getStats = async (req, res) => {
  try {
    const stats = {
      activeCases: 42,
      thisWeekSessions: 18,
      pendingRequests: 5,
      summary: 'Your afternoon is fully booked with student check-ins.',
    };
    return res.status(200).json(stats);
  } catch (error) {
    console.error('❌ counselor getStats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
