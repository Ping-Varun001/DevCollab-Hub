import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { Trash2, Users, Edit3 } from 'lucide-react';

const ManageProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        teamSize: 1,
        status: 'Open'
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/projects/${id}`);
                const p = res.data;
                const currentUserId = user ? (user._id || user.id) : null;
                
                // Only allow creator to manage
                if (!currentUserId || (p.createdBy._id !== currentUserId && p.createdBy !== currentUserId)) {
                    navigate(`/projects/${id}`);
                    return;
                }
                
                setProject(p);
                setFormData({
                    title: p.title,
                    description: p.description,
                    requiredSkills: p.requiredSkills.join(', '),
                    teamSize: p.teamSize,
                    status: p.status
                });
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load project details.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            const skillsArray = formData.requiredSkills.split(',').map(skill => skill.trim()).filter(s => s !== '');
            const payload = {
                ...formData,
                requiredSkills: skillsArray
            };
            
            await axios.put(`/projects/${id}`, payload);
            setMessage({ type: 'success', text: 'Project updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update project.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
        
        try {
            await axios.delete(`/projects/${id}`);
            navigate('/dashboard');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete project.' });
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to remove this member from the project?')) return;
        
        try {
            await axios.delete(`/projects/${id}/members/${memberId}`);
            // Update local state
            setProject(prev => ({
                ...prev,
                members: prev.members.filter(m => m._id !== memberId)
            }));
            setMessage({ type: 'success', text: 'Member removed.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to remove member.' });
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!project) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Edit3 className="text-[var(--color-brand-accent)]" /> Manage Project
                </h1>
                <CustomButton variant="outline" onClick={() => navigate(`/projects/${id}`)}>
                    Back to Project
                </CustomButton>
            </div>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-200' : 'bg-red-500 bg-opacity-20 text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">Edit Details</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-accent)]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-accent)]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="requiredSkills"
                                    value={formData.requiredSkills}
                                    onChange={handleChange}
                                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-accent)]"
                                    placeholder="e.g. React, Node.js, MongoDB"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Team Size</label>
                                    <input
                                        type="number"
                                        name="teamSize"
                                        value={formData.teamSize}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-accent)]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-[#1a1a2e] border border-[rgba(255,255,255,0.1)] rounded px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-accent)]"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <CustomButton type="submit" variant="primary" className="w-full" disabled={updating}>
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </CustomButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Right Column: Members and Danger Zone */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2 flex items-center gap-2">
                            <Users size={20} /> Manage Members
                        </h2>
                        <ul className="space-y-3">
                            {project.members.map((member) => (
                                <li key={member._id} className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-3 rounded">
                                    <span className="text-sm text-white truncate max-w-[120px]">{member.name || 'Unknown User'}</span>
                                    {member._id === project.createdBy._id || member._id === project.createdBy ? (
                                        <span className="text-xs text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)] px-2 py-1 rounded">Owner</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleRemoveMember(member._id)}
                                            className="text-white-400 hover:text-red-300 bg-red-400 bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded text-xs transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-6 border-red-500 border-opacity-30">
                        <h2 className="text-xl font-bold text-red-400 mb-4 border-b border-red-500 border-opacity-30 pb-2 flex items-center gap-2">
                            <Trash2 size={20} /> Danger Zone
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Once you delete a project, there is no going back. Please be certain.
                        </p>
                        <button 
                            onClick={handleDelete}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Delete Project
                        </button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default ManageProject;
