import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

const ProjectDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load project details.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to apply.' });
            return;
        }

        setApplying(true);
        try {
            await axios.post('/applications', { projectId: id });
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to apply.' });
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!project) return <div className="text-center mt-20 text-red-400">Project not found</div>;

    const currentUserId = user ? (user._id || user.id) : null;
    const isMember = currentUserId && project.members.some(m => m._id === currentUserId || m === currentUserId);
    const isCreator = currentUserId && (project.createdBy._id === currentUserId || project.createdBy === currentUserId);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-200' : 'bg-red-500 bg-opacity-20 text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white text-glow">{project.title}</h1>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${project.status === 'Open' ? 'bg-green-500 bg-opacity-20 text-green-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-400">Created by <span className="text-[var(--color-brand-accent)]">{project.createdBy.name}</span></p>
                    </div>
                    
                    <div>
                        {isMember ? (
                            <Link to={`/chat/${project._id}`}>
                                <CustomButton variant="primary">Go to Project Chat</CustomButton>
                            </Link>
                        ) : (
                            <CustomButton 
                                variant="primary" 
                                onClick={handleApply} 
                                disabled={applying || project.status === 'Closed'}
                            >
                                {applying ? 'Applying...' : 'Apply to Join'}
                            </CustomButton>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">Description</h2>
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {project.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 border-b border-[rgba(255,255,255,0.1)] pb-2">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.requiredSkills.map((skill, idx) => (
                                    <span key={idx} className="bg-[rgba(212,175,55,0.1)] text-[var(--color-brand-accent)] border border-[rgba(212,175,55,0.3)] px-3 py-1 rounded text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <GlassCard className="p-6 bg-[rgba(0,0,0,0.2)]">
                            <h3 className="text-lg font-bold text-white mb-4">Team Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider">Capacity</p>
                                    <p className="text-white text-xl font-bold">{project.members.length} / {project.teamSize}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Members</p>
                                    <ul className="space-y-2">
                                        {project.members.map((member, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-300 bg-[rgba(255,255,255,0.05)] p-2 rounded">
                                                <div className="w-6 h-6 rounded-full bg-[var(--color-brand-accent)] text-gray-900 flex items-center justify-center text-xs font-bold">
                                                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="text-sm truncate">{member.name || 'Unknown'}</span>
                                                {(project.createdBy._id === member._id || project.createdBy === member._id) && (
                                                    <span className="ml-auto text-xs text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)] px-1 rounded">Owner</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </GlassCard>

                        {isCreator && (
                            <div className="text-center">
                                <Link to={`/applications?project=${project._id}`}>
                                    <CustomButton variant="outline" className="w-full">
                                        Manage Applications
                                    </CustomButton>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default ProjectDetail;
