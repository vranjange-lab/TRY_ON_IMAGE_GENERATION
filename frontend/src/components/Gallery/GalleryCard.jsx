import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, ShoppingCart } from 'lucide-react';
import Button from '../Common/Button.jsx';

const GalleryCard = ({ saree, onTryOn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-3xl overflow-hidden group border border-white/5 hover:border-brand-primary/30 transition-all duration-500 relative flex flex-col justify-between"
    >
      {/* Category Tag */}
      <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-2xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/15 backdrop-filter backdrop-blur-md border border-brand-accent/20">
        {saree.category}
      </span>

      {/* Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#0d0a21]">
        <img
          src={saree.image}
          alt={saree.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-60 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Content Box */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-accent transition-colors duration-300 line-clamp-1">
              {saree.name}
            </h3>
            <span className="font-display font-extrabold text-sm text-brand-secondary shrink-0 ml-2">
              {saree.price}
            </span>
          </div>
          <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-2">
            {saree.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            icon={Wand2}
            className="w-full !py-2.5 !text-xs"
            onClick={() => onTryOn(saree)}
          >
            Try This On
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
