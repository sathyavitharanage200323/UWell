const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Counselor = require('../models/counselor/Counselor');
const Appointment = require('../models/counselor/Appointment');
const Student = require('../models/student/Student');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Update existing counselors status
  await Counselor.updateOne({ staffId: 'CNS2024001' }, { status: 'Available' });
  await Counselor.updateOne({ staffId: 'CNS2024002' }, { status: 'In Session' });

  // Add Dr. Sarah Perera if not exists
  let sarah = await Counselor.findOne({ staffId: 'CNS2024003' });
  if (!sarah) {
    sarah = await Counselor.create({
      staffId: 'CNS2024003',
      firstName: 'Dr. Sarah',
      lastName: 'Perera',
      email: 'sarah.perera@university.edu',
      qualification: 'PhD in Student Psychology',
      specialization: 'Student Counselling & Wellness',
      yearsOfExperience: '7 years',
      phone: '0714455667',
      officeLocation: 'Block A, Office 104',
      status: 'Available',
      isApproved: true,
      approvalStatus: 'approved',
      password: 'Password123!',
      role: 'counselor',
    });
    console.log('Created Dr. Sarah Perera');
  }

  // Add Dr. Kavindu Silva if not exists
  let kavindu = await Counselor.findOne({ staffId: 'CNS2024004' });
  if (!kavindu) {
    kavindu = await Counselor.create({
      staffId: 'CNS2024004',
      firstName: 'Dr. Kavindu',
      lastName: 'Silva',
      email: 'kavindu.counselor@university.edu',
      qualification: 'MSc in Clinical Counselling',
      specialization: 'Depression & Crisis Intervention',
      yearsOfExperience: '5 years',
      phone: '0789988776',
      officeLocation: 'Health Centre, Room 02',
      status: 'In Session',
      isApproved: true,
      approvalStatus: 'approved',
      password: 'Password123!',
      role: 'counselor',
    });
    console.log('Created Dr. Kavindu Silva');
  }

  // Find students
  const student = await Student.findOne();
  if (student) {
    const existingLive = await Appointment.findOne({ date: 'Today' });
    if (!existingLive) {
      await Appointment.create({
        student: student._id,
        studentName: 'Lily Fernando',
        counselor: sarah._id,
        counselorName: 'Dr. Sarah Perera',
        counselorSpecialization: 'Student Counselling & Wellness',
        date: 'Today',
        time: '10:00 AM',
        sessionType: 'Online',
        status: 'In Session',
        notes: 'Exam stress & anxiety management session',
      });
      await Appointment.create({
        student: student._id,
        studentName: 'Amal Perera',
        counselor: kavindu._id,
        counselorName: 'Dr. Kavindu Silva',
        counselorSpecialization: 'Depression & Crisis Intervention',
        date: 'Today',
        time: '01:30 PM',
        sessionType: 'In Person',
        status: 'Scheduled',
        notes: 'Midterm progress and motivation coaching',
      });
      await Appointment.create({
        student: student._id,
        studentName: 'Dilika Dilmith',
        counselor: sarah._id,
        counselorName: 'Dr. Rachel Green',
        counselorSpecialization: 'Anxiety & Stress Management',
        date: 'Today',
        time: '03:00 PM',
        sessionType: 'Online',
        status: 'Scheduled',
        notes: 'Academic workload balance consultation',
      });
      console.log('Created today live sessions');
    }
  }

  console.log('Counseling services seed successful!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
