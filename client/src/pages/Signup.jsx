import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      onLogin(response.data.user);
      navigate('/profile-wizard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });
      onLogin(response.data.user);
      navigate('/profile-wizard');
    } catch (err) {
      setError('Google signup failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--secondary-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-10)',
        border: '1px solid var(--secondary-200)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--success-600) 0%, var(--success-800) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: '0 auto var(--space-4) auto'
          }}>
            ✨
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: 'var(--secondary-900)',
            marginBottom: 'var(--space-2)'
          }}>
            Join Medimeal
          </h1>
          <p style={{
            color: 'var(--secondary-600)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            Start your personalized health journey today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'var(--error-50)',
            border: '1px solid var(--error-200)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-6)',
            color: 'var(--error-700)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Google Signup */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google signup failed')}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
          />
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--secondary-200)'
          }}></div>
          <span style={{
            color: 'var(--secondary-500)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            or
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--secondary-200)'
          }}></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              style={{
                fontSize: '0.875rem',
                padding: 'var(--space-3) var(--space-4)'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                fontSize: '0.875rem',
                padding: 'var(--space-3) var(--space-4)'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min. 6 characters)"
              style={{
                fontSize: '0.875rem',
                padding: 'var(--space-3) var(--space-4)'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              style={{
                fontSize: '0.875rem',
                padding: 'var(--space-3) var(--space-4)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              backgroundColor: loading ? 'var(--secondary-300)' : 'var(--success-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-6)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'var(--success-700)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'var(--success-600)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <p style={{
            color: 'var(--secondary-500)',
            fontSize: '0.75rem',
            margin: 0,
            lineHeight: '1.4'
          }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: 'var(--primary-600)', textDecoration: 'none' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: 'var(--primary-600)', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--secondary-200)'
        }}>
          <p style={{
            color: 'var(--secondary-600)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary-600)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;

