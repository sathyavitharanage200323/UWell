const mongoose = require('mongoose');

/**
 * Management's view of the shared "appointments" collection.
 *
 * The student and counselor modules each register a model named "Appointment"
 * on this same collection, and Mongoose refuses to compile two models with one
 * name. Management therefore uses its own model name so it can load alongside both.
 */
const appointmentRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, default: '' },
    counselorName: { type: String, default: '' },
    counselorSpecialization: { type: String, default: 'Student Counselling' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    sessionType: { type: String, default: 'Online' },
    notes: { type: String, default: '' },
    status: { type: String, default: 'upcoming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ManagementAppointmentRecord', appointmentRecordSchema, 'appointments');
