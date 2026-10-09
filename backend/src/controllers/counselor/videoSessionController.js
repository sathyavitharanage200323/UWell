const VideoSession = require('../../models/counselor/VideoSession');

// POST /api/counselor/video-session/start
exports.startVideoSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const session = {
      sessionId: `id-${Date.now()}`,
      status: 'active',
      joinUrl: 'uwell-video://session-placeholder',
      appointmentId: appointmentId || '',
    };

    await VideoSession.create(session);
    return res.status(201).json(session);
  } catch (error) {
    console.error('❌ counselor startVideoSession error:', error);
    return res.status(500).json({ success: false, message: 'Failed to start video session' });
  }
};
