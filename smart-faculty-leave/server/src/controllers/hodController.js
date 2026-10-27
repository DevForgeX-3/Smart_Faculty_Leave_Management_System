const mongoose = require('mongoose');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const ApprovalHistory = require('../models/ApprovalHistory');

// Fetch pending leave requests for users reporting to this HOD
exports.getPendingLeaves = async (req, res) => {
  try {
    // Find all users who report to this HOD
    const directReports = await User.find({ reportingTo: req.user._id }).select('_id');
    const directReportIds = directReports.map(u => u._id);

    const pendingLeaves = await LeaveRequest.find({
      user: { $in: directReportIds },
      status: 'pending'
    })
      .populate('user', 'fullName employeeId')
      .populate('leaveType', 'name')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: pendingLeaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Fetch all leaves (any status) from users reporting to this HOD
exports.getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const directReports = await User.find({ reportingTo: req.user._id }).select('_id');
    const directReportIds = directReports.map(u => u._id);

    const query = { user: { $in: directReportIds } };
    if (status) query.status = status;

    const leaves = await LeaveRequest.find(query)
      .populate('user', 'fullName employeeId')
      .populate('leaveType', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Approve a leave request (Uses MongoDB Transactions)
exports.approveLeave = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { remarks } = req.body;
    
    // Ensure the request is pending and belongs to a direct report
    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('user').session(session);
    
    if (!leaveRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (leaveRequest.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: `Cannot approve a request that is already ${leaveRequest.status}` });
    }

    if (leaveRequest.user.reportingTo.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: 'Not authorized to approve this request (User does not report to you)' });
    }

    // Update Leave Balance
    const currentYear = new Date(leaveRequest.fromDate).getFullYear();
    const balance = await LeaveBalance.findOne({
      user: leaveRequest.user._id,
      leaveType: leaveRequest.leaveType,
      year: currentYear
    }).session(session);

    if (!balance) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Leave balance not found' });
    }

    if (balance.remaining < leaveRequest.totalDays) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Insufficient leave balance to approve this request' });
    }

    balance.used += leaveRequest.totalDays;
    balance.remaining -= leaveRequest.totalDays;
    await balance.save({ session });

    // Update Leave Request
    leaveRequest.status = 'approved';
    leaveRequest.approver = req.user._id;
    leaveRequest.approverRemarks = remarks || '';
    leaveRequest.decidedAt = new Date();
    await leaveRequest.save({ session });

    // Add to Approval History
    await ApprovalHistory.create([{
      request: leaveRequest._id,
      actor: req.user._id,
      action: 'approved',
      remarks: remarks || 'Leave approved'
    }], { session });

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'Leave request approved successfully', data: leaveRequest });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: 'Server error during transaction', error: err.message });
  }
};

// Reject a leave request
exports.rejectLeave = async (req, res) => {
  try {
    const { remarks } = req.body;
    
    if (!remarks) {
      return res.status(400).json({ success: false, message: 'Remarks (rejection reason) are required when rejecting a leave' });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('user');
    
    if (!leaveRequest) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Cannot reject a request that is already ${leaveRequest.status}` });
    }

    if (leaveRequest.user.reportingTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this request (User does not report to you)' });
    }

    // Update Leave Request
    leaveRequest.status = 'rejected';
    leaveRequest.approver = req.user._id;
    leaveRequest.approverRemarks = remarks;
    leaveRequest.decidedAt = new Date();
    await leaveRequest.save();

    // Add to Approval History
    await ApprovalHistory.create({
      request: leaveRequest._id,
      actor: req.user._id,
      action: 'rejected',
      remarks
    });

    res.json({ success: true, message: 'Leave request rejected', data: leaveRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
