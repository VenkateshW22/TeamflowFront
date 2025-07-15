import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, updateProject, deleteProject } from '../api';
import { toast } from 'react-toastify';

export default function ProjectList({ user }) {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', projectManagerId: '' });
    const [editingId, setEditingId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const isProjectManager = user.roles.includes('ROLE_PROJECT_MANAGER');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await getProjects(page, 10, 'name,asc');
                setProjects(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to load projects';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (editingId) {
                await updateProject(editingId, form);
                setProjects(projects.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
                toast.success('Project updated successfully');
                setEditingId(null);
            } else {
                const response = await createProject(form);
                setProjects([...projects, response.data]);
                toast.success('Project created successfully');
            }
            setForm({ name: '', description: '', startDate: '', endDate: '', projectManagerId: '' });
            setShowCreateForm(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save project';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project) => {
        if (!isProjectManager) {
            toast.error('Only project managers can edit projects');
            return;
        }
        
        setForm({
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            projectManagerId: project.projectManagerId,
        });
        setEditingId(project.id);
        setShowCreateForm(false);
    };

    const handleDelete = async (id) => {
        if (!isProjectManager) {
            toast.error('Only project managers can delete projects');
            return;
        }
        
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        
        try {
            setLoading(true);
            await deleteProject(id);
            setProjects(projects.filter((p) => p.id !== id));
            toast.success('Project deleted successfully');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete project';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getProjectStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now < start) return { status: 'Not Started', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
        if (now > end) return { status: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' };
        return { status: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200' };
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Projects</h2>
                {isProjectManager && (
                    <button
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setEditingId(null);
                            setForm({ name: '', description: '', startDate: '', endDate: '', projectManagerId: '' });
                        }}
                        className="btn-primary"
                    >
                        {showCreateForm ? 'Cancel' : 'Create Project'}
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
            
            {/* Create/Edit Project Form */}
            {(showCreateForm || editingId) && (
                <div className="card mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                        {editingId ? 'Edit Project' : 'Create Project'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="input"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    className="input"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Project Manager ID</label>
                            <input
                                type="number"
                                value={form.projectManagerId}
                                onChange={(e) => setForm({ ...form, projectManagerId: e.target.value })}
                                className="input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="btn-primary flex items-center justify-center" disabled={loading}>
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                ) : (
                                    editingId ? 'Update Project' : 'Create Project'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingId(null);
                                    setForm({ name: '', description: '', startDate: '', endDate: '', projectManagerId: '' });
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
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Project List</h3>
                <div className="space-y-4">
                    {projects.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No projects found</p>
                    ) : (
                        projects.map((project) => {
                            const projectStatus = getProjectStatus(project.startDate, project.endDate);
                            return (
                                <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100">{project.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className={`badge ${projectStatus.color}`}>{projectStatus.status}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        Start: {project.startDate} | End: {project.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Manager: {project.projectManagerName}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/projects/${project.id}`)}
                                                className="btn-secondary text-sm ml-4"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                    {isProjectManager && (
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="btn-warning"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="btn-danger"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="flex justify-between items-center mt-4">
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
