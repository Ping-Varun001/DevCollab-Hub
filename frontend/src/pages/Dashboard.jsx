import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { Folder, Users, Star, Plus } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ projects: 0, applications: 0, recommendations: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, you might have a specific dashboard endpoint. 
                // Here we'll fetch recommended projects as a proxy for dashboard content
                const recRes = await axios.get('/projects/recommended');
                const appsRes = await axios.get('/applications/me');
                
                // Fetch my projects
                const allProjRes = await axios.get('/projects');
                const currentUserId = user._id || user.id;
                const myProjects = allProjRes.data.filter(p => p.createdBy && (p.createdBy._id === currentUserId || p.createdBy === currentUserId));
                
                setStats({
                    projects: myProjects.length,
                    applications: appsRes.data.length,
                    recommendations: recRes.data.slice(0, 3)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (!user || loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}</h1>
                    <p className="text-gray-400 mt-1">Here's what's happening with your projects today.</p>
                </div>
                <Link to="/create-project">
                    <CustomButton variant="primary">
                        <Plus size={20} /> New Project
                    </CustomButton>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <GlassCard className="flex items-center p-6 border-l-4 border-l-[var(--color-brand-accent)]">
                    <div className="p-3 rounded-full bg-[rgba(212,175,55,0.1)] text-[var(--color-brand-accent)] mr-4">
                        <Folder size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">My Projects</p>
                        <p className="text-2xl font-bold text-white">{stats.projects}</p>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center p-6 border-l-4 border-l-blue-400">
                    <div className="p-3 rounded-full bg-blue-400 bg-opacity-10 text-blue-400 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Applications Sent</p>
                        <p className="text-2xl font-bold text-white">{stats.applications}</p>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center p-6 border-l-4 border-l-green-400">
                    <div className="p-3 rounded-full bg-green-400 bg-opacity-10 text-green-400 mr-4">
                        <Star size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-medium">Skill Matches</p>
                        <p className="text-2xl font-bold text-white">{stats.recommendations.length}</p>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recommended Projects */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Recommended for You</h2>
                        <Link to="/projects" className="text-sm text-[var(--color-brand-accent)] hover:underline">View all</Link>
                    </div>
                    
                    {stats.recommendations.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recommendations.map(project => (
                                <GlassCard key={project._id} className="p-5 hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                        </div>
                                        <div className="bg-[rgba(212,175,55,0.2)] text-[var(--color-brand-accent)] px-3 py-1 rounded-full text-sm font-bold">
                                            {project.matchPercentage}% Match
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.requiredSkills.map((skill, idx) => (
                                            <span key={idx} className="bg-[rgba(255,255,255,0.1)] text-gray-300 text-xs px-2 py-1 rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <Link to={`/projects/${project._id}`}>
                                            <CustomButton variant="outline" className="w-full text-sm py-1">View Details</CustomButton>
                                        </Link>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="p-8 text-center text-gray-400">
                            No recommendations found based on your skills. Try adding more skills to your profile.
                        </GlassCard>
                    )}
                </div>

                {/* Quick Actions / Recent Activity */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link to="/profile" className="block">
                            <GlassCard hover className="p-4 flex items-center justify-between border border-transparent hover:border-[var(--color-brand-accent)]">
                                <span className="text-gray-200">Edit Profile</span>
                                <span className="text-gray-500">→</span>
                            </GlassCard>
                        </Link>
                        <Link to="/applications" className="block">
                            <GlassCard hover className="p-4 flex items-center justify-between border border-transparent hover:border-[var(--color-brand-accent)]">
                                <span className="text-gray-200">Manage Applications</span>
                                <span className="text-gray-500">→</span>
                            </GlassCard>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
