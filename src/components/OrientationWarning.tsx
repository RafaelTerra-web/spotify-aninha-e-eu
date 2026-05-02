import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function OrientationWarning() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      // Only show if it's a mobile-like screen size
      if (portrait && window.innerWidth < 1024) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md"
        >
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mb-6 border-2 border-white rounded-lg flex items-center justify-center"
          >
            <div className="w-1 h-8 bg-white/20 rounded-full" />
          </motion.div>
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">
            Melhor em modo paisagem
          </h2>
          <p className="text-white/60 text-sm">
            Gire o seu celular para aproveitar o show ao máximo!
          </p>
          <button 
            onClick={() => setShowWarning(false)}
            className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full border border-white/20 transition-all"
          >
            Continuar mesmo assim
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
