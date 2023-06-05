import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignupCompany.css';

const SignupCompany = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, showToast } = useContext(AuthContext); // Add showToast from AuthContext
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/auth/companies/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, 'employer');
                const successMsg = await response.text(); // Get success message from the response
                showToast(successMsg); // Display success message as toast
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
        navigate('/company/login');
    };

    return (
        <div className="container">
            <header className="header">
                <h2 className="heading">Company Sign Up</h2>
            </header>
            <div className="content">
                <form className="form" onSubmit={handleSignup}>
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
            <ToastContainer />
        </div>
    );
};

export default SignupCompany;
