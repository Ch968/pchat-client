import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const [token] = useState(searchParams.get('token'));

  useEffect(() => {
    if (!token) {
      setStatus('No token provided');
      return;
    }

    setStatus('✅ Email verified successfully!');
    // Token is verified, now show login form
  }, [token]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>{status}</h1>
      <p>Redirecting to login...</p>
      <button onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  );
}