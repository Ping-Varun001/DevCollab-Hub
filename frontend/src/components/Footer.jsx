import React from 'react';
import { Code2, Globe, Mail, User } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass mt-auto border-t-0 border-b-0 border-x-0 border-t-[rgba(255,255,255,0.05)] rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="text-[var(--color-brand-accent)]" size={24} />
                        <span className="font-bold text-white tracking-wide">DevCollab</span>
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} DevCollab Hub. All rights reserved.
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-[var(--color-brand-accent)] transition-colors">
                            <Globe size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[var(--color-brand-accent)] transition-colors">
                            <Mail size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[var(--color-brand-accent)] transition-colors">
                            <User size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
