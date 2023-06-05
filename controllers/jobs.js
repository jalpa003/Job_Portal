const Company = require('../models/company');

// Create a new job
const createJob = async (req, res) => {
    try {
        const { companyId } = req.params;
        const {
            jobTitle,
            jobDescription,
            jobRequirements,
            jobType,
            workSchedule,
            preferredStartDate,
            payRate,
            benefits,
            deadline
        } = req.body;

        // Find the company by its ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Create a new job instance
        const newJob = {
            jobTitle,
            jobDescription,
            jobRequirements,
            jobType,
            workSchedule,
            preferredStartDate,
            payRate,
            benefits,
            deadline
        };


        // Add the job to the company's jobs array
        company.jobs.push(newJob);

        // Save the updated company
        await company.save();

        res.status(201).json({ message: 'Job posted successfully', job: newJob });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to post job' });
    }

};

// Get all jobs
const getAllJobs = async () => {
    try {
        const jobs = await Job.find().populate('company');
        return jobs;
    } catch (error) {
        throw new Error('Failed to fetch jobs');
    }
};

// Get a job by ID
const getJobById = async (jobId) => {
    try {
        const job = await Job.findById(jobId).populate('company');
        return job;
    } catch (error) {
        throw new Error('Failed to fetch job');
    }
};

// Update a job by ID
const updateJobById = async (jobId, jobData) => {
    try {
        const job = await Job.findByIdAndUpdate(jobId, jobData, {
            new: true,
        });
        return job;
    } catch (error) {
        throw new Error('Failed to update job');
    }
};

// Delete a job by ID
const deleteJobById = async (jobId) => {
    try {
        await Job.findByIdAndRemove(jobId);
        return { success: true };
    } catch (error) {
        throw new Error('Failed to delete job');
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
};
