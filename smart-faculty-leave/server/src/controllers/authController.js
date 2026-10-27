const User = require('../models/User');
const Department = require('../models/Department');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  employeeId: Joi.string().trim().required(),
  department: Joi.string().required(),
  designation: Joi.string().valid('Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer').required(),
  subjects: Joi.array().items(Joi.string()).min(1).required(),
  joiningDate: Joi.date().max('now').required(),
  employmentType: Joi.string().valid('permanent', 'contract', 'visiting').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
  qualification: Joi.string().allow('', null),
  photoUrl: Joi.string().allow('', null)
}).unknown(true);

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        errors: error.details.map(err => ({ field: err.path[0], message: err.message })) 
      });
    }

    const { fullName, gender, mobile, employeeId, department, designation, subjects, joiningDate, employmentType, email, password, qualification, photoUrl } = value;

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ success: false, message: 'This Employee ID is already registered. Contact the admin office if this is a mistake.' });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ success: false, message: 'Department not found' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      gender,
      mobile,
      employeeId,
      department,
      designation,
      subjects,
      joiningDate,
      employmentType,
      email: email.toLowerCase(),
      passwordHash,
      qualification,
      photoUrl,
      role: 'faculty', // Force role
      status: 'pending' // Force status
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted. Your account will be activated after admin approval.',
      data: {
        fullName: newUser.fullName,
        employeeId: newUser.employeeId,
        department: newUser.department
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide identifier and password' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { employeeId: identifier }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Your account is awaiting admin approval' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your registration was rejected. Contact the admin office' });
    }
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account is inactive. Contact the admin office' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    const userProfile = user.toObject();
    delete userProfile.passwordHash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userProfile
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    message: 'User profile fetched successfully',
    data: req.user
  });
};
