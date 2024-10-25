import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LockIcon, PersonIcon, SignInIcon } from '@primer/octicons-react'; // Importing icons from Octicons
import './Login.css';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://users-2-j0ak.onrender.com/api/user/login',
                { email, password }
            );
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed! Please check your credentials.');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div style={{ position: 'relative' }}>
                        <PersonIcon className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <LockIcon className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        <SignInIcon className="button-icon" /> Login
                    </button>
                    <p className="register-prompt">
                        Don't have an account? 
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="register-button"
                        >
                            Register
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
