import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { AppContextProvider } from './context/AppContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  // Initialize Lenis luxury smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AppContextProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-brand-bg text-white selection:bg-brand-primary/30 selection:text-white">
          {/* Glass Navbar */}
          <Navbar />

          {/* Main page content area */}
          <main className="flex-grow">
            <AppRoutes />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
