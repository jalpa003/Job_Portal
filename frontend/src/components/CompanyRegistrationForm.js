import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CompanyRegistrationForm.css';
import jwt_decode from 'jwt-decode';

const CompanyRegistrationForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new company object
    const newCompany = {
      companyName: e.target.companyName.value,
      contactInfo: e.target.contactInfo.value,
      industry: e.target.industry.value,
      description: e.target.description.value,
      user: '', // Placeholder for the user ID
    };

    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token); // Decode the token

      // Extract the user ID from the decoded token
      const userId = decodedToken.userId;

      newCompany.user = userId; // Assign the user ID to the 'user' field

      // Send the company registration request to the server
      const response = await fetch('/companies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newCompany),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast message from API response
        toast.success(data.message);

        // Store the company ID in localStorage
        localStorage.setItem('companyId', data.data._id);

        // Redirect to /job/posting after 5 seconds
        setTimeout(() => {
          navigate('/job/posting');
        }, 5000);
      } else {
        // Show error toast message from API response
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Failed to register company', error);
    }
  };

  useEffect(() => {
    return () => {
      // Clear any remaining toast messages when the component is unmounted
      toast.dismiss();
    };
  }, []);

  return (
    <div className="form-container">
      <h2>Company Registration</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyName">Company Name</label>
          <input type="text" id="companyName" required />
        </div>
        <div>
          <label htmlFor="contactInfo">Contact Info</label>
          <input type="text" id="contactInfo" required />
        </div>
        <div>
          <label htmlFor="industry">Industry</label>
          <input type="text" id="industry" required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm;
