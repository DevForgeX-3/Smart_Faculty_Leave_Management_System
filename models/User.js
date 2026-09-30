const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const leaveBalanceSchema = new mongoose.Schema(
  {
    casual: {
      type: Number,
      default: 12, // Standard annual casual leave quota
      min: 0,
    },
    sick: {
      type: Number,
      default: 10, // Medical/sick leave quota
      min: 0,
    },
    earned: {
      type: Number,
      default: 15, // Earned leave quota
      min: 0,
    },
    duty: {
      type: Number,
      default: 5, // Academic / duty leave quota
      min: 0,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid institutional email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Hidden by default from queries for security
    },
    role: {
      type: String,
      enum: {
        values: ['Faculty', 'HOD', 'Admin'],
        message: '{VALUE} is not a valid role. Allowed roles: Faculty, HOD, Admin',
      },
      default: 'Faculty', // Requirement: Crucially default to Faculty
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid status. Allowed status: Pending, Approved, Rejected',
      },
      default: 'Pending', // Requirement: Crucially default to Pending
    },
    leaveBalances: {
      type: leaveBalanceSchema,
      default: () => ({}),
    },

    // Extended professional fields from the registration onboarding UI
    employeeId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    subjectsTaught: {
      type: [String],
      default: [],
    },
    highestQualification: {
      type: String,
      trim: true,
    },
    dateOfJoining: {
      type: Date,
    },
    employmentType: {
      type: String,
      enum: ['Permanent', 'Contract', 'Visiting'],
      default: 'Permanent',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with bcryptjs before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Prevent double-hashing if already hashed by the controller/route
  if (/^\$2[aby]\$\d{2}\$/.test(this.password)) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to return user representation without sensitive fields
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
