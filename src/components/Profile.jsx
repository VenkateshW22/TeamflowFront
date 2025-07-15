import { useState, useEffect } from 'react';
import { getUser, updateUser } from '../api';
import { toast } from 'react-toastify';

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUser(user.id);
        setProfile(response.data);
        setForm({
          username: response.data.username,
          email: response.data.email,
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const updateData = {
        username: form.username,
        email: form.email
      };
      
      // Only include password if it's being changed
      if (form.password) {
        updateData.password = form.password;
      }

      await updateUser(user.id, updateData);
      
      // Update the profile state
      setProfile(prev => ({
        ...prev,
        username: form.username,
        email: form.email
      }));
      
      // Clear password fields
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      username: profile?.username || '',
      email: profile?.email || '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ROLE_PROJECT_MANAGER':
        return 'Project Manager';
      case 'ROLE_TEAM_MEMBER':
        return 'Team Member';
      default:
        return role;
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

  if (loading && !profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </div>
    );
  }





  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <div className="card">
          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {profile?.username}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{profile?.email}</p>
                  <div className="flex space-x-2 mt-2">
                    {profile?.roles?.map((role, index) => (
                      <span key={typeof role === 'object' ? role.id || index : role} className={`badge ${getRoleColor(typeof role === 'object' ? role.name : role)}`}>
                        {getRoleDisplayName(typeof role === 'object' ? role.name : role)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">User ID</label>
                      <p className="text-gray-800 dark:text-gray-100">{profile?.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
                      <p className="text-gray-800 dark:text-gray-100">{profile?.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-800 dark:text-gray-100">{profile?.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Roles & Permissions</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Current Roles</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile?.roles?.map((role, index) => (
                          <span key={typeof role === 'object' ? role.id || index : role} className={`badge ${getRoleColor(typeof role === 'object' ? role.name : role)}`}>
                            {getRoleDisplayName(typeof role === 'object' ? role.name : role)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Permissions</label>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        <li>• View projects and tasks</li>
                        <li>• Update task status</li>
                        {profile?.roles?.some(role => {
                          const roleName = typeof role === 'object' ? role.name : role;
                          return roleName === 'ROLE_PROJECT_MANAGER';
                        }) && (
                          <>
                            <li>• Create and manage projects</li>
                            <li>• Create and manage tasks</li>
                            <li>• Manage user accounts</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {form.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Edit Profile
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Update your account information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input"
                      disabled={loading}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="input"
                      disabled={loading}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Leave password fields blank if you don't want to change your password.
                </p>
              </div>

              <div className="flex space-x-3 pt-6">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 