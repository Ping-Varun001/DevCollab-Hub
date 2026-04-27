import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Developer',
        skills: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert comma separated skills to array
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            await register({ ...formData, skills: skillsArray });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white text-glow">Create an Account</h2>
                    <p className="mt-2 text-gray-400">Join the DevCollab Hub community</p>
                </div>

                <GlassCard>
                    {error && (
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(10,31,68,0.8)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            >
                                <option value="Student">Student</option>
                                <option value="Developer">Developer</option>
                                <option value="Founder">Founder</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="e.g. React, Node.js, Python"
                                value={formData.skills}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-[var(--color-brand-accent)] outline-none"
                            />
                        </div>

                        <CustomButton type="submit" variant="primary" className="w-full mt-4">
                            Register
                        </CustomButton>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[var(--color-brand-accent)] hover:text-yellow-400 transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Register;
