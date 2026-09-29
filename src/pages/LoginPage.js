import React, { useState, useContext } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from '../utils/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register(username, password, email);
            if (response.data.success) {
                login(response.data.user, response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register');
        }

        setLoading(false);
    };

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(username, password);
            if (response.data.success) {
                login(response.data.user, response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid username or password');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>💬 PChat</h1>
                <p>Connect with everyone, everywhere</p>

                {error && <div className="error-message">{error}</div>}

                {mode === 'register' ? (
                    // REGISTER FORM
                    <form onSubmit={handleRegister}>
                        <h2>Create Account</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>

                        <p className="switch-text">
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setMode('login');
                                setError('');
                            }}>
                                Login
                            </a>
                        </p>
                    </form>
                ) : (
                    // LOGIN FORM
                    <form onSubmit={handleLogin}>
                        <h2>Login</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="switch-text">
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setMode('register');
                                setError('');
                                setUsername('');
                                setPassword('');
                                setEmail('');
                            }}>
                                Sign Up
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}