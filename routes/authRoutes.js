const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Candidate Signup
router.post('/candidates/signup', authController.candidateSignup);

// Candidate Login
router.post('/candidates/login', authController.candidateLogin);

// Company Signup
router.post('/companies/signup', authController.companySignup);

// Company Login
router.post('/companies/login', authController.companyLogin);

// Verify Token
router.get('/verifyToken', authController.verifyToken);

// Get User Data
router.get('/getUserData', authenticateToken.authenticateToken, authController.getUserData);

module.exports = router;
