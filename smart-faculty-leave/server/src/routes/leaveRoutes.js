const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate } = require('../middleware/auth');

// All leave routes require authentication
router.use(authenticate);

// Leave Types (Active only)
router.get('/types', leaveController.getActiveLeaveTypes);

// Leave Balances
router.get('/balances/me', leaveController.getMyBalances);

// Leave Requests
router.post('/', leaveController.applyLeave);
router.get('/me', leaveController.getMyLeaves);
router.get('/:id', leaveController.getLeaveDetails);

module.exports = router;
