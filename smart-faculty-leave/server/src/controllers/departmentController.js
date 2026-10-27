const Department = require('../models/Department');

exports.getPublicDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}, 'id name');
    res.json({
      success: true,
      message: 'Departments fetched successfully',
      data: departments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
