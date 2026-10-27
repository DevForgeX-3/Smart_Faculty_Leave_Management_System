const LeaveType = require('../models/LeaveType');
const LeaveBalance = require('../models/LeaveBalance');
const LeaveRequest = require('../models/LeaveRequest');
const ApprovalHistory = require('../models/ApprovalHistory');

// Fetch all active leave types
exports.getActiveLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ isActive: true });
    res.json({ success: true, data: leaveTypes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Fetch current user's leave balances
exports.getMyBalances = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const balances = await LeaveBalance.find({ user: req.user._id, year: currentYear })
      .populate('leaveType', 'name isPaid');
    res.json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Apply for a leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start > end) {
      return res.status(400).json({ success: false, message: 'from date cannot be after to date' });
    }
    if (start < today) {
      return res.status(400).json({ success: false, message: 'Cannot apply for leave in the past' });
    }

    // Inclusive day count
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Validate leave type and max days
    const type = await LeaveType.findById(leaveType);
    if (!type || !type.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive leave type' });
    }
    if (totalDays > type.maxConsecutiveDays) {
      return res.status(400).json({ success: false, message: `Cannot exceed ${type.maxConsecutiveDays} consecutive days for this leave type` });
    }

    // Validate balance
    const currentYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({ user: req.user._id, leaveType, year: currentYear });
    
    if (!balance) {
      return res.status(400).json({ success: false, message: 'Leave balance record not found for this year' });
    }
    if (totalDays > balance.remaining) {
      return res.status(400).json({ success: false, message: `Insufficient balance. You only have ${balance.remaining} days remaining.` });
    }

    // Overlap detection
    const overlappingRequest = await LeaveRequest.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { fromDate: { $lte: end }, toDate: { $gte: start } }
      ]
    });

    if (overlappingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: `Conflict: You already have a ${overlappingRequest.status} leave request between ${overlappingRequest.fromDate.toISOString().split('T')[0]} and ${overlappingRequest.toDate.toISOString().split('T')[0]}.`
      });
    }

    // Create the leave request
    const request = await LeaveRequest.create({
      user: req.user._id,
      leaveType,
      fromDate: start,
      toDate: end,
      totalDays,
      reason,
      status: 'pending'
    });

    // Create approval history entry
    await ApprovalHistory.create({
      request: request._id,
      actor: req.user._id,
      action: 'submitted',
      remarks: 'Leave application submitted'
    });

    res.status(201).json({ success: true, message: 'Leave application submitted successfully', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Fetch current user's leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (type) query.leaveType = type;

    const leaves = await LeaveRequest.find(query)
      .populate('leaveType', 'name')
      .populate('approver', 'fullName')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Fetch specific leave details (including timeline)
exports.getLeaveDetails = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id)
      .populate('user', 'fullName employeeId department reportingTo')
      .populate('leaveType', 'name')
      .populate('approver', 'fullName');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    // Access control: User can view their own, HOD can view their reports', Admin can view all
    const isOwner = request.user._id.toString() === req.user._id.toString();
    const isApprover = request.user.reportingTo && request.user.reportingTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isApprover && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    const history = await ApprovalHistory.find({ request: request._id })
      .populate('actor', 'fullName role')
      .sort({ timestamp: 1 });

    res.json({ 
      success: true, 
      data: {
        request,
        timeline: history
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
