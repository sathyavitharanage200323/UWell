const CounselorProfile = require('../../models/counselor/CounselorProfile');
const CounselorAvailability = require('../../models/counselor/CounselorAvailability');

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

const sortByDay = (items) =>
  [...items].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

// GET /api/student/counselors
exports.getCounselors = async (req, res) => {
  try {
    let counselors = await CounselorProfile.find();
    if (counselors.length === 0) {
      const created = await CounselorProfile.create(DEFAULT_PROFILE);
      counselors = [created];
    }
    return res.status(200).json(counselors);
  } catch (error) {
    console.error('❌ student getCounselors error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch counselors' });
  }
};

// GET /api/student/counselors/:id
exports.getCounselorById = async (req, res) => {
  try {
    const counselor = await CounselorProfile.findById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }
    return res.status(200).json(counselor);
  } catch (error) {
    console.error('❌ student getCounselorById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch counselor' });
  }
};

// GET /api/student/counselors/:id/availability
exports.getCounselorAvailability = async (req, res) => {
  try {
    const availability = await CounselorAvailability.find({ counselorId: req.params.id });
    return res.status(200).json(sortByDay(availability));
  } catch (error) {
    console.error('❌ student getCounselorAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch availability' });
  }
};
