import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#03050d] pt-24 pb-12">
      {/* Background neon blur decor */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group self-start">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
                <div className="w-full h-full bg-brand-bg rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-accent" />
                </div>
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white">
                DRAPELY<span className="text-brand-secondary font-light">.AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed">
              Drapely AI is a next-generation virtual try-on experience utilizing cutting-edge diffusion and virtual try-on models to drape sarees instantly.
            </p>
            {/* Socials - Custom Premium SVGs */}
            <div className="flex gap-4 items-center">
              {/* Twitter/X */}
              <a href="#" className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center hover:border-brand-accent/50 hover:bg-brand-accent/5 text-gray-400 hover:text-brand-accent transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center hover:border-brand-primary/50 hover:bg-brand-primary/5 text-gray-400 hover:text-brand-primary transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center hover:border-brand-secondary/50 hover:bg-brand-secondary/5 text-gray-400 hover:text-brand-secondary transition-all duration-300">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" h="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Studio
            </h4>
            <ul className="flex flex-col gap-3 text-sm font-light text-gray-400">
              <li>
                <Link to="/upload" className="hover:text-brand-accent transition-colors duration-200">
                  Try-On Studio
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-accent transition-colors duration-200">
                  Saree Catalog
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-accent transition-colors duration-200">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Links Column */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Technology
            </h4>
            <ul className="flex flex-col gap-3 text-sm font-light text-gray-400">
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors duration-200">
                  IDM-VTON Model
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors duration-200">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary transition-colors duration-200">
                  Virtual Draping
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Subscribe to get updates on designer saree drops and AI features.
            </p>
            {/* Input box */}
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full glass-panel border-white/5 rounded-full px-5 py-3 pr-12 text-xs font-light text-white focus:outline-hidden focus:border-brand-primary/50 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-1.5 w-9 h-9 rounded-full bg-brand-primary hover:bg-brand-secondary flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                aria-label="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500">
          <p>© {new Date().getFullYear()} Drapely AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
