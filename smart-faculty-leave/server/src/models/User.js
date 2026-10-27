const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: function() { return this.role !== 'admin'; },
    },
    designation: {
      type: String,
      enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer'],
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
      validate: [v => v.length > 0, 'At least one subject is required'],
    },
    qualification: {
      type: String,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ['permanent', 'contract', 'visiting'],
      required: true,
    },
    photoUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ['faculty', 'hod', 'admin'],
      default: 'faculty',
    },
    reportingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'inactive'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
