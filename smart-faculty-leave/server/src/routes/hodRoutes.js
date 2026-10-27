const express = require('express');
const router = express.Router();
const hodController = require('../controllers/hodController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// All routes require authentication AND 'hod' role
router.use(authenticate, authorizeRoles('hod', 'admin')); // Including admin just in case admin needs HOD privileges on some direct reports

// Leave Management for direct reports
router.get('/leaves/pending', hodController.getPendingLeaves);
router.get('/leaves', hodController.getAllLeaves);
router.patch('/leaves/:id/approve', hodController.approveLeave);
router.patch('/leaves/:id/reject', hodController.rejectLeave);

module.exports = router;
