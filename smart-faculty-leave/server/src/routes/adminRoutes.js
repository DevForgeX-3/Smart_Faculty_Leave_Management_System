const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// All routes here require user to be authenticated AND have 'admin' role
router.use(authenticate, authorizeRoles('admin'));

// User Management
router.get('/users/pending', adminController.getPendingUsers);
router.patch('/users/:id/approve', adminController.approveUser);
router.patch('/users/:id/reject', adminController.rejectUser);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUser);

// Department Management
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.put('/departments/:id', adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Leave Type Management
router.get('/leave-types', adminController.getLeaveTypes);
router.post('/leave-types', adminController.createLeaveType);
router.put('/leave-types/:id', adminController.updateLeaveType);
router.delete('/leave-types/:id', adminController.deleteLeaveType);

module.exports = router;
