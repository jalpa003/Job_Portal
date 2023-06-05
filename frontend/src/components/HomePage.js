import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <h1 className="website-title">Job Portal</h1>
            <div className="card-container">
                <div className="card">
                    <img className="card-image" src='./looking_for_job.webp' alt="Looking for a job" />
                    <h2 className="card-title">Looking for a job</h2>
                    <Link to="/candidate/login" className="button candidate-button">Candidates</Link>
                </div>
                <div className="card">
                    <img className="card-image" src='./hiring.webp' alt="Hiring an employee" />
                    <h2 className="card-title">Hiring an employee?</h2>
                    <Link to="/company/login" className="button company-button">Companies</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
