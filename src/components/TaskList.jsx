import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask, getUsers } from '../api';
import { toast } from 'react-toastify';

export default function TaskList({ user }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TO_DO',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: '',
    assignedToId: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedToId: '',
  });
  const isProjectManager = user.roles.includes('ROLE_PROJECT_MANAGER');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, usersResponse] = await Promise.all([
          getTasks(page, 10, filters),
          getUsers()
        ]);
        setTasks(tasksResponse.data.content);
        setTotalPages(tasksResponse.data.totalPages);
        setUsers(usersResponse.data);
      } catch (err) {
        setError('Failed to load tasks or users');
        toast.error('Failed to load tasks or users');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        await updateTask(editingId, form);
        setTasks(tasks.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
        toast.success('Task updated successfully');
        setEditingId(null);
      } else {
        const response = await createTask(form);
        setTasks([...tasks, response.data]);
        toast.success('Task created successfully');
      }
      setForm({ title: '', description: '', status: 'TO_DO', priority: 'MEDIUM', dueDate: '', projectId: '', assignedToId: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to save task');
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    // Only project managers or task assignees can edit tasks
    if (!isProjectManager && task.assignedToId !== user.id) {
      toast.error('You can only edit tasks assigned to you');
      return;
    }
    
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      assignedToId: task.assignedToId,
    });
    setEditingId(task.id);
    setShowCreateForm(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      setLoading(true);
      await updateTaskStatus(id, status);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
      toast.success('Task status updated successfully');
    } catch (err) {
      setError('Failed to update task status');
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isProjectManager) {
      toast.error('Only project managers can delete tasks');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const canEditTask = (task) => {
    return isProjectManager || task.assignedToId === user.id;
  };

  const canDeleteTask = (task) => {
    return isProjectManager;
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tasks</h2>
        {isProjectManager && (
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingId(null);
              setForm({ title: '', description: '', status: 'TO_DO', priority: 'MEDIUM', dueDate: '', projectId: '', assignedToId: '' });
            }}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : 'Create Task'}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
      {loading && (
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {/* Create/Edit Task Form */}
      {(showCreateForm || editingId) && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {editingId ? 'Edit Task' : 'Create Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input"
                rows="4"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input"
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="input"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Project ID</label>
                <input
                  type="number"
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="input"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Assigned To</label>
              <select
                value={form.assignedToId}
                onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                className="input"
                disabled={loading}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Task' : 'Create Task')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingId(null);
                  setForm({ title: '', description: '', status: 'TO_DO', priority: 'MEDIUM', dueDate: '', projectId: '', assignedToId: '' });
                }}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="input"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Assigned To</label>
            <select
              value={filters.assignedToId}
              onChange={(e) => handleFilterChange('assignedToId', e.target.value)}
              className="input"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Task List</h3>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                      <div className="flex space-x-2 mt-2">
                        <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                        <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to: {task.assignedToName || 'Unassigned'}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="btn-secondary text-sm ml-4"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {canEditTask(task) && (
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn-warning"
                      disabled={loading}
                    >
                      Edit
                    </button>
                  )}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="input p-2 text-sm"
                    disabled={loading}
                  >
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                  {canDeleteTask(task) && (
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn-danger"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="btn-primary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="btn-primary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
