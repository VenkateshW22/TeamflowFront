import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, updateUserRoles, deleteUser } from '../api';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    roles: ['ROLE_TEAM_MEMBER']
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(page, 10);
        setUsers(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError('Failed to load users');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createUser(form);
      setUsers([...users, response.data]);
      setShowCreateForm(false);
      setForm({ username: '', email: '', password: '', roles: ['ROLE_TEAM_MEMBER'] });
      toast.success('User created successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (id, roles) => {
    try {
      setLoading(true);
      await updateUserRoles(id, roles);
      setUsers(users.map((u) => (u.id === id ? { ...u, roles } : u)));
      toast.success('User roles updated successfully');
    } catch (err) {
      setError('Failed to update roles');
      toast.error('Failed to update roles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      roles: user.roles?.map(role => typeof role === 'object' ? role.name : role) || []
    });
    setEditingId(user.id);
    setShowCreateForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser(editingId, form);
      setUsers(users.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      setEditingId(null);
      setForm({ username: '', email: '', password: '', roles: ['ROLE_TEAM_MEMBER'] });
      toast.success('User updated successfully');
    } catch (err) {
      setError('Failed to update user');
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_PROJECT_MANAGER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'ROLE_TEAM_MEMBER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h2>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingId(null);
            setForm({ username: '', email: '', password: '', roles: ['ROLE_TEAM_MEMBER'] });
          }}
          className="btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Create User'}
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
      {loading && (
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}





      {/* Create User Form */}
      {showCreateForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create New User</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Roles</label>
              <select
                multiple
                value={form.roles}
                onChange={(e) => {
                  const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
                  setForm({ ...form, roles: selectedRoles });
                }}
                className="input"
                disabled={loading}
              >
                <option value="ROLE_TEAM_MEMBER">Team Member</option>
                <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple roles</p>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setForm({ username: '', email: '', password: '', roles: ['ROLE_TEAM_MEMBER'] });
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

      {/* Edit User Form */}
      {editingId && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Edit User</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Roles</label>
              <select
                multiple
                value={form.roles}
                onChange={(e) => {
                  const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
                  setForm({ ...form, roles: selectedRoles });
                }}
                className="input"
                disabled={loading}
              >
                <option value="ROLE_TEAM_MEMBER">Team Member</option>
                <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple roles</p>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ username: '', email: '', password: '', roles: ['ROLE_TEAM_MEMBER'] });
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

      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Users</h3>
        <div className="space-y-4">
          {!users || users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No users found</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{user.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        <div className="flex space-x-2 mt-1">
                          {user.roles?.map((role, index) => (
                            <span key={typeof role === 'object' ? role.id || index : role} className={`badge ${getRoleColor(typeof role === 'object' ? role.name : role)}`}>
                              {typeof role === 'object' ? (role.name === 'ROLE_PROJECT_MANAGER' ? 'Project Manager' : 'Team Member') : (role === 'ROLE_PROJECT_MANAGER' ? 'Project Manager' : 'Team Member')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn-warning"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <select
                      multiple
                      value={user.roles?.map(role => typeof role === 'object' ? role.name : role) || []}
                      onChange={(e) => {
                        const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
                        handleRoleUpdate(user.id, selectedRoles);
                      }}
                      className="input p-2 text-sm"
                      disabled={loading}
                    >
                      <option value="ROLE_TEAM_MEMBER">Team Member</option>
                      <option value="ROLE_PROJECT_MANAGER">Project Manager</option>
                    </select>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-danger"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
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
