import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function TransitionSlide({ text, onNext }: { text: string; onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-black" />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10"
      >
        <h2 className="text-3xl sm:text-5xl font-black text-white text-center uppercase tracking-tighter leading-none italic">
          {text}
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.8, ease: "linear" }}
          className="h-1 bg-green-500 mt-6 mx-auto rounded-full"
        />
      </motion.div>
    </div>
  );
}
