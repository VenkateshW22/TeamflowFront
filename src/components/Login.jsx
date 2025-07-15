import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await onLogin(username, password);
    setLoading(false);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <p className="text-muted">Sign in to your account</p>
        </div>
        
        <div className="card animate-fade-in">
          <h2 className="section-title text-center">Welcome Back</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl">
              <p className="text-danger-700 dark:text-danger-300 text-sm text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-emphasis">Username</label>
              <div className="input-icon-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-with-icon"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-emphasis">Password</label>
              <div className="input-icon-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-with-icon"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center py-4 text-lg font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="loading-spinner" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-muted text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
