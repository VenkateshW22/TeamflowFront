import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar({ user, onLogout, toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const isProjectManager = user?.roles?.includes('ROLE_PROJECT_MANAGER');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo" onClick={() => navigate('/dashboard')}>
              <div className="navbar-logo-icon">
                <svg className="navbar-logo-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="navbar-logo-text">TeamFlow</span>
            </div>
            
            {user && (
              <div className="navbar-links">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="nav-link"
                >
                  Dashboard
                  <span className="nav-link-underline"></span>
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="nav-link"
                >
                  Projects
                  <span className="nav-link-underline"></span>
                </button>
                <button
                  onClick={() => navigate('/tasks')}
                  className="nav-link"
                >
                  Tasks
                  <span className="nav-link-underline"></span>
                </button>
                {isProjectManager && (
                  <button
                    onClick={() => navigate('/users')}
                    className="nav-link"
                  >
                    Users
                    <span className="nav-link-underline"></span>
                  </button>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="nav-link"
                >
                  Profile
                  <span className="nav-link-underline"></span>
                </button>
              </div>
            )}
          </div>
          
          <div className="navbar-actions">
            <button
              onClick={toggleDarkMode}
              className="navbar-theme-toggle"
            >
              {isDarkMode ? (
                <svg className="navbar-theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="navbar-theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 0012 21a9 9 0 009-9 9 9 0 00-2.646-2.646z" />
                </svg>
              )}
            </button>
            
            {user && (
              <div className="navbar-user">
                <div className="navbar-user-info">
                  <div className="navbar-user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="navbar-user-details">
                    <p className="navbar-user-name">{user.username}</p>
                    <p className="navbar-user-role">
                      {isProjectManager ? 'Project Manager' : 'Team Member'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="btn-secondary navbar-logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {user && (
          <div className="navbar-mobile">
            <div className="navbar-mobile-links">
              <button
                onClick={() => navigate('/dashboard')}
                className="navbar-mobile-link"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="navbar-mobile-link"
              >
                Projects
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="navbar-mobile-link"
              >
                Tasks
              </button>
              {isProjectManager && (
                <button
                  onClick={() => navigate('/users')}
                  className="navbar-mobile-link"
                >
                  Users
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                className="navbar-mobile-link"
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
