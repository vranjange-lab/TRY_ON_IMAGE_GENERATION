import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Wand2, Image as ImageIcon, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../../components/Common/Button.jsx';
import SectionTitle from '../../components/Common/SectionTitle.jsx';
import GlassCard from '../../components/Common/GlassCard.jsx';
import {
  imageToFile,
  uploadUserImage,
  uploadSareeImage,
  generateTryOn,
  getGenerationResult,
  getOutputImageUrl
} from '../../api/apiService.js';

const UploadPage = () => {
  const {
    userImage,
    setUserImage,
    selectedSaree,
    setSelectedSaree,
    presetSarees,
    presetModels,
    setResultImage,
    setIsProcessing: setGlobalProcessing,
    resetTryOn
  } = useApp();

  const navigate = useNavigate();
  const fileInputUserRef = useRef(null);
  const fileInputSareeRef = useRef(null);

  const [dragActiveUser, setDragActiveUser] = useState(false);
  const [dragActiveSaree, setDragActiveSaree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);

  // Drag and drop handlers for User Photo
  const handleDragUser = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveUser(true);
    } else if (e.type === "dragleave") {
      setDragActiveUser(false);
    }
  };

  const handleDropUser = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveUser(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeUser = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers for Saree Image
  const handleDragSaree = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveSaree(true);
    } else if (e.type === "dragleave") {
      setDragActiveSaree(false);
    }
  };

  const handleDropSaree = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSaree(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedSaree({
          id: 'custom-saree',
          name: 'Uploaded Saree',
          image: reader.result,
          category: 'Custom',
          price: 'N/A',
          description: 'User uploaded custom saree drape.'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeSaree = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedSaree({
          id: 'custom-saree',
          name: 'Uploaded Saree',
          image: reader.result,
          category: 'Custom',
          price: 'N/A',
          description: 'User uploaded custom saree drape.'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger try-on generation pipeline
  const handleGenerate = async () => {
    if (!userImage || !selectedSaree) return;

    setError(null);
    setIsProcessing(true);
    setGlobalProcessing(true);
    resetTryOn();
    setStatusText('Preparing & staging input images...');

    try {
      // 1. Upload user image to backend
      const userFile = await imageToFile(userImage, 'user_avatar.png');
      const userUploadRes = await uploadUserImage(userFile);
      const userImagePath = userUploadRes.path;

      // 2. Upload saree image to backend
      const sareeImgSource = typeof selectedSaree === 'string' ? selectedSaree : selectedSaree.image;
      const sareeFile = await imageToFile(sareeImgSource, 'saree_drape.png');
      const sareeUploadRes = await uploadSareeImage(sareeFile);
      const sareeImagePath = sareeUploadRes.path;

      // 3. Initiate virtual try-on task
      setStatusText('Connecting to IDM-VTON AI model space...');
      const genRes = await generateTryOn(userImagePath, sareeImagePath);
      const taskId = genRes.task_id;

      if (!taskId) {
        throw new Error('Task ID was not returned by backend generation endpoint.');
      }

      // 4. Poll GET /api/v1/result/{task_id}
      setStatusText('Generating Virtual Try-On (processing on IDM-VTON model)...');
      let completed = false;
      let pollCount = 0;
      const maxPolls = 300;

      while (!completed && pollCount < maxPolls) {
        pollCount++;
        await new Promise((res) => setTimeout(res, 2000));

        const resultRes = await getGenerationResult(taskId);

        if (resultRes.status === 'completed') {
          completed = true;
          if (!resultRes.result_image_path) {
            throw new Error('Task marked completed but result image path was not provided.');
          }

          // Build absolute static image URL
          const resultUrl = getOutputImageUrl(resultRes.result_image_path);

          // Save THAT URL into AppContext
          setResultImage(resultUrl);
          setIsProcessing(false);
          setGlobalProcessing(false);

          // Navigate to /result ONLY AFTER setResultImage() has been called
          navigate('/result');
          return;
        } else if (resultRes.status === 'failed') {
          throw new Error(resultRes.error_message || 'AI try-on generation failed on server.');
        } else {
          setStatusText(`Synthesizing Virtual Try-On... (${pollCount * 2}s elapsed)`);
        }
      }

      if (!completed) {
        throw new Error('AI try-on generation timed out. Please try again.');
      }

    } catch (err) {
      console.error('Try-On Generation Error:', err);
      setError(err.message || 'An unexpected error occurred during try-on generation.');
      setIsProcessing(false);
      setGlobalProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-white pt-32 pb-24 overflow-hidden">
      {/* Background glow filters */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0a0d24] border border-white/15 rounded-3xl p-8 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-secondary/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-3xs font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/15 border border-brand-accent/25 px-3 py-1 rounded-full w-fit mx-auto flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                IDM-VTON Model Processing
              </span>
              <h3 className="font-display font-bold text-xl text-white">Generating Virtual Try-On</h3>
              <p className="text-gray-400 text-xs font-light tracking-wide">{statusText}</p>
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent animate-pulse w-full" />
            </div>
            <p className="text-gray-500 text-3xs">Please do not navigate away or refresh while the AI model executes.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title */}
        <SectionTitle
          badge="Try-On Studio"
          title="Staging Environment"
          subtitle="Configure your avatar photo and pair it with a luxurious saree from our catalog or upload a custom drape."
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-red-300 text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* COLUMN 1: Avatar Upload */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary text-xs font-black">1</span>
              Model / Avatar Setup
            </h3>

            <GlassCard
              hoverEffect={false}
              className={`relative aspect-4/5 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${
                dragActiveUser ? 'border-brand-accent bg-brand-accent/5' : 'border-white/10 hover:border-white/20'
              }`}
              onDragEnter={handleDragUser}
              onDragOver={handleDragUser}
              onDragLeave={handleDragUser}
              onDrop={handleDropUser}
            >
              {userImage ? (
                <div className="absolute inset-0 w-full h-full flex flex-col justify-end">
                  <img
                    src={userImage}
                    alt="User Upload Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-6">
                    <button
                      onClick={() => setUserImage(null)}
                      className="self-end w-10 h-10 rounded-full bg-black/60 backdrop-filter backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-brand-secondary/80 hover:border-brand-secondary/40 text-white transition-all cursor-pointer"
                      title="Clear photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-brand-accent text-xs font-semibold bg-brand-accent/15 border border-brand-accent/25 px-3 py-1.5 rounded-full w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Avatar Staged Successfully
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white">Drag & drop your photo here</p>
                    <p className="text-gray-400 text-xs font-light mt-1">Supports PNG, JPG, JPEG (Max 10MB)</p>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Or</div>
                  <Button
                    variant="secondary"
                    className="!py-2 !px-5 !text-2xs"
                    onClick={() => fileInputUserRef.current.click()}
                  >
                    Select File
                  </Button>
                  <input
                    ref={fileInputUserRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeUser}
                    className="hidden"
                  />
                </div>
              )}
            </GlassCard>

            {/* Model Presets */}
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                Quick Start Presets
              </h4>
              <div className="flex gap-4">
                {presetModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setUserImage(model.image)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                      userImage === model.image
                        ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-3xs text-white uppercase tracking-wider font-semibold">Select</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Saree Select */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary text-xs font-black">2</span>
              Saree Drapery Selection
            </h3>

            <GlassCard
              hoverEffect={false}
              className={`relative aspect-4/5 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${
                dragActiveSaree ? 'border-brand-secondary bg-brand-secondary/5' : 'border-white/10 hover:border-white/20'
              }`}
              onDragEnter={handleDragSaree}
              onDragOver={handleDragSaree}
              onDragLeave={handleDragSaree}
              onDrop={handleDropSaree}
            >
              {selectedSaree ? (
                <div className="absolute inset-0 w-full h-full flex flex-col justify-end">
                  <img
                    src={selectedSaree.image}
                    alt="Saree Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-6">
                    <button
                      onClick={() => setSelectedSaree(null)}
                      className="self-end w-10 h-10 rounded-full bg-black/60 backdrop-filter backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-brand-secondary/80 hover:border-brand-secondary/40 text-white transition-all cursor-pointer"
                      title="Clear saree selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/15 border border-brand-accent/20 mb-2 inline-block">
                        {selectedSaree.category}
                      </span>
                      <h4 className="font-display font-bold text-lg text-white mb-2 leading-none">
                        {selectedSaree.name}
                      </h4>
                      <div className="flex items-center gap-2 text-brand-secondary text-xs font-semibold bg-brand-secondary/15 border border-brand-secondary/25 px-3 py-1.5 rounded-full w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saree Staged Successfully
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white">Drag & drop saree image</p>
                    <p className="text-gray-400 text-xs font-light mt-1">Supports flat lays, fabrics, and catalog shots</p>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Or</div>
                  <Button
                    variant="secondary"
                    className="!py-2 !px-5 !text-2xs"
                    onClick={() => fileInputSareeRef.current.click()}
                  >
                    Upload Saree
                  </Button>
                  <input
                    ref={fileInputSareeRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeSaree}
                    className="hidden"
                  />
                </div>
              )}
            </GlassCard>

            {/* Saree Catalog Presets */}
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                Choose From Saree Catalog
              </h4>
              <div className="flex flex-wrap gap-3">
                {presetSarees.map((saree) => (
                  <button
                    key={saree.id}
                    onClick={() => setSelectedSaree(saree)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                      selectedSaree && selectedSaree.id === saree.id
                        ? 'border-brand-secondary ring-2 ring-brand-secondary/20 scale-105'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={saree.image} alt={saree.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Generate Panel */}
        <div className="flex flex-col items-center gap-4 text-center mt-12">
          <Button
            variant="primary"
            icon={Wand2}
            className={`w-full max-w-md !py-4 shadow-xl ${
              !userImage || !selectedSaree || isProcessing ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
            onClick={handleGenerate}
            disabled={!userImage || !selectedSaree || isProcessing}
          >
            {isProcessing ? 'Generating...' : 'Generate AI Try-On'}
          </Button>
          {!userImage || !selectedSaree ? (
            <p className="text-gray-500 text-xs font-light">
              Please stage both a personal avatar photo and a designer saree to proceed.
            </p>
          ) : (
            <p className="text-brand-accent text-xs font-semibold animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Everything staged. Ready to generate.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default UploadPage;
