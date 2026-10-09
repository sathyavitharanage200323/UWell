const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Counselor = require('../models/counselor/Counselor');
const Appointment = require('../models/counselor/Appointment');
const Student = require('../models/student/Student');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // CNS2024001 and CNS2024002 status is NOT touched here — preserves any
  // status set by team members on the shared database.

  // Add Dr. Sarah Perera if not exists — guarded by staffId lookup
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
      profileImage: 'https://ui-avatars.com/api/?name=Sarah+Perera&background=FCE3DD&color=EF806B&size=200&bold=true',
    });
    console.log('Created Dr. Sarah Perera');
  } else {
    // Backfill profileImage if missing on existing record
    if (!sarah.profileImage) {
      await Counselor.updateOne({ _id: sarah._id }, { profileImage: 'https://ui-avatars.com/api/?name=Sarah+Perera&background=FCE3DD&color=EF806B&size=200&bold=true' });
      console.log('Updated Dr. Sarah Perera profileImage');
    }
  }

  // Add Dr. Kavindu Silva if not exists — guarded by staffId lookup
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
      profileImage: 'https://ui-avatars.com/api/?name=Kavindu+Silva&background=DCE8DE&color=557B60&size=200&bold=true',
    });
    console.log('Created Dr. Kavindu Silva');
  } else {
    // Backfill profileImage if missing on existing record
    if (!kavindu.profileImage) {
      await Counselor.updateOne({ _id: kavindu._id }, { profileImage: 'https://ui-avatars.com/api/?name=Kavindu+Silva&background=DCE8DE&color=557B60&size=200&bold=true' });
      console.log('Updated Dr. Kavindu Silva profileImage');
    }
  }

  // Re-fetch in case they already existed (sarah/_id needed below)
  if (!sarah) sarah = await Counselor.findOne({ staffId: 'CNS2024003' });
  if (!kavindu) kavindu = await Counselor.findOne({ staffId: 'CNS2024004' });

  // Seed demo appointments — guard by counselor ObjectId to avoid duplicates
  // across re-runs and across different calendar days.
  const student = await Student.findOne();
  if (student && sarah && kavindu) {
    const existingDemo = await Appointment.findOne({
      counselor: sarah._id,
      notes: 'Exam stress & anxiety management session',
    });
    if (!existingDemo) {
      await Appointment.create({
        student: student._id,
        studentName: 'Lily Fernando',
        counselor: sarah._id,
        counselorName: `${sarah.firstName} ${sarah.lastName}`,
        counselorSpecialization: sarah.specialization,
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
        counselorName: `${kavindu.firstName} ${kavindu.lastName}`,
        counselorSpecialization: kavindu.specialization,
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
        counselorName: `${sarah.firstName} ${sarah.lastName}`,
        counselorSpecialization: sarah.specialization,
        date: 'Today',
        time: '03:00 PM',
        sessionType: 'Online',
        status: 'Scheduled',
        notes: 'Academic workload balance consultation',
      });
      console.log('Created demo live sessions');
    } else {
      console.log('Demo sessions already exist — skipped');
    }
  }

  console.log('Counseling services seed successful!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
