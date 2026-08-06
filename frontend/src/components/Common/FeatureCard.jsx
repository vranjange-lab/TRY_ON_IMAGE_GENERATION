import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard.jsx';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  glowColor = 'purple',
  delay = 0
}) => {
  return (
    <GlassCard
      hoverEffect={true}
      glowColor={glowColor}
      delay={delay}
      className="flex flex-col text-left gap-4 h-full relative group"
    >
      {/* Glow border overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:text-brand-accent group-hover:border-brand-accent/50 transition-all duration-300">
        {Icon && <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-lg md:text-xl text-white mt-2 group-hover:text-brand-accent transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm font-light leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
};

export default FeatureCard;
