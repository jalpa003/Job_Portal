import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginCompany.css';

const LoginCompany = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send login request to the server
    try {
      const response = await fetch('https://job-portal-s02g.onrender.com/auth/companies/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
        const data = await response.json();
        login(data.token); // Login the user and save the token

        const registrationResponse = await fetch('https://job-portal-s02g.onrender.com/companies/check-registration', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (registrationResponse.ok) {
          const registrationData = await registrationResponse.json();
          console.log(registrationData);
          if (registrationData.registered) {
            navigate('/job/posting');
          } else {
            navigate('/company/register');
          }
        } else {
          console.error('Failed to check company registration');
        }
      } else {
        // Login failed
        const errorData = await response.json();
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error('An error occurred');
    }
  };

  const handleSignupRedirect = () => {
    navigate('/company/signup'); // Redirect to sign-up page
  };

  return (
    <div className="container">
      <h2 className="heading">Company Login</h2>
      {/* <div className="card"> */}
      <img className="card-image" src="/employer.png" alt="Employer" />
      <div className="card-content">
        <form className="form" onSubmit={handleLogin}>
          <label className="label" htmlFor="companyEmail">
            Email:
          </label>
          <input
            className="input"
            type="email"
            id="companyEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label" htmlFor="companyPassword">
            Password:
          </label>
          <input
            className="input"
            type="password"
            id="companyPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Login
          </button>
        </form>

        <div className="text">
          <p>
            Don't have an account?{' '}
            <button className="link" onClick={handleSignupRedirect}>
              Sign Up
            </button>
          </p>
        </div>
        {/* </div> */}
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginCompany;
