const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const Management = require('../models/management/Management');
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash('password123', salt);

  // Update all existing managers
  const res = await Management.updateMany({}, { password: hash, isApproved: true, isActive: true });
  console.log('Updated existing managers count:', res.modifiedCount);

  // Ensure manager@gmail.com exists
  let mgr = await Management.findOne({ email: 'manager@gmail.com' });
  if (!mgr) {
    await Management.create({
      firstName: 'University',
      lastName: 'Manager',
      employeeId: 'MGR100',
      email: 'manager@gmail.com',
      department: 'Central Administration',
      position: 'Director of Student Affairs',
      password: 'password123',
      role: 'management',
      isApproved: true,
      isActive: true,
    });
    console.log('Created manager@gmail.com');
  }

  const all = await Management.find({}, 'email employeeId firstName lastName role isApproved');
  console.log('ALL MANAGERS:');
  all.forEach((m) => console.log(`- Email: ${m.email} | EmployeeID: ${m.employeeId} | Name: ${m.firstName} ${m.lastName}`));

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
