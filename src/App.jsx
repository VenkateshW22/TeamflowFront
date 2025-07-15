import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login, getUser, getCurrentUser } from './api';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import UserManagement from './components/UserManagement.jsx';
import Profile from './components/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, user, requiredRole = null }) => {
  console.log('ProtectedRoute check:', { user, requiredRole, userRoles: user?.roles }); // Debug log
  
  if (!user) {
    console.log('No user, redirecting to login'); // Debug log
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !user.roles.includes(requiredRole)) {
    console.log('Access denied, user roles:', user.roles, 'required:', requiredRole); // Debug log
    toast.error('Access denied. You do not have permission to view this page.');
    return <Navigate to="/dashboard" />;
  }
  
  console.log('Access granted, rendering component'); // Debug log
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Try to get current user first, fallback to stored user ID, then to user ID 1
      getCurrentUser().then((response) => {
        setUser({
          id: response.data.id,
          username: response.data.username,
          roles: response.data.roles,
        });
        localStorage.setItem('userId', response.data.id.toString());
        setLoading(false);
      }).catch((error) => {
        console.error('Failed to get current user, trying stored user ID:', error);
        const storedUserId = localStorage.getItem('userId');
        
        if (storedUserId) {
          getUser(parseInt(storedUserId)).then((response) => {
            setUser({
              id: response.data.id,
              username: response.data.username,
              roles: response.data.roles,
            });
            setLoading(false);
          }).catch((userError) => {
            console.error('Failed to fetch user data:', userError);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setLoading(false);
            toast.error('Session expired. Please log in again.');
          });
        } else {
          // Final fallback to user ID 1
          getUser(1).then((response) => {
            setUser({
              id: response.data.id,
              username: response.data.username,
              roles: response.data.roles,
            });
            localStorage.setItem('userId', response.data.id.toString());
            setLoading(false);
          }).catch((fallbackError) => {
            console.error('Failed to fetch user data:', fallbackError);
            localStorage.removeItem('token');
            setLoading(false);
            toast.error('Session expired. Please log in again.');
          });
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.id.toString());
      setUser({
        id: response.data.id,
        username: response.data.username,
        roles: response.data.roles,
      });
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: Invalid credentials');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar user={user} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute user={user}><ProjectList user={user} /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute user={user}><ProjectDetails user={user} /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute user={user}><TaskList user={user} /></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<ProtectedRoute user={user}><TaskDetails user={user} /></ProtectedRoute>} />
          <Route path="/users" element={
            <ProtectedRoute user={user} requiredRole="ROLE_PROJECT_MANAGER">
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme={isDarkMode ? 'dark' : 'light'} />
      </div>
    </Router>
  );
}
