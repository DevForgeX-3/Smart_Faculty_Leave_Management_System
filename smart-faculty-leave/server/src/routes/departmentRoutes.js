const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/public', departmentController.getPublicDepartments);

module.exports = router;
