import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userImage, setUserImage] = useState('/presets/girl_preset_1.png');
  const [selectedSaree, setSelectedSaree] = useState({
    id: 'saree-1',
    name: 'Royal Banarasi Silk Saree',
    image: '/presets/saree_preset_1.png',
    category: 'Silk',
    price: '₹14,999',
    description: 'Handcrafted luxury Banarasi silk with pure gold zari work.'
  });
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Preset Sarees available for Try-On and in the Gallery
  const presetSarees = [
    {
      id: 'saree-1',
      name: 'Royal Banarasi Silk Saree',
      image: '/presets/saree_preset_1.png',
      category: 'Silk',
      price: '₹14,999',
      description: 'Handcrafted luxury Banarasi silk with pure gold zari work.'
    },
    {
      id: 'saree-2',
      name: 'Hot Pink Embroidered Georgette Saree',
      image: '/presets/saree_preset_2.png',
      category: 'Georgette',
      price: '₹8,499',
      description: 'Chic georgette fabric with delicate silver floral threadwork.'
    },
    {
      id: 'saree-3',
      name: 'Sage Green Organza Saree',
      image: '/presets/saree_preset_3.png',
      category: 'Organza',
      price: '₹6,999',
      description: 'Lightweight modern organza featuring premium digital floral designs.'
    },
    {
      id: 'saree-4',
      name: 'Black & Gold Tissue Silk Saree',
      image: '/presets/saree_preset_4.png',
      category: 'Silk',
      price: '₹18,999',
      description: 'Luxury heavy gold zari weaving on pure black tissue silk.'
    },
    {
      id: 'saree-5',
      name: 'Crimson Red Embroidered Saree',
      image: '/presets/saree_preset_5.png',
      category: 'Georgette',
      price: '₹11,499',
      description: 'Intricate border design on premium ruby red georgette fabric.'
    }
  ];

  const presetModels = [
    {
      id: 'model-1',
      name: 'Default Model',
      image: '/presets/girl_preset_1.png'
    }
  ];

  const resetTryOn = () => {
    // Keep userImage and selectedSaree, just clear results
    setResultImage(null);
    setIsProcessing(false);
  };

  const clearAll = () => {
    setUserImage(null);
    setSelectedSaree(null);
    setResultImage(null);
    setIsProcessing(false);
  };

  return (
    <AppContext.Provider
      value={{
        userImage,
        setUserImage,
        selectedSaree,
        setSelectedSaree,
        resultImage,
        setResultImage,
        isProcessing,
        setIsProcessing,
        presetSarees,
        presetModels,
        resetTryOn,
        clearAll
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
