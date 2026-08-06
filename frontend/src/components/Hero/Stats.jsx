import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Users, Zap } from 'lucide-react';
import GlassCard from '../Common/GlassCard.jsx';

const Stats = () => {
  const statItems = [
    {
      id: 1,
      number: '1.2M+',
      label: 'Sarees Generated',
      icon: Zap,
      color: 'purple',
      description: 'Realistic drapes created using our advanced IDM-VTON diffusion pipeline.'
    },
    {
      id: 2,
      number: '99.4%',
      label: 'Realism Rating',
      icon: ShieldCheck,
      color: 'blue',
      description: 'Evaluated by fashion tech experts for wrinkle accuracy and texture rendering.'
    },
    {
      id: 3,
      number: '150+',
      label: 'Designer Partners',
      icon: Users,
      color: 'pink',
      description: 'Collaborations with top saree weavers, boutiques, and couture brands.'
    }
  ];

  return (
    <section className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard
                key={stat.id}
                hoverEffect={true}
                glowColor={stat.color}
                delay={index * 0.15}
                className="flex flex-col gap-4 text-left group"
              >
                {/* Icon wrapper */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                  stat.color === 'purple' ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary group-hover:bg-brand-primary group-hover:text-white' :
                  stat.color === 'pink' ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white' :
                  'bg-brand-accent/10 border-brand-accent/20 text-brand-accent group-hover:bg-brand-accent group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Value */}
                <h3 className="font-display font-extrabold text-5xl tracking-tight text-white mt-2">
                  {stat.number}
                </h3>
                
                {/* Title */}
                <h4 className="font-display font-bold text-sm text-gray-200 tracking-wide uppercase">
                  {stat.label}
                </h4>
                
                {/* Description */}
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  {stat.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
