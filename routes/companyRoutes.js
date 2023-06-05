const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company');
const JobController = require('../controllers/jobs');
const authenticateToken = require('../middleware/authenticateToken');

// Route to create a company profile
router.post('/register', authenticateToken.authenticateToken, companyController.createCompanyProfile);
router.post('/jobPost/:companyId', authenticateToken.authenticateToken, JobController.createJob);
// Route to get the total number of job postings by a company
router.get('/:companyId/totalJobPostings', authenticateToken.authenticateToken, companyController.getTotalJobPostings);

// Route to get the list of all jobs posted by a company
router.get('/:companyId/jobPostings', authenticateToken.authenticateToken, companyController.getAllJobs);

// Route to check if the user has already registered a company
router.get('/check-registration', authenticateToken.authenticateToken, companyController.checkCompanyRegistration);

// Route to get the company details based on the user ID
router.get('/users/:userId/company', authenticateToken.authenticateToken, companyController.getCompanyByUserId);


module.exports = router;
