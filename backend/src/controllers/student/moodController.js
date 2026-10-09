const MoodCheck = require('../../models/student/MoodCheck');

// ─────────────────────────────────────────────────────────────────────────────
//  CREATE  POST /api/student/mood
// ─────────────────────────────────────────────────────────────────────────────
exports.createMood = async (req, res) => {
  try {
    const { mood, notes } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: 'Mood is required' });
    }

    const entry = await MoodCheck.create({
      student: req.user.id,
      mood,
      notes: notes || '',
    });

    res.status(201).json({ success: true, message: 'Mood recorded', data: entry });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    console.error('❌ createMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  READ ALL  GET /api/student/mood
// ─────────────────────────────────────────────────────────────────────────────
exports.getMoods = async (req, res) => {
  try {
    const moods = await MoodCheck.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({ success: true, count: moods.length, data: moods });
  } catch (error) {
    console.error('❌ getMoods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  READ ONE  GET /api/student/mood/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getMoodById = async (req, res) => {
  try {
    const entry = await MoodCheck.findOne({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    console.error('❌ getMoodById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  UPDATE  PUT /api/student/mood/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.updateMood = async (req, res) => {
  try {
    const { mood, notes } = req.body;

    const entry = await MoodCheck.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id },
      { $set: { mood, notes } },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }

    res.status(200).json({ success: true, message: 'Mood updated', data: entry });
  } catch (error) {
    console.error('❌ updateMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE  DELETE /api/student/mood/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteMood = async (req, res) => {
  try {
    const entry = await MoodCheck.findOneAndDelete({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }

    res.status(200).json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    console.error('❌ deleteMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
