import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Wand2, ArrowLeft, Columns, Sliders, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../../components/Common/Button.jsx';
import SectionTitle from '../../components/Common/SectionTitle.jsx';
import GlassCard from '../../components/Common/GlassCard.jsx';

const Result = () => {
  const { userImage, selectedSaree, resultImage, presetSarees, setSelectedSaree, resetTryOn } = useApp();
  const navigate = useNavigate();

  const [compareMode, setCompareMode] = useState('slider'); // 'slider' or 'side-by-side'
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If no result is present, redirect to upload
    if (!resultImage || !userImage || !selectedSaree) {
      navigate('/upload');
    }
  }, [resultImage, userImage, selectedSaree, navigate]);

  if (!resultImage || !userImage || !selectedSaree) {
    return null;
  }

  // Handle slider mouse/touch movements
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchend', handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
  };

  // Download functionality
  const handleDownload = () => {
    // TODO: Backend Integration - replace local download with S3/backend hosted download
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `drapely-ai-tryon-${selectedSaree.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Try on a different saree immediately
  const handleQuickTrySaree = (saree) => {
    setSelectedSaree(saree);
    resetTryOn();
    navigate('/processing');
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-white pt-32 pb-24 overflow-hidden">
      {/* Background glow filters */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation back */}
        <Link to="/upload" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 mb-8 text-sm group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Staging Studio
        </Link>

        {/* Section Header */}
        <SectionTitle
          badge="Try-On Output"
          title="Generation Complete"
          subtitle="Your high-definition AI virtual drape is ready. Use the slider to compare original avatar and try-on output."
          align="left"
          className="!mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Main Visual Output (Compare view) */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            {/* View controls */}
            <div className="flex gap-2 self-end glass-panel p-1 rounded-full border-white/5">
              <button
                onClick={() => setCompareMode('slider')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  compareMode === 'slider' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Slider Compare
              </button>
              <button
                onClick={() => setCompareMode('side-by-side')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  compareMode === 'side-by-side' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Side by Side
              </button>
            </div>

            {/* Slider Comparison Area */}
            {compareMode === 'slider' ? (
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative aspect-4/5 w-full rounded-3xl overflow-hidden glass-panel border-white/10 select-none cursor-ew-resize shadow-2xl"
              >
                {/* BEFORE Image (User portrait) - Background */}
                <img
                  src={userImage}
                  alt="Original Avatar"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                
                {/* BEFORE tag */}
                <span className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full text-3xs font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-filter backdrop-blur-xs border border-white/10">
                  Before
                </span>

                {/* AFTER Image (Result render) - Foreground (Clipped) */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                >
                  <img
                    src={resultImage}
                    alt="AI Try-On Result"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* AFTER tag */}
                  <span className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full text-3xs font-semibold uppercase tracking-wider text-brand-accent bg-black/60 backdrop-filter backdrop-blur-xs border border-brand-accent/20">
                    After (AI)
                  </span>
                </div>

                {/* Vertical Divider Slider bar */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-brand-accent cursor-ew-resize z-20 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  {/* Glowing Slider Handle Center Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-accent border-4 border-brand-bg flex items-center justify-center shadow-2xl cursor-ew-resize">
                    <Sliders className="w-4 h-4 text-brand-bg rotate-90" />
                  </div>
                </div>
              </div>
            ) : (
              /* Side-by-Side comparison layout */
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="relative aspect-4/5 rounded-3xl overflow-hidden glass-panel border-white/5 shadow-lg">
                  <img src={userImage} alt="Original Portrait" className="w-full h-full object-cover" />
                  <span className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full text-3xs font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-filter backdrop-blur-xs border border-white/10">
                    Before
                  </span>
                </div>
                <div className="relative aspect-4/5 rounded-3xl overflow-hidden glass-panel border-white/5 shadow-lg">
                  <img src={resultImage} alt="AI Try-on Output" className="w-full h-full object-cover" />
                  <span className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full text-3xs font-semibold uppercase tracking-wider text-brand-accent bg-black/60 backdrop-filter backdrop-blur-xs border border-brand-accent/25">
                    After (AI)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Actions & Details */}
          <div className="lg:col-span-5 flex flex-col gap-8 w-full">
            
            {/* Metadata Info Panel */}
            <GlassCard hoverEffect={false} className="flex flex-col gap-6 text-left">
              <div>
                <span className="px-3 py-1 rounded-full text-3xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/15 border border-brand-accent/20 mb-3 inline-block">
                  {selectedSaree.category}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-white mb-2 leading-tight">
                  {selectedSaree.name}
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {selectedSaree.description}
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Retail Est.</span>
                <span className="font-display font-black text-xl text-brand-secondary">{selectedSaree.price}</span>
              </div>

              {/* Main CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="primary"
                  icon={Download}
                  onClick={handleDownload}
                  className="w-full"
                >
                  Download Output
                </Button>
                <Link to="/upload" className="w-full">
                  <Button
                    variant="secondary"
                    icon={RefreshCw}
                    className="w-full"
                  >
                    Try Another Photo
                  </Button>
                </Link>
              </div>
            </GlassCard>

            {/* Quick Saree Swapping catalog */}
            <div className="flex flex-col gap-4 text-left">
              <h4 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                Quick Swap Sarees
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {presetSarees.filter(s => s.id !== selectedSaree.id).slice(0, 4).map((saree) => (
                  <button
                    key={saree.id}
                    onClick={() => handleQuickTrySaree(saree)}
                    className="glass-panel p-3 rounded-2xl border border-white/5 hover:border-brand-primary/30 text-left flex items-center gap-3 group transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-brand-bg shrink-0">
                      <img src={saree.image} alt={saree.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-display font-bold text-xs text-white truncate group-hover:text-brand-accent transition-colors">
                        {saree.name}
                      </h5>
                      <span className="text-3xs text-gray-500 font-light block">{saree.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Result;
