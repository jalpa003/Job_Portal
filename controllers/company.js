const Company = require('../models/company');

// Create a new company
const createCompanyProfile = async (req, res) => {
    try {
        const { companyName, contactInfo, industry, description, user } = req.body;

        // Check if the company already exists
        const existingCompany = await Company.findOne({ companyName });
        if (existingCompany) {
            return res.status(409).json({ error: 'Company already exists' });
        }

        // Create a new company profile using the Company model
        const newCompany = new Company({
            companyName,
            contactInfo,
            industry,
            description,
            user
        });

        // Save the company profile to the database
        await newCompany.save();

        res.status(201).json({ message: 'Company registered successfully', data: newCompany });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to register company' });
    }
};

// Get all companies
const getAllCompanies = async () => {
    try {
        const companies = await Company.find();
        return companies;
    } catch (error) {
        throw new Error('Failed to fetch companies');
    }
};

// Get a company by ID
const getCompanyById = async (companyId) => {
    try {
        const company = await Company.findById(companyId);
        return company;
    } catch (error) {
        throw new Error('Failed to fetch company');
    }
};

// Update a company by ID
const updateCompanyById = async (companyId, companyData) => {
    try {
        const company = await Company.findByIdAndUpdate(companyId, companyData, {
            new: true,
        });
        return company;
    } catch (error) {
        throw new Error('Failed to update company');
    }
};

// Delete a company by ID
const deleteCompanyById = async (companyId) => {
    try {
        await Company.findByIdAndRemove(companyId);
        return { success: true };
    } catch (error) {
        throw new Error('Failed to delete company');
    }
};

// Get total number of job postings by a company
const getTotalJobPostings = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Find the company by companyId
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const totalJobPostings = company.jobs.length;

        res.json({ totalJobPostings });
    } catch (error) {
        console.error('Failed to get total job postings', error);
        res.status(500).json({ error: 'Failed to get total job postings' });
    }
};

// Get all jobs posted by a company
const getAllJobs = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        // Find the company by companyId
        const company = await Company.findById(companyId).populate('jobs');

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const jobs = company.jobs;

        res.json({ jobs });
    } catch (error) {
        console.error('Failed to get jobs', error);
        res.status(500).json({ error: 'Failed to get jobs' });
    }
};

// Check if the user has already registered a company
const checkCompanyRegistration = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the company by userId
        const company = await Company.findOne({ user: userId });

        if (company) {
            // User has already registered a company
            return res.json({ registered: true });
        } else {
            // User has not registered a company
            return res.json({ registered: false });
        }
    } catch (error) {
        console.error('Failed to check company registration', error);
        res.status(500).json({ error: 'Failed to check company registration' });
    }
};

// Fetch the company details based on the user ID
const getCompanyByUserId = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user.userId });
        if (company) {
            res.json({ company });
        }
    } catch (error) {
        // console.log(error.message);
        throw new Error('Failed to fetch company');
    }
};


module.exports = {
    createCompanyProfile,
    getAllCompanies,
    getCompanyById,
    updateCompanyById,
    deleteCompanyById,
    getTotalJobPostings,
    getAllJobs,
    checkCompanyRegistration,
    getCompanyByUserId
};
