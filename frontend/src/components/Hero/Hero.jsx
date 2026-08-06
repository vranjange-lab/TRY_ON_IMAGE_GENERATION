import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Button from '../Common/Button.jsx';
import HeroCanvas from './HeroCanvas.jsx';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Aurora moving gradient mesh */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl animate-aurora pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12 md:py-20">
        
        {/* Text Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center text-left"
        >
          {/* Badge Tagline */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/25 shadow-[0_0_15px_rgba(139,92,246,0.15)] mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-brand-accent uppercase">
              Next-Gen Diffusion Technology
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-white mb-6"
          >
            Try Before <br />
            You Buy With <span className="text-gradient-purple-pink">AI Draping</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-10"
          >
            Upload your photo, select your dream designer saree, and experience realistic AI-powered virtual try-on within seconds. Fast, premium, and stunningly realistic.
          </motion.p>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
            <Link to="/upload">
              <Button variant="primary" icon={Wand2} className="group">
                Try Now
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button variant="secondary" icon={ImageIcon}>
                Explore Gallery
              </Button>
            </Link>
          </motion.div>

          {/* Micro Stats or Trust */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/5 flex gap-8 text-gray-500 text-xs tracking-wider uppercase font-semibold"
          >
            <div>
              <span className="text-white text-base block font-bold font-display">99.4%</span>
              Drape Realism
            </div>
            <div className="border-r border-white/10" />
            <div>
              <span className="text-white text-base block font-bold font-display">&lt; 5s</span>
              Generation Time
            </div>
            <div className="border-r border-white/10" />
            <div>
              <span className="text-white text-base block font-bold font-display">Ultra HD</span>
              Resolution output
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Canvas Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-5 w-full h-[400px] md:h-[650px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        >
          <HeroCanvas />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
