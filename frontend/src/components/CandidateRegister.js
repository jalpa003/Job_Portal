import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CandidateRegister.css';
import { useNavigate } from 'react-router-dom';

const CandidateRegistration = () => {
    const [formData, setFormData] = useState({
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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidateProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('https://job-portal-s02g.onrender.com/candidates/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const { candidate } = data;

                    // Populate the form fields with the retrieved candidate profile data
                    setFormData({
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        email: candidate.email,
                        phone: candidate.phone,
                        workExperience: candidate.workExperience,
                        desiredJobType: candidate.desiredJobType,
                        desiredWorkSchedule: candidate.desiredWorkSchedule,
                        distanceFromAddress: candidate.distanceFromAddress,
                        resume: null,
                    });
                } else if (response.status === 404) {
                    // Candidate profile not found
                    toast.warn('Please fill up your candidate profile.');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
            } catch (error) {
                console.log('Error:', error.message);
                toast.error(error.message);
            }
        };

        fetchCandidateProfile();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'resume') {
            setFormData({ ...formData, resume: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform client-side validation
        if (!isFormValid()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const form = new FormData();
            form.append('firstName', formData.firstName);
            form.append('lastName', formData.lastName);
            form.append('email', formData.email);
            form.append('phone', formData.phone);
            form.append('workExperience', formData.workExperience);
            form.append('desiredJobType', formData.desiredJobType);
            form.append('desiredWorkSchedule', formData.desiredWorkSchedule);
            form.append('distanceFromAddress', formData.distanceFromAddress);
            form.append('resume', formData.resume);

            const config = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            };

            const response = await fetch('https://job-portal-s02g.onrender.com/candidates/profile', config);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            console.log(data); // Handle the response data as needed

            toast.success(data.message);

            navigate('/candidate/profile');
        } catch (error) {
            console.log('Error:', error.message);
            toast.error(error.message);
        }
    };

    const isFormValid = () => {
        const {
            firstName,
            lastName,
            email,
            phone,
            workExperience,
            desiredJobType,
            desiredWorkSchedule,
            distanceFromAddress,
        } = formData;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !workExperience ||
            !desiredJobType ||
            !desiredWorkSchedule ||
            !distanceFromAddress
        ) {
            toast.error('Please fill in all the required fields.');
            return false;
        }

        return true;
    };

    return (
        <div className="registration-container">
            <h2 className="registration-title">Candidate Registration</h2>
            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Work Experience:</label>
                    <textarea
                        name="workExperience"
                        value={formData.workExperience}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Desired Job Type:</label>
                    <select
                        name="desiredJobType"
                        value={formData.desiredJobType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="FT">Full-Time</option>
                        <option value="PT">Part-Time</option>
                        <option value="Temp">Temporary</option>
                        <option value="Apprentice">Apprentice</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Desired Work Schedule:</label>
                    <input
                        type="text"
                        name="desiredWorkSchedule"
                        value={formData.desiredWorkSchedule}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Distance from Address:</label>
                    <input
                        type="text"
                        name="distanceFromAddress"
                        value={formData.distanceFromAddress}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Resume:</label>
                    <input type="file" name="resume" onChange={handleChange} required />
                </div>

                <button type="submit">Register</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default CandidateRegistration;
