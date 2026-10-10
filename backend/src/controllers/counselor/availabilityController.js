const CounselorAvailability = require('../../models/counselor/CounselorAvailability');

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const sortByDay = (items) =>
  [...items].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

// GET /api/counselor/availability
exports.getAvailability = async (req, res) => {
  try {
    const availability = await CounselorAvailability.find();
    return res.status(200).json(sortByDay(availability));
  } catch (error) {
    console.error('❌ counselor getAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch availability' });
  }
};

// POST /api/counselor/availability
exports.createAvailability = async (req, res) => {
  try {
    const { day, slots, startTime, endTime, active = true } = req.body;
    if (!day) {
      return res.status(400).json({ success: false, message: 'Day is required' });
    }

    const result = await CounselorAvailability.create({
      _id: `av-${Date.now()}`,
      // The counselor module uses the string 'c1' as the profile ID throughout
      // (CounselorProfile._id, CounselorAppointment.counselorId, CounselorAvailability.counselorId).
      // The authenticated Counselor ObjectId (req.user.id) is the auth identity;
      // 'c1' is the counselor module's display identity. These are separate systems.
      counselorId: 'c1',
      day,
      active,
      startTime,
      endTime,
      slots: slots || [],
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('❌ counselor createAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create availability' });
  }
};

// PUT /api/counselor/availability/:id
exports.updateAvailability = async (req, res) => {
  try {
    const { day, slots, startTime, endTime, active } = req.body;
    const updates = {};
    if (day !== undefined) updates.day = day;
    if (slots !== undefined) updates.slots = slots;
    if (startTime !== undefined) updates.startTime = startTime;
    if (endTime !== undefined) updates.endTime = endTime;
    if (active !== undefined) updates.active = active;

    const result = await CounselorAvailability.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Availability not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ counselor updateAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update availability' });
  }
};

// DELETE /api/counselor/availability/:id
exports.deleteAvailability = async (req, res) => {
  try {
    await CounselorAvailability.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ counselor deleteAvailability error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete availability' });
  }
};
