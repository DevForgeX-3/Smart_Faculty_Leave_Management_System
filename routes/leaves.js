const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/leaves/my-leaves
 * @desc    Get leave applications for authenticated faculty (or by email query)
 */
router.get('/my-leaves', async (req, res) => {
  try {
    let email = req.query.email;
    if (!email && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_smart_faculty_leave_jwt_token_key_2026_xyz');
        const user = await User.findById(decoded.id);
        if (user) email = user.email;
      } catch {}
    }

    if (!email) {
      email = 'faculty@college.edu';
    }

    const leaves = await LeaveRequest.find({ facultyEmail: email.toLowerCase().trim() }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch leaves.' });
  }
});

/**
 * @route   POST /api/leaves/apply
 * @desc    Submit a new leave application
 */
router.post('/apply', async (req, res) => {
  try {
    const {
      facultyName,
      facultyEmail,
      department,
      employeeId,
      designation,
      type,
      leaveType,
      typeCode,
      startDate,
      endDate,
      days,
      proxy,
      proxyFaculty,
      proxyDept,
      reason,
    } = req.body;

    const actualType = (type || leaveType || 'Casual Leave').trim();
    const actualProxy = (proxy || proxyFaculty || 'Department Colleague').trim();

    if (!facultyName || !facultyEmail || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required leave application fields.',
      });
    }

    const newLeave = await LeaveRequest.create({
      facultyName: facultyName.trim(),
      facultyEmail: facultyEmail.toLowerCase().trim(),
      department: (department || 'Computer Science & Engineering').trim(),
      employeeId: employeeId || 'EMP-1001',
      designation: designation || 'Faculty Member',
      type: actualType,
      typeCode: (typeCode || 'casual').toLowerCase(),
      startDate,
      endDate,
      days: Number(days) || 1,
      proxy: actualProxy,
      proxyDept: proxyDept ? proxyDept.trim() : 'Academic Department',
      reason: reason ? reason.trim() : 'Personal / Medical Leave',
      status: 'Pending HOD',
      appliedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    });

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: newLeave,
      leave: newLeave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit leave application.' });
  }
});

/**
 * @route   GET /api/leaves/department
 * @desc    Get all leave applications for an HOD's department
 */
router.get('/department', async (req, res) => {
  try {
    let department = req.query.department;
    if (!department && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_smart_faculty_leave_jwt_token_key_2026_xyz');
        const user = await User.findById(decoded.id);
        if (user && user.department) department = user.department;
      } catch {}
    }

    const query = department
      ? { department: { $regex: new RegExp(`^${department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
      : {};

    const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch department leaves.' });
  }
});

/**
 * @route   PATCH /api/leaves/:id/status
 * @desc    HOD / Admin updates leave application status (Approved or Rejected)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, remarks, hodName } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave application not found.' });
    }

    leave.status = status || 'Approved';
    if (remarks) leave.hodRemarks = remarks;
    if (hodName) leave.hodName = hodName;

    await leave.save();

    return res.status(200).json({
      success: true,
      message: `Leave application marked as ${leave.status}.`,
      data: leave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update leave status.' });
  }
});

/**
 * @route   PATCH /api/leaves/:id/cancel
 * @desc    Faculty cancels their own pending leave application
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave application not found.' });
    }

    leave.status = 'Cancelled';
    await leave.save();

    return res.status(200).json({
      success: true,
      message: 'Leave application cancelled successfully.',
      data: leave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel leave application.' });
  }
});

/**
 * @route   GET /api/leaves/all
 * @desc    Get all leave applications across the institution (for Admin)
 */
router.get('/all', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch all leaves.' });
  }
});

module.exports = router;
