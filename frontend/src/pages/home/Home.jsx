import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Maximize2,
  Sparkles,
  Zap,
  Shield,
  Download,
  Lightbulb,
  ChevronDown,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import Hero from '../../components/Hero/Hero.jsx';
import Stats from '../../components/Hero/Stats.jsx';
import SectionTitle from '../../components/Common/SectionTitle.jsx';
import FeatureCard from '../../components/Common/FeatureCard.jsx';
import Timeline from '../../components/Common/Timeline.jsx';
import Button from '../../components/Common/Button.jsx';
import GlassCard from '../../components/Common/GlassCard.jsx';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Wand2,
      title: 'AI Virtual Try-On',
      description: 'See yourself in premium designer sarees instantly using state-of-the-art virtual try-on models.',
      glow: 'purple'
    },
    {
      icon: Maximize2,
      title: 'Realistic Draping',
      description: 'Accurate fabric fall, pleats, and contour alignments adapting to your unique body posture.',
      glow: 'pink'
    },
    {
      icon: Sparkles,
      title: 'Ultra HD Output',
      description: 'Renders in high definition, preserving cloth textures, metallic zari borders, and intricate embroidery.',
      glow: 'blue'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No waiting for hours. Get your realistic virtual draping result rendered in under 5 seconds.',
      glow: 'purple'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your uploaded photos are secured, processed locally in memory, and never stored without consent.',
      glow: 'blue'
    },
    {
      icon: Download,
      title: 'Download Images',
      description: 'Save try-on renders instantly in high resolution, ready to share with friends, family, or social media.',
      glow: 'pink'
    },
    {
      icon: Lightbulb,
      title: 'Future AI Recommendations',
      description: 'Receive personalized saree recommendations based on skin tone, height, and style preferences.',
      glow: 'purple'
    }
  ];

  const faqs = [
    {
      question: 'How does the AI Virtual Try-On work?',
      answer: 'Drapely AI uses IDM-VTON, an advanced diffusion-based image-to-image virtual try-on network. When you upload a photo of yourself and a saree, the AI segments the clothing, understands your posture and shape, and drapes the saree realistically with natural creases, wrinkles, and shadows.'
    },
    {
      question: 'What kind of photo should I upload for best results?',
      answer: 'For ideal results, upload a well-lit, high-resolution front-facing portrait. Wearing form-fitting or simple clothing (like a plain t-shirt and leggings or jeans) allows the AI to accurately detect your body proportions and fit the saree perfectly.'
    },
    {
      question: 'Is my personal data and photo secure?',
      answer: 'Absolutely. Privacy is our core foundation. Your uploaded photos are strictly processed in volatile GPU memory during generation and immediately discarded. We do not store, distribute, or train models on user-provided images.'
    },
    {
      question: 'Can I upload a saree from any website or photo?',
      answer: 'Yes! The custom upload section in our Studio staging environment allows you to upload any saree image—whether it is a photo from a catalog, ecommerce site, or a snapshot from a phone. The AI will extract the fabric and drape it.'
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-white overflow-hidden">
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Features Grid */}
      <section className="relative py-24 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionTitle
            badge="Studio Capabilities"
            title="Engineered For Perfect Draping"
            subtitle="Explore our advanced suite of AI features designed to deliver unmatched realism and styling convenience."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feat, index) => (
              <div key={feat.title} className={index === features.length - 1 ? 'md:col-span-2 lg:col-span-3 xl:col-span-1' : ''}>
                <FeatureCard
                  icon={feat.icon}
                  title={feat.title}
                  description={feat.description}
                  glowColor={feat.glow}
                  delay={index * 0.1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="relative py-24 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionTitle
            badge="Simple Workflow"
            title="How Drapely Works"
            subtitle="Four easy steps to visualize yourself in any designer saree within seconds."
          />
          <Timeline />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 z-10 border-t border-white/5 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-secondary/5 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTitle
            badge="FAQ"
            title="Common Questions"
            subtitle="Everything you need to know about Drapely AI virtual try-on studio."
          />

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <GlassCard
                key={index}
                hoverEffect={false}
                className="!p-6 cursor-pointer"
              >
                <div
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-5 h-5 text-brand-accent shrink-0" />
                    <span className="font-display font-semibold text-base md:text-lg text-white">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 text-sm font-light leading-relaxed mt-4 pl-9 border-l border-brand-primary/30">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-[#0c0827]/40 to-brand-bg pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <GlassCard
            hoverEffect={true}
            glowColor="purple"
            className="flex flex-col items-center gap-8 py-16 px-8 md:px-16"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-accent">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white tracking-tight">
              Ready to See Yourself <br />
              in <span className="text-gradient-purple-pink">Designer Sarees?</span>
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-xl">
              Step into the virtual studio and try on pure silk, organza, and embroidered georgette sarees instantly with AI.
            </p>
            
            <Link to="/upload">
              <Button variant="primary" icon={Wand2} className="group">
                Launch Try-On Studio
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

    </div>
  );
};

export default Home;
