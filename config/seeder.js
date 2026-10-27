const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');

const defaultDepartments = [
  { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science & Engineering' },
  { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
  { name: 'Electronics & Communication', code: 'ECE', description: 'Department of Electronics & Communication Engineering' },
  { name: 'Mechanical Engineering', code: 'ME', description: 'Department of Mechanical Engineering' },
  { name: 'Civil Engineering', code: 'CE', description: 'Department of Civil Engineering' },
  { name: 'Basic Sciences & Humanities', code: 'BSH', description: 'Department of Basic Sciences and Humanities' },
];

const seedDefaultData = async () => {
  try {
    // 1. Seed Departments if none exist
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      for (const dept of defaultDepartments) {
        await Department.create(dept);
      }
      console.log('✔ [Seeder]: Standard departments initialized.');
    }

    // 2. Seed Default Demo Users if none exist
    const facultyUser = await User.findOne({ email: 'faculty@college.edu' });
    if (!facultyUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Faculty@123', salt);
      await User.create({
        name: 'Dr. Eleanor Vance',
        email: 'faculty@college.edu',
        password: hashedPassword,
        department: 'Computer Science & Engineering',
        role: 'faculty',
        status: 'Approved',
        employeeId: 'EMP-1001',
        designation: 'Associate Professor',
        leaveBalances: { casual: 12, sick: 10, earned: 15, duty: 5 }
      });
      console.log('✔ [Seeder]: Demo Faculty account created (faculty@college.edu / Faculty@123)');
    }

    const hodUser = await User.findOne({ email: 'hod@college.edu' });
    if (!hodUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Hod@123', salt);
      await User.create({
        name: 'Prof. K. Ramanathan',
        email: 'hod@college.edu',
        password: hashedPassword,
        department: 'Computer Science & Engineering',
        role: 'hod',
        status: 'Approved',
        employeeId: 'HOD-2001',
        designation: 'Head of Department',
        leaveBalances: { casual: 15, sick: 12, earned: 20, duty: 8 }
      });
      console.log('✔ [Seeder]: Demo HOD account created (hod@college.edu / Hod@123)');
    }

    const adminUser = await User.findOne({ email: 'admin@college.edu' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      await User.create({
        name: 'System Administrator',
        email: 'admin@college.edu',
        password: hashedPassword,
        department: 'Administration',
        role: 'admin',
        status: 'Approved',
        employeeId: 'ADM-0001',
        designation: 'Chief Administrator',
        leaveBalances: { casual: 15, sick: 15, earned: 30, duty: 10 }
      });
      console.log('✔ [Seeder]: Demo Admin account created (admin@college.edu / Admin@123)');
    }
  } catch (err) {
    console.error('⚠ [Seeder Warning]:', err.message);
  }
};

module.exports = { seedDefaultData, defaultDepartments };
