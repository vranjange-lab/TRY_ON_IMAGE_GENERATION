import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Layers, Palette, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const Processing = () => {
  const { selectedSaree, setResultImage, userImage } = useApp();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { text: 'Analyzing avatar posture & dimensions...', icon: Cpu, color: 'text-brand-accent' },
    { text: 'Aligning saree pleats & fall dynamics...', icon: Layers, color: 'text-brand-primary' },
    { text: 'Synthesizing fabric textures & zari details...', icon: Palette, color: 'text-brand-secondary' },
    { text: 'Rendering HD output & shadow maps...', icon: Sparkles, color: 'text-brand-accent' }
  ];

  useEffect(() => {
    // If no saree or user image is staged, redirect back to upload
    if (!userImage || !selectedSaree) {
      navigate('/upload');
      return;
    }

    // Progress Bar increments (5 seconds total duration)
    const duration = 5000;
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(nextProgress);

      // Rotate through status texts based on progress
      if (nextProgress < 25) {
        setStatusIndex(0);
      } else if (nextProgress < 50) {
        setStatusIndex(1);
      } else if (nextProgress < 75) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        // Set the corresponding preset try-on output as the result
        // TODO: Backend Integration - replace with image output returned from API
        setResultImage(selectedSaree.resultImage);
        navigate('/result');
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [selectedSaree, userImage, navigate, setResultImage]);

  const CurrentStatusIcon = statuses[statusIndex].icon;

  return (
    <div className="relative min-h-screen bg-[#040612] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background ambient decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full flex flex-col items-center text-center relative z-10 gap-8">
        
        {/* Luxury AI themed loader */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* Ring 1 - Outer Pulsing Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-brand-accent/20"
          />

          {/* Ring 2 - Mid Glowing Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-brand-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          />

          {/* Ring 3 - Inner Glowing Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 rounded-full border border-brand-secondary/60 shadow-[0_0_25px_rgba(236,72,153,0.25)]"
          />

          {/* Center Orb Icon */}
          <div className="absolute inset-12 rounded-full bg-brand-bg border border-white/10 flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RefreshCw className="w-8 h-8 text-brand-accent animate-spin" style={{ animationDuration: '6s' }} />
            </motion.div>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-2">
          <span className="text-2xs font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/15 border border-brand-accent/20 px-3 py-1 rounded-full w-fit mx-auto mb-2 flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Cpu className="w-3 h-3" />
            IDM-VTON Diffusion Pipeline Active
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            Synthesizing Your Render
          </h2>
          <p className="text-gray-500 text-xs font-light">
            This will take less than 5 seconds. Do not refresh or exit.
          </p>
        </div>

        {/* Progress Bar & Statics */}
        <div className="w-full flex flex-col gap-3 mt-4">
          {/* Progress bar boundary */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Percentage */}
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>Progress</span>
            <span className="text-brand-secondary font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Current status display */}
        <div className="glass-panel p-4 rounded-2xl w-full flex items-center gap-4 border-white/5 text-left transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <CurrentStatusIcon className={`w-5 h-5 ${statuses[statusIndex].color}`} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Status</span>
            <span className="text-white text-xs font-medium tracking-wide">
              {statuses[statusIndex].text}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Processing;
