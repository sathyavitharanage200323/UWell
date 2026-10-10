const Appointment = require('../../models/student/Appointment');
const Student = require('../../models/student/Student');
const CounselorAppointment = require('../../models/counselor/CounselorAppointment');

// ─────────────────────────────────────────────────────────────────────────────
//  CREATE  POST /api/student/appointments
// ─────────────────────────────────────────────────────────────────────────────
exports.createAppointment = async (req, res) => {
  try {
    const { counselorId, counselorName, counselorSpecialization, date, time, sessionType, notes } = req.body;

    if (!counselorName || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Counselor name, date, and time are required',
      });
    }

    // Create student-side appointment
    const appointment = await Appointment.create({
      student: req.user.id,
      counselorId:              counselorId || null,
      counselorName,
      counselorSpecialization:  counselorSpecialization || 'Student Counselling',
      date,
      time,
      sessionType:  sessionType || 'Online',
      notes:        notes || '',
      status:       'upcoming',
    });

    // Mirror to counselor_appointments so counselor can see this booking.
    // Uses upsert on the stable key so retries never create duplicates.
    try {
      const student = await Student.findById(req.user.id).lean();
      const studentName = student
        ? `${student.firstName} ${student.lastName}`
        : 'Student';
      const studentCourse = student
        ? `${student.yearOfStudy} · ${student.degreeProgram}`
        : '';
      const initials = student
        ? `${(student.firstName || '')[0]}${(student.lastName || '')[0]}`.toUpperCase()
        : 'ST';

      const mirrorId = `stu-appt-${appointment._id}`;

      await CounselorAppointment.findOneAndUpdate(
        { _id: mirrorId },
        {
          $setOnInsert: {
            _id:               mirrorId,
            studentId:         String(req.user.id),
            counselorId:       counselorId ? String(counselorId) : '',
            counselorName:     counselorName || '',
            studentName,
            studentCourse,
            sessionType:       sessionType || 'Online',
            date,
            time,
            location:          sessionType === 'In Person' ? 'In-Person Room 304' : 'Online Session',
            status:            'Pending',
            notes:             notes || '',
            avatarInitials:    initials,
          },
        },
        { upsert: true, new: false }
      );

      console.log(`[Booking] Mirror created for appointment ${appointment._id}`);
    } catch (mirrorErr) {
      // Non-blocking — student appointment already saved successfully.
      // Log the error type only; no student data in the log.
      const errCode = mirrorErr?.code || mirrorErr?.name || 'UNKNOWN';
      console.error(`[Booking] Counselor mirror failed (${errCode}) for appointment ${appointment._id}. Student booking is intact.`);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('❌ createAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  READ ALL  GET /api/student/appointments
// ─────────────────────────────────────────────────────────────────────────────
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('❌ getAppointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  READ ONE  GET /api/student/appointments/:id
// ─────────────────────────────────────────────────────────────────────────────
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error('❌ getAppointmentById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  UPDATE  PUT /api/student/appointments/:id
//  Used for reschedule (date/time) or status update
// ─────────────────────────────────────────────────────────────────────────────
exports.updateAppointment = async (req, res) => {
  try {
    const { date, time, sessionType, notes, status } = req.body;

    const allowedUpdates = {};
    if (date)        allowedUpdates.date        = date;
    if (time)        allowedUpdates.time        = time;
    if (sessionType) allowedUpdates.sessionType = sessionType;
    if (notes !== undefined) allowedUpdates.notes = notes;
    if (status)      allowedUpdates.status      = status;

    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('❌ updateAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  DELETE  DELETE /api/student/appointments/:id
//  Cancel appointment (sets status to 'cancelled', does not hard-delete)
// ─────────────────────────────────────────────────────────────────────────────
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id, status: 'upcoming' },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or already cancelled',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('❌ cancelAppointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
