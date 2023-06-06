import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignupCandidate.css';

const SignupCandidate = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiResponse] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (apiResponse) {
      toast.success(apiResponse); // Show success message in toaster
      const redirectTimer = setTimeout(() => {
        navigate('/candidate/login'); // Redirect to login page after 5 seconds
      }, 5000);

      return () => {
        clearTimeout(redirectTimer); // Clean up the timer when the component unmounts
      };
    }
  }, [apiResponse, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://job-portal-s02g.onrender.com/auth/candidates/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, 'candidate'); // Pass the role 'candidate' to the login function
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/candidate/login'); // Redirect to login page
  };

  return (
    <div className="container">
      <header className="header">
        <h2 className="heading">Candidate Sign Up</h2>
      </header>
      <div className="content">
        <form className="form" onSubmit={handleSignup}>
          <label className="label" htmlFor="candidateEmail">
            Email:
          </label>
          <input
            className="input"
            type="email"
            id="candidateEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="candidatePassword">
            Password:
          </label>
          <input
            className="input"
            type="password"
            id="candidatePassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="button">
            Sign Up
          </button>
        </form>

        <p className="text">
          Already have an account?{' '}
          <button className="link" onClick={handleLoginRedirect}>
            Login
          </button>
        </p>
      </div>
      <footer className="footer">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
      <ToastContainer /> {/* Toast container component */}
    </div>
  );
};

export default SignupCandidate;
