import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ role });
        redirectToDashboard(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const redirectToDashboard = (role) => {
        if (role === 'candidate') {
            navigate('/candidate/login');
        } else if (role === 'company') {
            navigate('/company/dashboard');
        } else {
            navigate('/');
        }
    };


    const showToast = (message) => {
        toast.success(message, { autoClose: 5000 });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, showToast }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
