const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    facultyName: {
      type: String,
      required: true,
      trim: true,
    },
    facultyEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      default: 'EMP-1001',
    },
    designation: {
      type: String,
      default: 'Faculty Member',
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    typeCode: {
      type: String,
      default: 'casual',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    proxy: {
      type: String,
      default: 'Assigned Department Proxy',
    },
    proxyDept: {
      type: String,
      default: 'Department Colleague',
    },
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending HOD', 'Approved', 'Rejected', 'Cancelled', 'pending', 'approved', 'rejected'],
      default: 'Pending HOD',
    },
    appliedAt: {
      type: String,
      default: () => new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    },
    hodName: {
      type: String,
      default: 'Head of Department',
    },
    hodRemarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
