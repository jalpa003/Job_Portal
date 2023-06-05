const Candidate = require('../models/candidate');
const Company = require('../models/company');
const { validationResult } = require('express-validator');

// Create a new candidate
const createCandidateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            workExperience,
            desiredJobType,
            desiredWorkSchedule,
            distanceFromAddress,
        } = req.body;

        const errors = validationResult(req);

        // Check if there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        const { buffer } = req.file;

        // Retrieve user ID from token
        const userId = req.user.userId;

        // Check if candidate profile already exists for the user
        let candidate = await Candidate.findOne({ user: userId });

        if (candidate) {
            // Update the existing candidate profile
            candidate.firstName = firstName;
            candidate.lastName = lastName;
            candidate.email = email;
            candidate.phone = phone;
            candidate.workExperience = workExperience;
            candidate.desiredJobType = desiredJobType;
            candidate.desiredWorkSchedule = desiredWorkSchedule;
            candidate.distanceFromAddress = distanceFromAddress;
            candidate.resume = buffer;
        } else {
            // Create a new candidate profile using the Candidate model
            candidate = new Candidate({
                firstName,
                lastName,
                email,
                phone,
                workExperience,
                desiredJobType,
                desiredWorkSchedule,
                distanceFromAddress,
                resume: buffer,
                user: userId,
            });
        }

        // Save the candidate profile to the database
        await candidate.save();

        res.status(201).json({ message: 'Candidate profile created!', candidate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create candidate profile' });
    }
};

// Update candidate profile
const updateCandidateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            workExperience,
            desiredJobType,
            desiredWorkSchedule,
            distanceFromAddress,
        } = req.body;

        const errors = validationResult(req);

        // Check if there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        const { buffer } = req.file;

        // Retrieve user ID from token
        const userId = req.user.userId;

        // Find the candidate profile based on the user ID
        let candidate = await Candidate.findOne({ user: userId });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate profile not found' });
        }

        // Update the candidate profile fields
        candidate.firstName = firstName;
        candidate.lastName = lastName;
        candidate.email = email;
        candidate.phone = phone;
        candidate.workExperience = workExperience;
        candidate.desiredJobType = desiredJobType;
        candidate.desiredWorkSchedule = desiredWorkSchedule;
        candidate.distanceFromAddress = distanceFromAddress;
        candidate.resume = buffer;

        // Save the updated candidate profile to the database
        await candidate.save();

        res.json({ message: 'Candidate profile updated!', candidate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update candidate profile' });
    }
};

// Get all candidates
const getAllCandidates = async () => {
    try {
        const candidates = await Candidate.find();
        return candidates;
    } catch (error) {
        throw new Error('Failed to fetch candidates');
    }
};

// Get candidate profile by user ID
const getCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming you have the user ID from the authenticated user

        // Find the candidate profile by user ID
        const candidate = await Candidate.findOne({ user: userId });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate profile not found' });
        }

        res.status(200).json({ candidate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch candidate profile' });
    }
};

// Update a candidate by ID
const updateCandidateById = async (candidateId, candidateData) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(candidateId, candidateData, {
            new: true,
        });
        return candidate;
    } catch (error) {
        throw new Error('Failed to update candidate');
    }
};

// Delete a candidate by ID
const deleteCandidateById = async (candidateId) => {
    try {
        await Candidate.findByIdAndRemove(candidateId);
        return { success: true };
    } catch (error) {
        throw new Error('Failed to delete candidate');
    }
};

// GET all job listings
const getJobListing = async (req, res) => {
    try {
        const jobListings = await Company.find({}, 'jobs');
        res.json({ jobListings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch job listings' });
    }
};

// POST apply for a job
const JobApply = async (req, res) => {
    const { jobId } = req.params;
    const { candidateId } = req.body;

    try {
        // Find the company that posted the job
        const company = await Company.findOne({ 'jobs._id': jobId });

        if (!company) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if the candidate has already applied for the job
        if (company.jobs.id(jobId).applicants.includes(candidateId)) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // Add the candidate to the job's applicants array
        company.jobs.id(jobId).applicants.push(candidateId);

        // Save the updated company document
        await company.save();

        res.json({ message: 'Job application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit job application' });
    }
};

module.exports = {
    createCandidateProfile,
    updateCandidateProfile,
    getAllCandidates,
    getCandidateProfile,
    updateCandidateById,
    deleteCandidateById,
    getJobListing,
    JobApply
};
