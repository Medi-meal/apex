import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = user ? [
    { path: '/recommendations', label: 'Recommendations', icon: '🤖' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/profile-wizard', label: 'Health Profile', icon: '⚕️' }
  ] : [
    { path: '/login', label: 'Login', icon: '🔑' },
    { path: '/signup', label: 'Sign Up', icon: '✨' }
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--secondary-200)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-6)',
        minHeight: '70px'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700'
          }}>
            M
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--primary-600)',
            letterSpacing: '-0.02em'
          }}>
            Medimeal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)'
        }} className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                color: location.pathname === item.path ? 'var(--primary-600)' : 'var(--secondary-600)',
                backgroundColor: location.pathname === item.path ? 'var(--primary-50)' : 'transparent',
                fontWeight: location.pathname === item.path ? '600' : '500',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'var(--secondary-100)';
                  e.target.style.color = 'var(--secondary-700)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--secondary-600)';
                }
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              paddingLeft: 'var(--space-4)',
              borderLeft: '1px solid var(--secondary-200)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--secondary-700)',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success-600)',
                  fontWeight: '600',
                  fontSize: '0.75rem'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontWeight: '500' }}>
                  {user.name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--error-50)',
                  color: 'var(--error-600)',
                  border: '1px solid var(--error-200)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--error-100)';
                  e.target.style.borderColor = 'var(--error-300)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--error-50)';
                  e.target.style.borderColor = 'var(--error-200)';
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            padding: 'var(--space-2)',
            backgroundColor: 'transparent',
            border: '1px solid var(--secondary-300)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--secondary-600)',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          backgroundColor: 'white',
          borderTop: '1px solid var(--secondary-200)',
          padding: 'var(--space-4)',
          display: 'none'
        }} className="mobile-menu">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  color: location.pathname === item.path ? 'var(--primary-600)' : 'var(--secondary-600)',
                  backgroundColor: location.pathname === item.path ? 'var(--primary-50)' : 'transparent',
                  fontWeight: location.pathname === item.path ? '600' : '500'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {user && (
              <div style={{
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--secondary-200)',
                marginTop: 'var(--space-2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-3) var(--space-4)',
                  marginBottom: 'var(--space-2)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--success-600)',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ 
                    color: 'var(--secondary-700)',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--error-50)',
                    color: 'var(--error-600)',
                    border: '1px solid var(--error-200)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

