import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, updateTaskStatus, getUsers } from '../api';
import { toast } from 'react-toastify';

export default function TaskDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const isProjectManager = user.roles.includes('ROLE_PROJECT_MANAGER');
  const canEdit = isProjectManager || task?.assignedToId === user.id;

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const [taskResponse, usersResponse] = await Promise.all([
          getTask(id),
          getUsers()
        ]);
        setTask(taskResponse.data);
        setUsers(usersResponse.data);
        setForm({
          title: taskResponse.data.title,
          description: taskResponse.data.description,
          status: taskResponse.data.status,
          priority: taskResponse.data.priority,
          dueDate: taskResponse.data.dueDate,
          projectId: taskResponse.data.projectId,
          assignedToId: taskResponse.data.assignedToId,
        });
      } catch (err) {
        setError('Failed to load task data');
        toast.error('Failed to load task data');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, form);
      setTask({ ...task, ...form });
      setEditing(false);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateTaskStatus(id, status);
      setTask({ ...task, status });
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TO_DO': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'DONE': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
      case 'MEDIUM': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
      case 'HIGH': return 'bg-orange-200 text-orange-800 dark:bg-orange-700 dark:text-orange-200';
      case 'URGENT': return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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

  if (error || !task) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Task not found'}</p>
          <button onClick={() => navigate('/tasks')} className="btn-primary">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{task.title}</h2>
        <button onClick={() => navigate('/tasks')} className="btn-secondary">
          Back to Tasks
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Information */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Task Information</h3>
              {canEdit && (
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-warning"
                >
                  {editing ? 'Cancel Edit' : 'Edit Task'}
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input"
                    rows="4"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="input"
                    >
                      <option value="TO_DO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="input"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Project ID</label>
                    <input
                      type="number"
                      value={form.projectId}
                      onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Assigned To</label>
                    <select
                      value={form.assignedToId || ''}
                      onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                      className="input"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                  <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                      {canEdit && (
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="input text-sm"
                        >
                          <option value="TO_DO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Priority</label>
                    <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Due Date</label>
                  <p className="text-gray-600 dark:text-gray-300">{task.dueDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Assigned To</label>
                  <p className="text-gray-600 dark:text-gray-300">
                    {task.assignedToName || 'Unassigned'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Actions */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Quick Actions</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Change Status</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input"
                disabled={!canEdit}
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Project</label>
              <button
                onClick={() => navigate(`/projects/${task.projectId}`)}
                className="btn-secondary w-full"
              >
                View Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 