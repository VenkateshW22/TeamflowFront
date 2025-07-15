import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, getTasks, getUsers } from '../api';
import { toast } from 'react-toastify';

export default function ProjectDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projectResponse, tasksResponse] = await Promise.all([
          getProject(id),
          getTasks(0, 10, { projectId: id })
        ]);
        setProject(projectResponse.data);
        setTasks(tasksResponse.data.content);
      } catch (err) {
        setError('Failed to load project data');
        toast.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'TO_DO': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'DONE': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Project not found'}</p>
          <button onClick={() => navigate('/projects')} className="btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{project.name}</h2>
        <button onClick={() => navigate('/projects')} className="btn-secondary">
          Back to Projects
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Information */}
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Project Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date</label>
                  <p className="text-gray-600 dark:text-gray-300">{project.startDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date</label>
                  <p className="text-gray-600 dark:text-gray-300">{project.endDate}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Project Manager</label>
                <p className="text-gray-600 dark:text-gray-300">{project.projectManagerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Tasks */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Project Tasks</h3>
              <button onClick={() => navigate('/tasks')} className="btn-primary">
                View All Tasks
              </button>
            </div>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks found for this project</p>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                        <div className="flex space-x-2 mt-2">
                          <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="btn-secondary text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 