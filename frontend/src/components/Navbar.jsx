import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Menu, X } from 'lucide-react';
import CustomButton from './CustomButton';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 glass border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white text-glow">
                        <Code2 className="text-[var(--color-brand-accent)]" size={28} />
                        <span>DevCollab Hub</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Explore</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
                                <CustomButton onClick={handleLogout} variant="outline" className="px-4 py-1">Logout</CustomButton>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                                <Link to="/register">
                                    <CustomButton variant="primary" className="px-4 py-1">Get Started</CustomButton>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass px-4 pt-2 pb-4 space-y-2">
                    <Link to="/projects" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Explore</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <Link to="/profile" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Profile</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white py-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="block text-[var(--color-brand-accent)] py-2" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
