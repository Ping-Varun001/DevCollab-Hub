import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white text-glow">Welcome Back</h2>
                    <p className="mt-2 text-gray-400">Sign in to your account</p>
                </div>

                <GlassCard>
                    {error && (
                        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)] focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded bg-[rgba(255,255,255,0.05)] border-gray-300 text-[var(--color-brand-accent)] focus:ring-[var(--color-brand-accent)]" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <CustomButton type="submit" variant="primary" className="w-full">
                            <LogIn size={20} /> Sign In
                        </CustomButton>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-[var(--color-brand-accent)] hover:text-yellow-400 transition-colors">
                            Register here
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Login;
