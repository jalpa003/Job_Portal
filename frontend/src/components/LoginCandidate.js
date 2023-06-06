import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginCandidate.css';

const LoginCandidate = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Send login request to the server
        try {
            const response = await fetch('https://job-portal-s02g.onrender.com/auth/candidates/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);

                // Check if the user ID exists in the candidate database
                const candidateResponse = await fetch(`/candidates/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                });
                if (candidateResponse.ok) {
                    // User ID found in the candidate database
                    login(data.token);
                    navigate('/candidate/profile');
                } else {
                    // User ID not found in the candidate database
                    navigate('/candidate/register');
                }
            } else {
                // Login failed
                const errorData = await response.json();
                toast.error(errorData.error, { position: toast.POSITION.TOP_RIGHT });
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleSignupRedirect = () => {
        navigate('/candidate/signup'); // Redirect to sign-up page
    };

    return (
        <div className="container">
            <div className="content">
                <header className="header">
                    <h2 className="heading">Candidate Login</h2>
                </header>
                <img className="card-image" src="/candidate.jpg" alt="Candidate" />
                <div className="box">
                    <form className="form" onSubmit={handleLogin}>
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
                            Login
                        </button>
                    </form>

                    <p className="text">
                        Don't have an account?{' '}
                        <button className="link" onClick={handleSignupRedirect}>
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2023 Your Company. All rights reserved.</p>
            </footer>

            <ToastContainer />
        </div>
    );
};

export default LoginCandidate;
