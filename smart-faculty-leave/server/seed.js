require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./src/config/db');
const Department = require('./src/models/Department');
const LeaveType = require('./src/models/LeaveType');
const User = require('./src/models/User');
const LeaveBalance = require('./src/models/LeaveBalance');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding data...');

    const defaultPassword = 'Password@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    // 1. Admin User
    let admin = await User.findOne({ email: 'admin@college.edu' });
    if (!admin) {
      admin = await User.create({
        fullName: 'System Admin',
        employeeId: 'ADM001',
        email: 'admin@college.edu',
        mobile: '9999999999',
        passwordHash,
        gender: 'other',
        department: null, // Temporary, admin doesn't need dept or we can assign one later
        designation: 'Professor',
        subjects: ['Admin'],
        joiningDate: new Date('2020-01-01'),
        employmentType: 'permanent',
        role: 'admin',
        status: 'active'
      });
    }

    // 2. Departments
    const depts = ['Computer Science', 'Physics'];
    const createdDepts = [];
    for (const name of depts) {
      let dept = await Department.findOne({ name });
      if (!dept) {
        dept = await Department.create({ name });
      }
      createdDepts.push(dept);
    }

    // Assign admin to the first dept just to pass validation if needed later
    if (!admin.department) {
      admin.department = createdDepts[0]._id;
      await admin.save();
    }

    // 3. HODs
    const hods = [];
    for (let i = 0; i < createdDepts.length; i++) {
      const dept = createdDepts[i];
      let hod = await User.findOne({ email: `hod${i+1}@college.edu` });
      if (!hod) {
        hod = await User.create({
          fullName: `HOD ${dept.name}`,
          employeeId: `HOD00${i+1}`,
          email: `hod${i+1}@college.edu`,
          mobile: `888888888${i}`,
          passwordHash,
          gender: 'male',
          department: dept._id,
          designation: 'Professor',
          subjects: [`${dept.name} 101`],
          joiningDate: new Date('2021-01-01'),
          employmentType: 'permanent',
          role: 'hod',
          status: 'active',
          reportingTo: admin._id
        });
      }
      dept.hod = hod._id;
      await dept.save();
      hods.push(hod);
    }

    // 4. Leave Types
    const leaveTypesData = [
      { name: 'Casual Leave', yearlyQuota: 12, maxConsecutiveDays: 3, isPaid: true },
      { name: 'Sick Leave', yearlyQuota: 10, maxConsecutiveDays: 5, isPaid: true },
      { name: 'Emergency Leave', yearlyQuota: 5, maxConsecutiveDays: 2, isPaid: true },
      { name: 'Paid Leave', yearlyQuota: 20, maxConsecutiveDays: 10, isPaid: true },
      { name: 'Unpaid Leave', yearlyQuota: 0, maxConsecutiveDays: 30, isPaid: false }
    ];

    const createdLeaveTypes = [];
    for (const lt of leaveTypesData) {
      let leaveType = await LeaveType.findOne({ name: lt.name });
      if (!leaveType) {
        leaveType = await LeaveType.create(lt);
      }
      createdLeaveTypes.push(leaveType);
    }

    // 5. Sample Faculty and Leave Balances
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < createdDepts.length; i++) {
      const dept = createdDepts[i];
      const hod = hods[i];
      for (let j = 1; j <= 2; j++) {
        const email = `faculty${i+1}_${j}@college.edu`;
        let faculty = await User.findOne({ email });
        if (!faculty) {
          faculty = await User.create({
            fullName: `Faculty ${j} ${dept.name}`,
            employeeId: `FAC${i+1}00${j}`,
            email,
            mobile: `77777777${i}${j}`,
            passwordHash,
            gender: 'female',
            department: dept._id,
            designation: 'Assistant Professor',
            subjects: [`${dept.name} 102`],
            joiningDate: new Date('2022-01-01'),
            employmentType: 'permanent',
            role: 'faculty',
            status: 'active',
            reportingTo: hod._id
          });

          // Create Leave Balances
          for (const lt of createdLeaveTypes) {
            await LeaveBalance.create({
              user: faculty._id,
              leaveType: lt._id,
              year: currentYear,
              total: lt.yearlyQuota,
              used: 0,
              remaining: lt.yearlyQuota
            });
          }
        }
      }
    }

    console.log('Seed completed successfully!');
    console.log('--- Demo Credentials ---');
    console.log(`Password for all: ${defaultPassword}`);
    console.log(`Admin: admin@college.edu`);
    console.log(`HOD 1: hod1@college.edu`);
    console.log(`HOD 2: hod2@college.edu`);
    console.log(`Faculty 1 CS: faculty1_1@college.edu`);
    console.log(`Faculty 2 CS: faculty1_2@college.edu`);
    console.log(`Faculty 1 Physics: faculty2_1@college.edu`);
    console.log(`Faculty 2 Physics: faculty2_2@college.edu`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
