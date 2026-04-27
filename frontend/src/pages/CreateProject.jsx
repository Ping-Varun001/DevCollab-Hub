import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

const CreateProject = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        teamSize: 2,
        status: 'Open'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <div className="text-center mt-20 text-white">Please login to create a project.</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
            const res = await axios.post('/projects', {
                ...formData,
                requiredSkills: skillsArray,
                teamSize: Number(formData.teamSize)
            });
            navigate(`/projects/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Post a New Project</h1>

            <GlassCard className="p-8">
                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            placeholder="e.g. AI Content Generator"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            placeholder="Describe your project, the problem it solves, and what you're looking for..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Total Team Size Needed</label>
                            <input
                                type="number"
                                name="teamSize"
                                min="1"
                                max="20"
                                required
                                value={formData.teamSize}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(10,31,68,0.8)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            >
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Required Skills (comma separated)</label>
                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            placeholder="e.g. React, Node.js, UI/UX"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <CustomButton type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Project'}
                        </CustomButton>
                        <CustomButton type="button" variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </CustomButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default CreateProject;
