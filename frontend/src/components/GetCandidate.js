import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './CandidateProfile.css';

const CandidateProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    workExperience: '',
    desiredJobType: '',
    desiredWorkSchedule: '',
    distanceFromAddress: '',
    resume: null,
  });

  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    // Fetch the candidate profile data from the server
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('/candidates/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Failed to fetch candidate profile', errorData.error);
        }

        const data = await response.json();
        setProfileData({
          firstName: data.candidate.firstName,
          lastName: data.candidate.lastName,
          email: data.candidate.email,
          phone: data.candidate.phone,
          workExperience: data.candidate.workExperience,
          desiredJobType: data.candidate.desiredJobType,
          desiredWorkSchedule: data.candidate.desiredWorkSchedule,
          distanceFromAddress: data.candidate.distanceFromAddress,
          resume: data.candidate.resume,
        });
      } catch (error) {
        console.log(error.message);
        toast.error(error.message || 'Failed to update candidate profile');
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      // Validate resume file
      if (!profileData.resume || profileData.resume === null) {
        setResumeError('Please select a resume file.');
        return;
      }

      // Clear resume error if file is selected
      setResumeError('');

      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      formData.append('workExperience', profileData.workExperience);
      formData.append('desiredJobType', profileData.desiredJobType);
      formData.append('desiredWorkSchedule', profileData.desiredWorkSchedule);
      formData.append('distanceFromAddress', profileData.distanceFromAddress);
      formData.append('resume', profileData.resume);


      const response = await fetch('/candidates/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', response);
        console.log('Error data:', errorData);
        throw new Error(errorData.error || 'Failed to update candidate profile');
      }

      const data = await response.json();
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    // Perform logout logic here, e.g., clear token from localStorage and redirect to login page
    localStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = '/';
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setProfileData({ ...profileData, resume: file });
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h2>My Profile</h2>
        </div>
        <div className="navbar-right">
          <span>Welcome, {profileData.firstName}</span>
          <Link to="/candidate/job-listing" className="job-listing-button">
            Job Listings
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <form className="profile-form">
        <label>First Name:</label>
        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={profileData.email} onChange={handleChange} />

        <label>Phone:</label>
        <input type="text" name="phone" value={profileData.phone} onChange={handleChange} />

        <label>Work Experience:</label>
        <textarea name="workExperience" value={profileData.workExperience} onChange={handleChange} />

        <label>Desired Job Type:</label>
        <select name="desiredJobType" value={profileData.desiredJobType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="FT">Full-Time</option>
          <option value="PT">Part-Time</option>
          <option value="Temp">Temporary</option>
          <option value="Apprentice">Apprentice</option>
        </select>

        <label>Desired Work Schedule:</label>
        <input type="text" name="desiredWorkSchedule" value={profileData.desiredWorkSchedule} onChange={handleChange} />

        <label>Distance from Address:</label>
        <input type="text" name="distanceFromAddress" value={profileData.distanceFromAddress} onChange={handleChange} />
        <label>Resume:</label>
        <input type="file" name="resume" onChange={handleResumeChange} required />
        {resumeError && <div className="error-message">{resumeError}</div>}

        <button type="button" onClick={handleUpdateProfile} className="update-button">
          Update Profile
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CandidateProfile;
