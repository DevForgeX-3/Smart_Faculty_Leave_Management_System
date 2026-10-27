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
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
        values: ['Faculty', 'HOD', 'Admin', 'faculty', 'hod', 'admin'],
        message: '{VALUE} is not a valid role. Allowed roles: Faculty, HOD, Admin',
      },
      default: 'faculty',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected', 'active', 'approved'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Approved',
    },
    leaveBalances: {
      type: leaveBalanceSchema,
      default: () => ({}),
    },

    // Extended professional fields from the registration onboarding UI
    mobile: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
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
      default: 'Permanent',
    },
    dob: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    alternateEmail: {
      type: String,
      trim: true,
    },
    cabinRoom: {
      type: String,
      trim: true,
    },
    residentialAddress: {
      type: String,
      trim: true,
    },
    currentCity: {
      type: String,
      trim: true,
    },
    currentState: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    emergencyContactName: {
      type: String,
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
    },
    almaMater: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    orcidId: {
      type: String,
      trim: true,
    },
    scopusId: {
      type: String,
      trim: true,
    },
    biometricId: {
      type: String,
      trim: true,
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
  if (userObject.role) {
    userObject.role = userObject.role.toLowerCase();
  }
  if (!userObject.fullName && userObject.name) {
    userObject.fullName = userObject.name;
  }
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
