import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getRecentProjects, getRecentTasks } from '../api';
import { toast } from 'react-toastify';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsResponse = await getDashboardStats();
        setStats(statsResponse.data);
        const projectsResponse = await getRecentProjects();
        setRecentProjects(projectsResponse.data.content);
        const tasksResponse = await getRecentTasks();
        setRecentTasks(tasksResponse.data.content);
      } catch (err) {
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'TO_DO': return 'badge-primary';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'DONE': return 'badge-success';
      case 'BLOCKED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'badge-success';
      case 'MEDIUM': return 'badge-warning';
      case 'HIGH': return 'badge-danger';
      case 'URGENT': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const isProjectManager = user?.roles?.includes('ROLE_PROJECT_MANAGER');

  if (loading) {
    return (
      <div className="container p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="section-title">Welcome back, {user?.username}!</h1>
          <p className="text-muted">Here's what's happening with your projects and tasks.</p>
        </div>
        <div className="flex gap-3">
          {isProjectManager && (
            <>
              <button onClick={() => navigate('/projects')} className="btn-primary">
                Create Project
              </button>
              <button onClick={() => navigate('/tasks')} className="btn-secondary">
                Create Task
              </button>
              <button onClick={() => navigate('/users')} className="btn-secondary">
                Manage Users
              </button>
            </>
          )}
          {!isProjectManager && (
            <>
              <button onClick={() => navigate('/projects')} className="btn-primary">
                View Projects
              </button>
              <button onClick={() => navigate('/tasks')} className="btn-secondary">
                View Tasks
              </button>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl">
          <p className="text-danger-700 dark:text-danger-300 text-sm text-center">{error}</p>
        </div>
      )}
      
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card" onClick={() => navigate('/projects')}>
            <div className="flex items-center">
              <div className="stat-icon bg-primary-100 dark:bg-primary-900/20 mr-4">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-emphasis">Active Projects</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card" onClick={() => navigate('/tasks')}>
            <div className="flex items-center">
              <div className="stat-icon bg-danger-100 dark:bg-danger-900/20 mr-4">
                <svg className="w-6 h-6 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-emphasis">Tasks Due</h3>
                <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">{stats.tasksDue}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card" onClick={() => navigate('/tasks')}>
            <div className="flex items-center">
              <div className="stat-icon bg-success-100 dark:bg-success-900/20 mr-4">
                <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-emphasis">Completed Tasks</h3>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">{stats.completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card" onClick={() => navigate('/tasks')}>
            <div className="flex items-center">
              <div className="stat-icon bg-warning-100 dark:bg-warning-900/20 mr-4">
                <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-emphasis">In Progress</h3>
                <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{stats.inProgressTasks}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="subsection-title">Recent Projects</h3>
            <button onClick={() => navigate('/projects')} className="btn-secondary text-sm">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-muted">No recent projects</p>
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl transition-all duration-200 hover:bg-secondary-100 dark:hover:bg-secondary-600 cursor-pointer group" onClick={() => navigate(`/projects/${project.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="font-semibold text-emphasis group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">{project.name}</p>
                      <p className="text-sm text-muted">{project.description}</p>
                      <p className="text-sm text-muted">Start: {project.startDate}</p>
                    </div>
                    <svg className="w-5 h-5 text-secondary-400 group-hover:text-primary-500 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="subsection-title">Recent Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="btn-secondary text-sm">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-muted">No recent tasks</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl transition-all duration-200 hover:bg-secondary-100 dark:hover:bg-secondary-600 cursor-pointer group" onClick={() => navigate(`/tasks/${task.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-emphasis group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">{task.title}</p>
                      <div className="flex gap-2">
                        <span className={`${getStatusColor(task.status)}`}>{task.status}</span>
                        <span className={`${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      </div>
                      <p className="text-sm text-muted">Due: {task.dueDate}</p>
                    </div>
                    <svg className="w-5 h-5 text-secondary-400 group-hover:text-primary-500 transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}