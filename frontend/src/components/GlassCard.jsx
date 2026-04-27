import React from 'react';

const GlassCard = ({ children, className = '', hover = false }) => {
    return (
        <div className={`glass rounded-2xl p-6 ${hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[rgba(212,175,55,0.1)]' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
