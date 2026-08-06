import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/Home.jsx';
import Upload from '../pages/upload/Upload.jsx';
import Gallery from '../pages/gallery/Gallery.jsx';
import Processing from '../pages/processing/Processing.jsx';
import Result from '../pages/result/Result.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
