import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import './JobListing.css';

const JobListingPage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    // Fetch the company's job postings and update state
    fetchCompanyJobs();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        fetchCompanyDetails(decodedToken.userId);
      }
    }
  }, []);

  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = JSON.parse(window.atob(base64));
    return decodedData;
  };

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const companyId = localStorage.getItem('companyId');

      // Fetch the total number of job postings by the company
      const totalJobsResponse = await fetch(`https://job-portal-s02g.onrender.com/companies/${companyId}/totalJobPostings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (totalJobsResponse.ok) {
        const totalJobsData = await totalJobsResponse.json();
        setTotalJobs(totalJobsData.totalJobPostings);
      } else {
        console.error('Failed to fetch total number of job postings');
      }

      // Fetch the list of all jobs posted by the company
      const jobsResponse = await fetch(`https://job-portal-s02g.onrender.com/companies/${companyId}/jobPostings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setCompanyJobs(jobsData.jobs);
      } else {
        console.error('Failed to fetch company jobs');
      }
    } catch (error) {
      console.error('Failed to fetch company jobs', error);
    }
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


  const handleBackButtonClick = () => {
    navigate('/job/posting');
  };

  return (
    <div className="job-listing-page">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="back-button" onClick={handleBackButtonClick}>
            Back
          </button>
        </div>
        <div className="navbar-right">
          <div className="navbar-company">{companyName}</div>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <h2>Job Listing Dashboard</h2>
      <p className="total-jobs">Total Jobs Posted: {totalJobs}</p>
      <h3>Your Job Listings</h3>
      <div className="job-cards">
        {companyJobs.map((job) => (
          <div className="job-card" key={job._id}>
            <h4 className="job-title">{job.jobTitle}</h4>
            <div className="job-details">
              <div className="job-field">
                <span className="job-field-label">Job Type:</span>
                <span className="job-field-value">{job.jobType}</span>
              </div>
              <div className="job-field">
                <span className="job-field-label">Pay Rate:</span>
                <span className="job-field-value">{job.payRate}</span>
              </div>
              <div className="job-field">
                <span className="job-field-label">Work Schedule:</span>
                <span className="job-field-value">{job.workSchedule}</span>
              </div>
              <div className="job-field">
                <span className="job-field-label">Preferred Start Date:</span>
                <span className="job-field-value">{job.preferredStartDate}</span>
              </div>
            </div>
            <p className="job-description">{job.jobDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListingPage;
