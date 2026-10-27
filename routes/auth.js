const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
const { protect, authorize } = require('../middleware/auth');

/**
 * Generate JWT token helper
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role: (role || 'faculty').toLowerCase() },
    process.env.JWT_SECRET || 'supersecret_smart_faculty_leave_jwt_token_key_2026_xyz',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Helper to normalize user response (strips sensitive fields)
 */
const formatUserResponse = (user) => {
  const userObj = user.toJSON ? user.toJSON() : { ...user };
  delete userObj.password;
  userObj.role = (userObj.role || 'faculty').toLowerCase();
  if (!userObj.fullName && userObj.name) {
    userObj.fullName = userObj.name;
  }
  return userObj;
};

/**
 * @route   POST /api/auth/register
 * @desc    Public faculty registration (or Admin provisioning if caller has admin token)
 * @access  Public (Enforced to Faculty role for public requests)
 */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      password,
      department,
      role = 'faculty',
      employeeId,
      designation,
      subjectsTaught,
      subjects,
      highestQualification,
      employmentType,
    } = req.body;

    const actualName = (name || fullName || '').trim();
    const actualEmail = (email || '').toLowerCase().trim();
    const actualPassword = (password || '').trim();
    const actualDept = (department || '').trim();
    const requestedRole = (role || 'faculty').toLowerCase();

    // 1. Validation: Ensure required fields are present
    const missingFields = [];
    if (!actualName) missingFields.push('Full Name');
    if (!actualEmail) missingFields.push('Email');
    if (!actualPassword) missingFields.push('Password');
    if (!actualDept) missingFields.push('Department');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please fill in all required fields: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    // 2. Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(actualEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid institutional email address (e.g. name@college.edu)',
      });
    }

    // 3. Password length validation
    if (actualPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 4. Role Security: Check if request has authenticated Admin credentials
    let isAuthorizedAdmin = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const callerToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          callerToken,
          process.env.JWT_SECRET || 'supersecret_smart_faculty_leave_jwt_token_key_2026_xyz'
        );
        const caller = await User.findById(decoded.id);
        if (caller && (caller.role || '').toLowerCase() === 'admin') {
          isAuthorizedAdmin = true;
        }
      } catch {
        isAuthorizedAdmin = false;
      }
    }

    // Enforce role security: Only Admin is locked from public registration
    if (!isAuthorizedAdmin && requestedRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be registered publicly. They must be provisioned through an authorized administrative process.',
      });
    }

    // Public registration allows Faculty and HOD; defaults to Faculty
    const finalRole = isAuthorizedAdmin 
      ? requestedRole 
      : (requestedRole === 'hod' ? 'hod' : 'faculty');

    // 5. Enforce uniqueness: Check if email already exists
    const existingUser = await User.findOne({ email: actualEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    // 6. Enforce 1 HOD per Department Rule (when an Admin provisions an HOD)
    if (finalRole === 'hod') {
      const existingHOD = await User.findOne({
        department: { $regex: new RegExp(`^${actualDept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        role: { $in: ['hod', 'HOD'] },
      });

      if (existingHOD) {
        return res.status(409).json({
          success: false,
          message: `The Department of "${actualDept}" already has an assigned Head of Department (${existingHOD.name}). Only 1 HOD is permitted per department.`,
        });
      }
    }

    // 7. Optional Employee ID generation
    const generatedEmpId = employeeId && employeeId.trim()
      ? employeeId.trim()
      : 'EMP-' + Math.floor(1000 + Math.random() * 9000);

    // Default leave quota for faculty
    const defaultLeaveBalances = {
      casual: 12,
      sick: 10,
      earned: 15,
      duty: 5,
    };

    // 8. Create User document (pre-save hook hashes password securely)
    const newUser = new User({
      name: actualName,
      email: actualEmail,
      password: actualPassword,
      department: actualDept,
      role: finalRole,
      status: 'Approved',
      employeeId: generatedEmpId,
      designation: designation ? designation.trim() : (finalRole === 'hod' ? 'Head of Department' : 'Faculty Member'),
      subjectsTaught: Array.isArray(subjectsTaught) ? subjectsTaught : (Array.isArray(subjects) ? subjects : []),
      highestQualification: highestQualification ? highestQualification.trim() : undefined,
      employmentType: employmentType || 'Permanent',
      leaveBalances: defaultLeaveBalances,
    });

    await newUser.save();

    // Link HOD to Department record if applicable
    if (finalRole === 'hod') {
      await Department.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${actualDept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { HOD_Id: newUser._id }
      ).catch(() => {});
    }

    // 9. Generate JWT token
    const token = generateToken(newUser._id, newUser.role);
    const formattedUser = formatUserResponse(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! You can now access your dashboard.',
      user: formattedUser,
      token,
      data: {
        user: formattedUser,
        token,
      },
    });
  } catch (error) {
    console.error('[Registration Error]:', error.message);

    // Handle database duplicate key error gracefully
    if (error.code === 11000 || error.name === 'MongoServerError') {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating account.',
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Faculty / HOD / Admin login with credential validation & JWT issuance
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginIdentifier = (email || identifier || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/ID and password.',
      });
    }

    // Generic error message to prevent user enumeration
    const genericInvalidMsg = 'Invalid email or password. Please verify your credentials and try again.';

    // Look up user by normalized email or employeeId
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { employeeId: loginIdentifier },
        { name: new RegExp('^' + loginIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: genericInvalidMsg,
      });
    }

    // Verify password via bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: genericInvalidMsg,
      });
    }

    // Verify account approval status
    if (user.status === 'Pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account registration is currently pending administrative approval. Please contact the administrator.',
      });
    }

    if (user.status === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact the administrative office.',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    const formattedUser = formatUserResponse(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: formattedUser,
      token,
      data: {
        user: formattedUser,
        token,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated profile from JWT token
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const formattedUser = formatUserResponse(req.user);
    return res.status(200).json({
      success: true,
      user: formattedUser,
      data: formattedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user profile (role and status cannot be updated)
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    // Explicitly reject/ignore attempts to alter role, status, or email
    const {
      name,
      fullName,
      mobile,
      photoUrl,
      designation,
      subjectsTaught,
      highestQualification,
      department,
      dob,
      gender,
      bloodGroup,
      alternateEmail,
      cabinRoom,
      residentialAddress,
      currentCity,
      currentState,
      postalCode,
      emergencyContactName,
      emergencyContactPhone,
      almaMater,
      specialization,
      orcidId,
      scopusId,
      biometricId,
      employmentType,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name || fullName) user.name = (name || fullName).trim();
    if (mobile !== undefined) user.mobile = typeof mobile === 'string' ? mobile.trim() : mobile;
    if (photoUrl !== undefined) user.photoUrl = photoUrl;
    if (designation !== undefined) user.designation = designation.trim();
    if (department !== undefined) user.department = department.trim();
    if (highestQualification !== undefined) user.highestQualification = highestQualification.trim();
    if (dob !== undefined) user.dob = dob.trim();
    if (gender !== undefined) user.gender = gender.trim();
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup.trim();
    if (alternateEmail !== undefined) user.alternateEmail = alternateEmail.trim();
    if (cabinRoom !== undefined) user.cabinRoom = cabinRoom.trim();
    if (residentialAddress !== undefined) user.residentialAddress = residentialAddress.trim();
    if (currentCity !== undefined) user.currentCity = currentCity.trim();
    if (currentState !== undefined) user.currentState = currentState.trim();
    if (postalCode !== undefined) user.postalCode = postalCode.trim();
    if (emergencyContactName !== undefined) user.emergencyContactName = emergencyContactName.trim();
    if (emergencyContactPhone !== undefined) user.emergencyContactPhone = emergencyContactPhone.trim();
    if (almaMater !== undefined) user.almaMater = almaMater.trim();
    if (specialization !== undefined) user.specialization = specialization.trim();
    if (orcidId !== undefined) user.orcidId = orcidId.trim();
    if (scopusId !== undefined) user.scopusId = scopusId.trim();
    if (biometricId !== undefined) user.biometricId = biometricId.trim();
    if (employmentType !== undefined) user.employmentType = employmentType.trim();

    if (subjectsTaught) {
      user.subjectsTaught = Array.isArray(subjectsTaught)
        ? subjectsTaught
        : subjectsTaught.split(',').map((s) => s.trim()).filter(Boolean);
    }

    await user.save();
    const formattedUser = formatUserResponse(user);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: formattedUser,
      data: formattedUser,
    });
  } catch (error) {
    console.error('[Profile Update Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
});

/**
 * @route   PUT /api/auth/password
 * @desc    Change authenticated user password
 * @access  Private
 */
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    console.error('[Change Password Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password.',
    });
  }
});

/**
 * @route   POST /api/auth/admin/provision
 * @desc    Admin-only endpoint to provision HOD, Admin, or Faculty accounts
 * @access  Private (Admin only)
 */
router.post('/admin/provision', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, department, role, employeeId, designation } = req.body;

    if (!name || !email || !password || !department || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, department, and role are required for provisioning.',
      });
    }

    const normalizedRole = role.toLowerCase();
    const actualEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: actualEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    if (normalizedRole === 'hod') {
      const existingHOD = await User.findOne({
        department: { $regex: new RegExp(`^${department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        role: { $in: ['hod', 'HOD'] },
      });

      if (existingHOD) {
        return res.status(409).json({
          success: false,
          message: `The Department of "${department}" already has an assigned Head of Department (${existingHOD.name}).`,
        });
      }
    }

    const newUser = new User({
      name: name.trim(),
      email: actualEmail,
      password: password.trim(),
      department: department.trim(),
      role: normalizedRole,
      status: 'Approved',
      employeeId: employeeId ? employeeId.trim() : 'EMP-' + Math.floor(1000 + Math.random() * 9000),
      designation: designation ? designation.trim() : (normalizedRole === 'hod' ? 'Head of Department' : 'Faculty Member'),
    });

    await newUser.save();

    if (normalizedRole === 'hod') {
      await Department.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { HOD_Id: newUser._id }
      ).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: `Account provisioned successfully for ${newUser.name} as ${newUser.role.toUpperCase()}.`,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to provision account.',
    });
  }
});

