import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import SignupCandidate from './components/SignupCandidate';
import LoginCandidate from './components/LoginCandidate';
import SignupCompany from './components/SignupCompany';
import LoginCompany from './components/LoginCompany';
import HomePage from './components/HomePage';
import CandidateRegister from './components/CandidateRegister';
import CandidateProfile from './components/GetCandidate';
import CompanyRegistrationForm from './components/CompanyRegistrationForm';
import JobPostForm from './components/JobPosting';
import JobListingPage from './components/JobListing';
import CandidateJobListing from './components/CandidateJobListing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/candidate/signup" element={<SignupCandidate />} />
            <Route path="/candidate/login" element={<LoginCandidate />} />
            <Route path="/company/signup" element={<SignupCompany />} />
            <Route path="/company/login" element={<LoginCompany />} />
            <Route path="/candidate/register" element={<CandidateRegister />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/company/register" element={<CompanyRegistrationForm />} />
            <Route path="/job/posting" element={<JobPostForm />} />
            <Route path="/job/listing" element={<JobListingPage />} />
            <Route path="/candidate/job-listing" element={<CandidateJobListing />} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
