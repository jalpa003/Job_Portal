import React, { useState, useEffect } from 'react';
import './JobListingPage.css';

const JobListingPage = () => {
    const [jobListings, setJobListings] = useState([]);
    const [userFirstName, setUserFirstName] = useState('');

    useEffect(() => {
        const fetchJobListings = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('https://job-portal-s02g.onrender.com/candidates/joblistings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch job listings');
                }

                const data = await response.json();
                setJobListings(data.jobListings);
                console.log(data.jobListings);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchJobListings();

        // Retrieve user's first name from the token
        const token = localStorage.getItem('token');
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const firstName = payload.firstName;
        setUserFirstName(firstName);
    }, []);

    const handleApply = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            const candidateId = payload.userId;

            const response = await fetch(`https://job-portal-s02g.onrender.com/candidates/apply/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ candidateId }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit job application');
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleJobClick = (job) => {
        // Handle job click logic here if needed
    };

    const handleLogout = () => {
        // Perform logout logic here, e.g., clear token from localStorage and redirect to login page
        localStorage.removeItem('token');
        // Redirect to the login page
        window.location.href = '/';
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-left">
                    <h2>Job Listings</h2>
                </div>
                <div className="navbar-right">
                    <span>Welcome, {userFirstName}</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="job-listings">
                {jobListings.length > 0 &&
                    jobListings[0].jobs.map((job) => (
                        <div key={job._id} className="job-card" onClick={() => handleJobClick(job)}>
                            <div>
                                <h3>{job.jobTitle}</h3>
                                <div className="job-details">
                                    <div className="job-field">
                                        <label>Job Description:</label>
                                        <p>{job.jobDescription}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Job Requirements:</label>
                                        <p>{job.jobRequirements}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Job Type:</label>
                                        <p>{job.jobType}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Work Schedule:</label>
                                        <p>{job.workSchedule}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Preferred Start Date:</label>
                                        <p>{job.preferredStartDate}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Pay Rate:</label>
                                        <p>{job.payRate}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Benefits:</label>
                                        <p>{job.benefits}</p>
                                    </div>
                                    <div className="job-field">
                                        <label>Deadline:</label>
                                        <p>{job.deadline}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="apply-button" onClick={() => handleApply(job._id)}>Apply</button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default JobListingPage;
