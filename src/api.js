import axios from 'axios';

// Use environment variables for API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://tfbe.ap-south-1.elasticbeanstalk.com/api/';
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://tfbe.ap-south-1.elasticbeanstalk.com/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

const dashboardApi = axios.create({
  baseURL: DASHBOARD_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

dashboardApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

dashboardApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = (username, password) =>
  api.post('/auth/signin', { username, password });

export const signup = (username, email, password, role = ['member']) =>
  api.post('/auth/signup', { username, email, password, role });

// Users
export const getUsers = (page = 0, size = 10) => {
  console.log('API: getUsers called with page=', page, 'size=', size); // Debug log
  return api.get(`/users?page=${page}&size=${size}`);
};

export const getUser = (id) => api.get(`/users/${id}`);

export const getCurrentUser = () => api.get('/users/me');

export const createUser = (userData) =>
  api.post('/auth/signup', userData);

export const updateUser = (id, userData) =>
  api.put(`/users/${id}`, userData);

export const updateUserRoles = (id, roles) =>
  api.put(`/users/${id}/roles`, roles);

export const deleteUser = (id) => api.delete(`/users/${id}`);

// Projects
export const createProject = (projectData) =>
  api.post('/projects', projectData);

export const getProject = (id) => api.get(`/projects/${id}`);

export const getProjects = (page = 0, size = 10, sort = 'name,asc') =>
  api.get(`/projects?page=${page}&size=${size}`);

export const updateProject = (id, projectData) =>
  api.put(`/projects/${id}`, projectData);

export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Tasks
export const createTask = (taskData) => api.post('/tasks', taskData);

export const getTask = (id) => api.get(`/tasks/${id}`);

export const getTasks = (page = 0, size = 10, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...filters
  });
  return api.get(`/tasks?${params}`);
};

export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);

export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status });

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Dashboard
export const getDashboardStats = () => dashboardApi.get('/dashboard/stats');

export const getRecentProjects = (page = 0, size = 5) =>
  dashboardApi.get(`/dashboard/recent-projects?page=${page}&size=${size}`);

export const getRecentTasks = (page = 0, size = 5) =>
  dashboardApi.get(`/dashboard/recent-tasks?page=${page}&size=${size}`);

export default api;
