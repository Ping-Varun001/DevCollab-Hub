import React from 'react';
import { Link } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import GlassCard from '../components/GlassCard';
import { Users, Code, MessageSquare, Rocket } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--color-brand-accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[var(--color-brand-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

                <div className="text-center z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Find Your Perfect <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-accent)] to-yellow-200">
                            Dev Team
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                        The intelligent networking platform connecting developers, students, and founders to build amazing projects together.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/register">
                            <CustomButton variant="primary" className="text-lg px-8 py-4">
                                Get Started <Rocket size={20} />
                            </CustomButton>
                        </Link>
                        <Link to="/projects">
                            <CustomButton variant="outline" className="text-lg px-8 py-4 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
                                Explore Projects
                            </CustomButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 text-glow">Why DevCollab?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <GlassCard hover className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center text-[var(--color-brand-accent)]">
                                <Code size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Skill-Based Matching</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Our intelligent algorithm pairs you with projects that perfectly align with your tech stack and expertise level.
                            </p>
                        </GlassCard>

                        <GlassCard hover className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center text-[var(--color-brand-accent)]">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Form well-rounded teams for hackathons, startups, or open-source. Find the missing piece of your puzzle.
                            </p>
                        </GlassCard>

                        <GlassCard hover className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center text-[var(--color-brand-accent)]">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Real-Time Chat</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Communicate seamlessly with your team members in dedicated project chat rooms built right into the platform.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <GlassCard className="text-center p-12 bg-gradient-to-r from-[rgba(10,31,68,0.8)] to-[rgba(212,175,55,0.2)] border-[var(--color-brand-accent)] border-opacity-30">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start Building Together Today</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers who are already collaborating on the next big thing.
                        </p>
                        <Link to="/register">
                            <CustomButton variant="primary" className="text-lg px-10 py-4 inline-flex">
                                Join the Community
                            </CustomButton>
                        </Link>
                    </GlassCard>
                </div>
            </section>
        </div>
    );
};

export default Landing;
