const User = require('../models/User');
const Department = require('../models/Department');
const LeaveType = require('../models/LeaveType');
const LeaveBalance = require('../models/LeaveBalance');

// --- USER MANAGEMENT ---

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).populate('department', 'name').select('-passwordHash');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { department, reportingTo, role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'User is not in pending status' });
    }

    user.department = department || user.department;
    user.reportingTo = reportingTo || user.reportingTo;
    user.role = role || 'faculty';
    user.status = 'active';

    await user.save();

    // Auto-create LeaveBalance records for active LeaveTypes
    const activeLeaveTypes = await LeaveType.find({ isActive: true });
    const currentYear = new Date().getFullYear();
    
    for (const lt of activeLeaveTypes) {
      await LeaveBalance.create({
        user: user._id,
        leaveType: lt._id,
        year: currentYear,
        total: lt.yearlyQuota,
        used: 0,
        remaining: lt.yearlyQuota
      });
    }

    res.json({ success: true, message: 'User approved and leave balances created', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'rejected';
    user.rejectionReason = reason;
    await user.save();

    res.json({ success: true, message: 'User registration rejected', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, department, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    const users = await User.find(query).populate('department', 'name').select('-passwordHash');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { department, designation, reportingTo, employmentType, status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { department, designation, reportingTo, employmentType, status },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// --- DEPARTMENT MANAGEMENT ---

exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find().populate('hod', 'fullName email');
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, message: 'Department created', data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department updated', data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    // Only allow deletion if no users are assigned to this department
    const usersInDept = await User.countDocuments({ department: req.params.id });
    if (usersInDept > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete department with assigned users' });
    }

    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// --- LEAVE TYPE MANAGEMENT ---

exports.getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find();
    res.json({ success: true, data: leaveTypes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.create(req.body);
    res.status(201).json({ success: true, message: 'Leave Type created', data: leaveType });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!leaveType) {
      return res.status(404).json({ success: false, message: 'Leave Type not found' });
    }
    res.json({ success: true, message: 'Leave Type updated', data: leaveType });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteLeaveType = async (req, res) => {
  try {
    // Soft delete if balances exist
    const balancesExist = await LeaveBalance.exists({ leaveType: req.params.id });
    
    if (balancesExist) {
      const leaveType = await LeaveType.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
      if (!leaveType) {
        return res.status(404).json({ success: false, message: 'Leave Type not found' });
      }
      return res.json({ success: true, message: 'Leave Type deactivated (soft delete) due to existing balances', data: leaveType });
    } else {
      const leaveType = await LeaveType.findByIdAndDelete(req.params.id);
      if (!leaveType) {
        return res.status(404).json({ success: false, message: 'Leave Type not found' });
      }
      return res.json({ success: true, message: 'Leave Type permanently deleted' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
