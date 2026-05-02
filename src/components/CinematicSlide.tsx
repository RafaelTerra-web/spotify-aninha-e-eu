import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CinematicSlideProps {
  text: string;
  onNext: () => void;
}

export function CinematicSlide({ text, onNext }: CinematicSlideProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 6000); // Increased time for 3s fade-in + reading time

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center px-8 text-center overflow-hidden">
      {/* Subtle background ambient light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(29,185,84,0.05)_0%,rgba(0,0,0,1)_70%)]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
        transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10"
      >
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-relaxed tracking-tight italic">
          "{text}"
        </h2>
      </motion.div>

      {/* Decorative particles or subtle lines could be added here for extra aesthetics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
}