/**
 * @route   GET /api/auth/admin/users
 * @desc    Admin-only endpoint to view all system users and statuses
 * @access  Private (Admin only)
 */
router.get('/admin/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role department status employeeId designation createdAt');
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(formatUserResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user list.',
    });
  }
});

/**
 * @route   PATCH /api/auth/admin/users/:id/status
 * @desc    Admin-only endpoint to update user status (Approved, Rejected, Pending)
 * @access  Private (Admin only)
 */
router.patch('/admin/users/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Approved, Rejected, Pending',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status.',
    });
  }
});

/**
 * @route   GET /api/auth/hod/faculty
 * @desc    HOD and Admin-only endpoint to list faculty members in HOD's department
 * @access  Private (HOD, Admin)
 */
router.get('/hod/faculty', protect, authorize('hod', 'admin'), async (req, res) => {
  try {
    const query = { role: 'faculty' };
    if (req.user.role.toLowerCase() === 'hod' && req.user.department) {
      query.department = req.user.department;
    }

    const facultyList = await User.find(query, 'name email role department employeeId designation leaveBalances');
    return res.status(200).json({
      success: true,
      department: req.user.department,
      count: facultyList.length,
      data: facultyList.map(formatUserResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch department faculty list.',
    });
  }
});

module.exports = router;
