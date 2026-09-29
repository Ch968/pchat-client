import React, { useState, useContext } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from '../utils/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    
    // Check if there's a verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // If token exists, show verification success
    if (token) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h1>✅ Email Verified Successfully!</h1>
                    <p>Your email has been confirmed.</p>
                    <p>Please login with your credentials below.</p>
                    <button onClick={() => window.location.href = '/login'} style={{ marginTop: '20px' }}>
                        Continue to Login
                    </button>
                </div>
            </div>
        );
    }

    // Normal login form
    const [mode, setMode] = useState('register'); // 'register' or 'login'
    const [step, setStep] = useState('email'); // email, verification, password
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Send verification email
    const handleSendVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.sendVerification(phoneOrEmail);
            alert('✅ Verification link sent! Check your email!');
            
            // For testing: show the link
            if (response.data.testLink) {
                alert(`Test link: ${response.data.testLink}`);
            }
            
            setStep('verification');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send verification');
        }

        setLoading(false);
    };

    // Verify email token
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyEmail(token, username, password);
            if (response.data.success) {
                login(response.data.user, response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to verify email');
        }

        setLoading(false);
    };

    // Login with existing account
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(phoneOrEmail, password);
            if (response.data.success) {
                login(response.data.user, response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email/phone or password');
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>💬 PChat</h1>
                <p>Connect with everyone, everywhere</p>

                {error && <div className="error-message">{error}</div>}

                {/* REGISTER MODE */}
                {mode === 'register' ? (
                    <>
                        {step === 'email' && (
                            <form onSubmit={handleSendVerification}>
                                <h2>Create Account</h2>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={phoneOrEmail}
                                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Verification Link'}
                                </button>
                            </form>
                        )}

                        {step === 'verification' && (
                            <div>
                                <h2>Check Your Email</h2>
                                <p>We sent a verification link to {phoneOrEmail}</p>
                                <p>Click the link in your email to verify your account.</p>
                                <button type="button" onClick={() => setStep('email')} className="back-btn">
                                    Back
                                </button>
                            </div>
                        )}

                        <p className="switch-text">
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setMode('login');
                                setStep('email');
                                setError('');
                            }}>
                                Login
                            </a>
                        </p>
                    </>
                ) : (
                    // LOGIN MODE
                    <>
                        <form onSubmit={handleLogin}>
                            <h2>Login</h2>
                            <input
                                type="text"
                                placeholder="Email or Phone"
                                value={phoneOrEmail}
                                onChange={(e) => setPhoneOrEmail(e.target.value)}
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
                        </form>

                        <p className="switch-text">
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setMode('register');
                                setStep('email');
                                setPhoneOrEmail('');
                                setPassword('');
                                setUsername('');
                                setError('');
                            }}>
                                Sign Up
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}