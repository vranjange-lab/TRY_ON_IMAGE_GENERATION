import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import GalleryCard from '../../components/Gallery/GalleryCard.jsx';
import SectionTitle from '../../components/Common/SectionTitle.jsx';

const Gallery = () => {
  const { presetSarees, setSelectedSaree, resetTryOn } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Silk', 'Georgette', 'Organza'];

  // Handle saree select and redirect to upload page
  const handleTryOn = (saree) => {
    setSelectedSaree(saree);
    resetTryOn();
    navigate('/upload');
  };

  // Filtering Logic
  const filteredSarees = presetSarees.filter((saree) => {
    const matchesSearch = saree.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          saree.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || saree.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-brand-bg text-white pt-32 pb-24 overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <SectionTitle
          badge="Exquisite Collection"
          title="The Saree Library"
          subtitle="Explore handpicked designer sarees from premium weave categories. Click 'Try This On' to stage it in the AI try-on studio."
        />

        {/* Filter / Search Bar Panel */}
        <div className="glass-panel p-6 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/5 shadow-xl">
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sarees by weave, color, or motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d0a21]/50 border border-white/10 rounded-full pl-11 pr-5 py-3 text-sm font-light text-white placeholder-gray-500 focus:outline-hidden focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all duration-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-brand-primary/30'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 px-2 text-xs font-light text-gray-400">
          <p>Showing {filteredSarees.length} designer sarees</p>
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Catalog</span>
          </div>
        </div>

        {/* Grid Area */}
        {filteredSarees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSarees.map((saree) => (
              <GalleryCard
                key={saree.id}
                saree={saree}
                onTryOn={handleTryOn}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Sarees Found</h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              We couldn't find any sarees matching "{searchTerm}". Try checking your spelling or using a different category filter.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
