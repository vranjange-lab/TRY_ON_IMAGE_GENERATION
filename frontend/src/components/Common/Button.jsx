import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 font-display font-semibold rounded-full px-8 py-3.5 text-sm uppercase tracking-wider transition-all duration-300 select-none cursor-pointer focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'glow-btn-primary bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_auto] hover:bg-right text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] border border-white/10',
    secondary: 'glass-panel text-white hover:text-brand-accent hover:border-brand-accent/40 shadow-inner hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]',
    accent: 'bg-transparent text-brand-accent border border-brand-accent/30 hover:bg-brand-accent/10 hover:border-brand-accent/80 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    text: 'bg-transparent text-gray-400 hover:text-white border-0 px-4'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
      {children}
    </motion.button>
  );
};

export default Button;
