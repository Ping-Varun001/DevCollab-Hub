import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { Search, Filter } from 'lucide-react';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSkill, setFilterSkill] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSkill = filterSkill === '' || project.requiredSkills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()));
        return matchesSearch && matchesSkill;
    });

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Explore Projects</h1>
                    <p className="text-gray-400">Discover and join exciting projects looking for collaborators.</p>
                </div>
                <Link to="/create-project">
                    <CustomButton variant="primary">Create Project</CustomButton>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors"
                    />
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Filter by skill..." 
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors"
                    />
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <GlassCard key={project._id} hover className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white line-clamp-1" title={project.title}>{project.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${project.status === 'Open' ? 'bg-green-500 bg-opacity-20 text-green-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>
                                    {project.status}
                                </span>
                            </div>
                            
                            <p className="text-gray-400 text-sm flex-grow line-clamp-3 mb-4">
                                {project.description}
                            </p>
                            
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Required Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.requiredSkills.slice(0, 4).map((skill, idx) => (
                                        <span key={idx} className="bg-[rgba(255,255,255,0.1)] text-gray-300 text-xs px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                    {project.requiredSkills.length > 4 && (
                                        <span className="text-gray-500 text-xs py-1">+{project.requiredSkills.length - 4} more</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 mt-auto flex justify-between items-center">
                                <div className="text-sm text-gray-400">
                                    Team: {project.members.length} / {project.teamSize}
                                </div>
                                <Link to={`/projects/${project._id}`}>
                                    <CustomButton variant="outline" className="text-sm py-1 px-4">
                                        View Details
                                    </CustomButton>
                                </Link>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No projects found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
