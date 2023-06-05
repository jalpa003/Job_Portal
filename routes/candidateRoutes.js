const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidates');
const authenticateToken = require('../middleware/authenticateToken');

const multer = require('multer');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to create a candidate profile
router.post('/profile', upload.single('resume'), authenticateToken.authenticateToken, candidateController.createCandidateProfile);
// GET /candidates/profile - Get candidate profile
router.get('/profile', authenticateToken.authenticateToken, candidateController.getCandidateProfile);
//Get job listings
router.get('/joblistings', authenticateToken.authenticateToken, candidateController.getJobListing);
//Apply for a job
router.post('/apply/:jobId', authenticateToken.authenticateToken, candidateController.JobApply);


module.exports = router;
