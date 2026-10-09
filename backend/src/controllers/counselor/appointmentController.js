const CounselorAppointment = require('../../models/counselor/CounselorAppointment');

// GET /api/counselor/appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await CounselorAppointment.find().sort({ createdAt: -1 });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('❌ counselor getAppointments error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

// GET /api/counselor/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await CounselorAppointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('❌ counselor getAppointmentById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch appointment' });
  }
};

// PUT /api/counselor/appointments/:id
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const appointment = await CounselorAppointment.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('❌ counselor updateAppointmentStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
};
