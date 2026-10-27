const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const User = require('../models/User');
const { defaultDepartments } = require('../config/seeder');

/**
 * @route   GET /api/departments/public
 * @desc    Get all active academic departments with HOD assignment status
 * @access  Public
 */
router.get('/public', async (req, res) => {
  try {
    let departments = await Department.find({}, 'name code description');
    if (!departments || departments.length === 0) {
      // Fallback in case DB query is empty during initial load
      departments = defaultDepartments.map((d, index) => ({
        _id: `dept_${index + 1}`,
        name: d.name,
        code: d.code,
      }));
    }

    // Check which departments already have an active HOD
    const hodUsers = await User.find(
      { role: { $in: ['hod', 'HOD'] } },
      'department name email'
    );

    const hodDeptMap = {};
    hodUsers.forEach((h) => {
      if (h.department) {
        hodDeptMap[h.department.trim().toLowerCase()] = h.name;
      }
    });

    const enriched = departments.map((d) => {
      const deptObj = d.toObject ? d.toObject() : { ...d };
      const currentHODName = hodDeptMap[deptObj.name.trim().toLowerCase()];
      return {
        ...deptObj,
        hasHOD: !!currentHODName,
        currentHODName: currentHODName || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Departments fetched successfully',
      data: enriched,
    });
  } catch (error) {
    // Return graceful fallback so the frontend dropdown NEVER fails
    return res.status(200).json({
      success: true,
      data: defaultDepartments.map((d, index) => ({
        _id: `dept_${index + 1}`,
        name: d.name,
        hasHOD: false,
        currentHODName: null,
      })),
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({});
    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
});

router.get('/:name/faculty', async (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.name);
    const query = {
      role: { $in: ['faculty', 'Faculty'] },
      department: { $regex: new RegExp(`^${rawName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    };

    const faculty = await User.find(query, 'name email role department designation employeeId subjectsTaught leaveBalances status createdAt');

    return res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch department faculty members.',
    });
  }
});

module.exports = router;
