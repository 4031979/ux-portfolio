// src/components/PasswordProtected.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/PasswordProtected.css';

const PasswordProtected = ({ children, projectId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('portfolio_authenticated');
    if (token) setIsAuthenticated(true);
  }, [projectId]);

  const handleClose = () => navigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: dbError } = await supabase
        .rpc('check_project_password', {
          p_project_id: String(projectId),
          p_password: password,
        });

      // 👇 Debug logs
      console.log('project_id sent:', String(projectId));
      console.log('data returned:', data);
      console.log('error:', dbError);

      if (dbError) throw dbError;

      if (data === true) {
        sessionStorage.setItem('portfolio_authenticated', 'authenticated');
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="password-overlay">
      <div className="password-modal">
        <button className="close-button" onClick={handleClose} aria-label="Close">
          ✕
        </button>

        <h2>Protected Project</h2>
        <p>This project is password protected. Please enter the password to view.</p>

        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="password-input"
            autoFocus
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="password-submit" disabled={loading}>
            {loading ? 'Checking...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtected;