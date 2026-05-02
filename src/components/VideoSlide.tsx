import { motion } from 'framer-motion';
import { SlideData } from '../data/retrospectiva';
import { useRef, useEffect } from 'react';

interface VideoSlideProps {
  data: SlideData;
}

export function VideoSlide({ data }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Auto-play was prevented:", error);
      });
    }
  }, []);

  return (
    <div className={`relative w-full h-full ${data.gradient || 'bg-spotify-black'} flex flex-col items-center justify-center px-6 overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-black/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
        {data.image && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 bg-black"
          >
            <video
              ref={videoRef}
              src={data.image}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
          </motion.div>
        )}

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl sm:text-3xl font-black text-center text-white mb-4 leading-tight tracking-tighter uppercase px-4"
        >
          {data.title}
        </motion.h2>

        {data.text && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base text-center text-white/80 leading-relaxed max-w-sm font-medium italic"
          >
            "{data.text}"
          </motion.p>
        )}
      </div>
    </div>
  );
}
