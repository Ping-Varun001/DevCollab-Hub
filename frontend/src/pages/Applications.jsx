import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

const Applications = () => {
    const { user } = useAuth();
    const [sentApplications, setSentApplications] = useState([]);
    const [receivedApplications, setReceivedApplications] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedProjectId = queryParams.get('project');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Fetch applications sent by me
                const sentRes = await axios.get('/applications/me');
                setSentApplications(sentRes.data);

                // Fetch my projects to get applications received
                const projectsRes = await axios.get('/projects');
                const currentUserId = user._id || user.id;
                const mine = projectsRes.data.filter(p => p.createdBy && (p.createdBy._id === currentUserId || p.createdBy === currentUserId));
                setMyProjects(mine);

                // Fetch applications for my projects
                const received = [];
                for (const project of mine) {
                    const res = await axios.get(`/applications/project/${project._id}`);
                    res.data.forEach(app => {
                        received.push({ ...app, projectName: project.title });
                    });
                }
                setReceivedApplications(received);

                if (sentRes.data.length > 0 && received.length === 0) {
                    setActiveTab('sent');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchApplications();
        }
    }, [user]);

    const handleApplicationAction = async (appId, status) => {
        try {
            await axios.put(`/applications/${appId}`, { status });
            // Update local state
            setReceivedApplications(prev => 
                prev.map(app => app._id === appId ? { ...app, status } : app)
            );
        } catch (err) {
            console.error(err);
            alert('Failed to update application');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    const filteredReceived = selectedProjectId 
        ? receivedApplications.filter(app => app.projectId === selectedProjectId)
        : receivedApplications;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Manage Applications</h1>

            <div className="flex border-b border-[rgba(255,255,255,0.1)] mb-8">
                <button 
                    className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'received' ? 'border-b-2 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('received')}
                >
                    Received Applications ({filteredReceived.length})
                </button>
                <button 
                    className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'sent' ? 'border-b-2 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)]' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('sent')}
                >
                    Sent Applications ({sentApplications.length})
                </button>
            </div>

            {activeTab === 'received' && (
                <div className="space-y-6">
                    {filteredReceived.length > 0 ? (
                        filteredReceived.map(app => (
                            <GlassCard key={app._id} className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-white">{app.userId.name}</h3>
                                            <span className="bg-[rgba(255,255,255,0.1)] text-xs px-2 py-1 rounded text-gray-300">
                                                {app.userId.role}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">Applied to: <span className="text-white">{app.projectName}</span></p>
                                        <p className="text-gray-400 text-sm">Experience: {app.userId.experience}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {app.userId.skills && app.userId.skills.map((skill, idx) => (
                                                <span key={idx} className="bg-[rgba(212,175,55,0.1)] text-[var(--color-brand-accent)] text-xs px-2 py-1 rounded border border-[rgba(212,175,55,0.2)]">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="mb-2">
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                app.status === 'Accepted' ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500' : 
                                                app.status === 'Rejected' ? 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500' : 
                                                'bg-yellow-500 bg-opacity-20 text-yellow-300 border border-yellow-500'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        {app.status === 'Pending' && (
                                            <div className="flex gap-2 mt-2">
                                                <CustomButton variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm py-1" onClick={() => handleApplicationAction(app._id, 'Rejected')}>
                                                    Reject
                                                </CustomButton>
                                                <CustomButton variant="primary" className="text-sm py-1" onClick={() => handleApplicationAction(app._id, 'Accepted')}>
                                                    Accept
                                                </CustomButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No applications received yet.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'sent' && (
                <div className="space-y-6">
                    {sentApplications.length > 0 ? (
                        sentApplications.map(app => (
                            <GlassCard key={app._id} className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{app.projectId?.title || 'Unknown Project'}</h3>
                                        <p className="text-gray-400 text-sm">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                                            app.status === 'Accepted' ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500' : 
                                            app.status === 'Rejected' ? 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500' : 
                                            'bg-yellow-500 bg-opacity-20 text-yellow-300 border border-yellow-500'
                                        }`}>
                                            Status: {app.status}
                                        </span>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            You haven't applied to any projects yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Applications;
