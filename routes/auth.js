const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * Generate JWT token helper
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_smart_faculty_leave_jwt_token_key_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new faculty member (defaults to Role: Faculty, Status: Pending)
 * @access  Public (Pre-login Onboarding)
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      // Optional professional fields from onboarding screen
      employeeId,
      designation,
      subjectsTaught,
      highestQualification,
      dateOfJoining,
      employmentType,
    } = req.body;

    // 1. Validation: Ensure required fields are present
    const missingFields = [];
    if (!name || !name.trim()) missingFields.push('name');
    if (!email || !email.trim()) missingFields.push('email');
    if (!password || !password.trim()) missingFields.push('password');
    if (!department || !department.trim()) missingFields.push('department');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Missing required fields (${missingFields.join(', ')})`,
        missingFields,
      });
    }

    // Basic email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Please provide a valid email address',
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Validation: Check if duplicate email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address is already registered.',
      });
    }

    // 3. Validation: Check if Employee ID already exists (as shown in onboarding UI)
    if (employeeId && employeeId.trim()) {
      const existingEmployee = await User.findOne({ employeeId: employeeId.trim() });
      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message: 'This Employee ID is already registered. Contact the admin office if this is a mistake.',
        });
      }
    }

    // 4. Securely hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Default Leave Balances
    const defaultLeaveBalances = {
      casual: 12,
      sick: 10,
      earned: 15,
      duty: 5,
    };

    // 6. Create User record
    // CRITICAL: Overriding role and status to strictly enforce default Faculty & Pending
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      department: department.trim(),
      role: 'Faculty',       // Crucially defaulted to Faculty
      status: 'Pending',     // Crucially defaulted to Pending
      leaveBalances: defaultLeaveBalances,

      // Onboarding fields if provided
      employeeId: employeeId ? employeeId.trim() : undefined,
      designation: designation ? designation.trim() : undefined,
      subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : [],
      highestQualification: highestQualification ? highestQualification.trim() : undefined,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      employmentType: employmentType || 'Permanent',
    });

    await newUser.save();

    // 7. Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    // 8. Return success response (password is omitted by User.toJSON())
    return res.status(201).json({
      success: true,
      message: 'Faculty account created successfully. Your account is pending admin approval.',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('[Registration Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating faculty account.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Faculty/Staff Login with JWT Token generation
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'Pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for an administrator to activate it.',
      });
    }

    if (user.status === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your registration request was rejected. Please contact the administrative office.',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user,
      token,
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated faculty profile from JWT token
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
      error: error.message,
    });
  }
});

module.exports = router;
