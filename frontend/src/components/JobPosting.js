import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from './AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import './JobPosting.css';

const JobPostingForm = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Casual', 'Seasonal', 'Internship'];

  const [companyId, setCompanyId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobType, setJobType] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [preferredStartDate, setPreferredStartDate] = useState('');
  const [payRate, setPayRate] = useState('');
  const [benefits, setBenefits] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    // Set the companyId in state if it exists in localStorage
    if (companyId) {
      // Set the companyId state variable here
      setCompanyId(companyId);

      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken && decodedToken.userId) {
          fetchCompanyDetails(decodedToken.userId);
        }
      }
    }
  }, []);

  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(window.atob(base64));
    return decodedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the job posting data object
    const jobData = {
      jobTitle,
      jobDescription,
      jobRequirements,
      jobType,
      workSchedule,
      preferredStartDate,
      payRate,
      benefits,
      deadline,
    };

    try {
      const token = localStorage.getItem('token');

      // Send the job posting request to the server
      const response = await fetch(`https://job-portal-s02g.onrender.com/companies/jobPost/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        // Display a success message
        toast.success(data.message);

        // Redirect to another page
        setTimeout(() => {
          navigate('/job/listing');
        }, 5000);
      } else {
        // Display an error message
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Failed to post job', error);
    }
  };

  const handleJobListingRedirect = () => {
    navigate('/job/listing'); // Redirect to job listing page
  };

  const fetchCompanyDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      // Fetch the company details based on the user ID
      const companyResponse = await fetch(`https://job-portal-s02g.onrender.com/companies/users/${userId}/company`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setCompanyName(companyData.company.companyName);
      } else {
        console.error('Failed to fetch company details');
      }
    } catch (error) {
      console.error('Failed to fetch company details', error);
    }
  };

  return (
    <div className="job-posting-container">
      <nav className="navbar">
          <div className="navbar-right">
            <div className="navbar-company">{companyName}</div>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
      </nav>
      <div className="form-container">
        <h2>Job Posting</h2>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            >
              <option value="">Select job type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="jobRequirements">Job Requirements</label>
            <textarea
              id="jobRequirements"
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workSchedule">Work Schedule</label>
            <input
              type="text"
              id="workSchedule"
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preferredStartDate">Preferred Start Date</label>
            <input
              type="date"
              id="preferredStartDate"
              value={preferredStartDate}
              onChange={(e) => setPreferredStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="payRate">Pay Rate</label>
            <input
              type="number"
              id="payRate"
              min={0}
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="benefits">Benefits</label>
            <textarea
              id="benefits"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit">Submit</button>
            <button onClick={handleJobListingRedirect}>Job Listing</button>
          </div>
        </form>
      </div>
      <div className="image-container">
        <img className="image" src="/jobpost.jpg" alt="Job Post" />
      </div>
    </div>
  );
};

export default JobPostingForm;
