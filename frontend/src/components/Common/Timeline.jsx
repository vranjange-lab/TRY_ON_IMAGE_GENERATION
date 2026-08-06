import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ShoppingBag, Cpu, Download } from 'lucide-react';

const Timeline = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Your Photo',
      description: 'Drag & drop a clear, front-facing portrait. Our model analyzes posture, skin tone, and measurements automatically.',
      icon: Upload,
      color: 'purple'
    },
    {
      step: '02',
      title: 'Choose a Saree',
      description: 'Browse our luxurious catalog of Silk, Organza, and Georgette sarees, or upload a custom image of your own choice.',
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      step: '03',
      title: 'AI Generates Result',
      description: 'The advanced IDM-VTON diffusion network drapes the saree around your body shape, realistically aligning fabric folds and shadows.',
      icon: Cpu,
      color: 'pink'
    },
    {
      step: '04',
      title: 'Download & Share',
      description: 'View the stunning high-definition before/after comparison slider, download the render, or immediately export to social media.',
      icon: Download,
      color: 'cyan'
    }
  ];

  return (
    <div id="how-it-works" className="relative z-10 py-12">
      {/* Decorative vertical line in background */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-primary/40 via-brand-secondary/40 to-brand-accent/40 -translate-x-1/2 hidden md:block" />

      <div className="flex flex-col gap-16 md:gap-24">
        {steps.map((item, index) => {
          const StepIcon = item.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={item.step}
              className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full ${
                isEven ? '' : 'md:flex-row-reverse'
              }`}
            >
              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-[45%] flex flex-col"
              >
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-colors" />
                  
                  {/* Step Number */}
                  <span className="font-display font-black text-6xl md:text-7xl text-white/5 group-hover:text-brand-primary/10 transition-colors duration-300 absolute top-4 right-6">
                    {item.step}
                  </span>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      item.color === 'purple' ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-primary' :
                      item.color === 'blue' ? 'bg-brand-accent/15 border-brand-accent/30 text-brand-accent' :
                      item.color === 'pink' ? 'bg-brand-secondary/15 border-brand-secondary/30 text-brand-secondary' :
                      'bg-sky-400/15 border-sky-400/30 text-sky-400'
                    }`}>
                      <StepIcon className="w-5 h-5 animate-pulse-slow" />
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm font-light leading-relaxed relative z-10">
                    {item.description}
                  </p>
                </div>
              </motion.div>

              {/* Timeline Center Node */}
              <div className="relative flex items-center justify-center z-10 w-12 h-12 rounded-full bg-brand-bg border-4 border-[#080d22] shadow-[0_0_15px_rgba(139,92,246,0.3)] hidden md:flex">
                <div className={`w-4 h-4 rounded-full ${
                  item.color === 'purple' ? 'bg-brand-primary' :
                  item.color === 'blue' ? 'bg-brand-accent' :
                  item.color === 'pink' ? 'bg-brand-secondary' :
                  'bg-sky-400'
                } animate-ping absolute duration-1000`} />
                <div className={`w-3.5 h-3.5 rounded-full ${
                  item.color === 'purple' ? 'bg-brand-primary' :
                  item.color === 'blue' ? 'bg-brand-accent' :
                  item.color === 'pink' ? 'bg-brand-secondary' :
                  'bg-sky-400'
                } relative z-20`} />
              </div>

              {/* Spacer on opposite side to balance grid */}
              <div className="w-full md:w-[45%] hidden md:block" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
