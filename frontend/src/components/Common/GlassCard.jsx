import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'purple',
  delay = 0
}) => {
  const glowStyles = {
    purple: 'hover:shadow-[0_0_35px_rgba(139,92,246,0.15)] hover:border-brand-primary/30',
    pink: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.15)] hover:border-brand-secondary/30',
    blue: 'hover:shadow-[0_0_35px_rgba(56,189,248,0.15)] hover:border-brand-accent/30',
    none: ''
  };

  const borderStyles = {
    purple: 'border-white/5 hover:border-brand-primary/20',
    pink: 'border-white/5 hover:border-brand-secondary/20',
    blue: 'border-white/5 hover:border-brand-accent/20',
    none: 'border-white/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-panel rounded-3xl p-8 relative overflow-hidden transition-all duration-500 border ${
        hoverEffect ? `hover:bg-brand-bg/60 -translate-y-0 hover:-translate-y-2 ${glowStyles[glowColor]} ${borderStyles[glowColor]}` : ''
      } ${className}`}
    >
      {/* Decorative backdrop light mesh glow inside the card */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />
      
      {children}
    </motion.div>
  );
};

export default GlassCard;
