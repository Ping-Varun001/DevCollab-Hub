import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        role: '',
        experience: '',
        skills: '',
        availability: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                role: user.role || 'Developer',
                experience: user.experience || 'Beginner',
                skills: user.skills ? user.skills.join(', ') : '',
                availability: user.availability || 'Part-time'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const res = await axios.put('/users/me', { ...formData, skills: skillsArray });
            setUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    if (!user) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-200' : 'bg-red-500 bg-opacity-20 text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <GlassCard className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-[var(--color-brand-accent)] text-gray-900 flex items-center justify-center text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <CustomButton onClick={() => setIsEditing(true)} variant="outline">
                            Edit Profile
                        </CustomButton>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-8 border-t border-[rgba(255,255,255,0.1)] pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-300">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 bg-[rgba(10,31,68,0.8)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white">
                                    <option value="Student">Student</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Founder">Founder</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-300">Bio</label>
                                <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full mt-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300">Experience</label>
                                <select name="experience" value={formData.experience} onChange={handleChange} className="w-full mt-1 bg-[rgba(10,31,68,0.8)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300">Availability</label>
                                <select name="availability" value={formData.availability} onChange={handleChange} className="w-full mt-1 bg-[rgba(10,31,68,0.8)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white">
                                    <option value="Part-time">Part-time</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Weekends">Weekends Only</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-300">Skills (comma separated)</label>
                                <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full mt-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <CustomButton type="submit" variant="primary">Save Changes</CustomButton>
                            <CustomButton type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</CustomButton>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 border-t border-[rgba(255,255,255,0.1)] pt-8 space-y-6">
                        <div>
                            <h3 className="text-sm text-gray-400 font-medium">Bio</h3>
                            <p className="text-gray-200 mt-1">{user.bio || 'No bio provided.'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm text-gray-400 font-medium">Role</h3>
                                <p className="text-gray-200 mt-1">{user.role}</p>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400 font-medium">Experience</h3>
                                <p className="text-gray-200 mt-1">{user.experience}</p>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-400 font-medium">Availability</h3>
                                <p className="text-gray-200 mt-1">{user.availability}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400 font-medium mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, index) => (
                                        <span key={index} className="bg-[rgba(212,175,55,0.1)] text-[var(--color-brand-accent)] border border-[rgba(212,175,55,0.3)] px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No skills added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default Profile;
