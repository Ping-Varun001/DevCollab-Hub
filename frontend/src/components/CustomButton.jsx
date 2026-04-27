import React from 'react';

const CustomButton = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-2 rounded-full font-medium transition-all duration-300 focus:outline-none flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-[var(--color-brand-accent)] text-gray-900 hover:button-glow-hover button-glow",
        secondary: "bg-transparent border border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)] hover:text-gray-900",
        outline: "bg-transparent border border-gray-400 text-gray-300 hover:border-white hover:text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default CustomButton;
