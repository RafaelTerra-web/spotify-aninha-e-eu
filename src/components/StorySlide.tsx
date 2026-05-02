import { motion } from 'framer-motion';
import { SlideData } from '../data/retrospectiva';

interface StorySlideProps {
  data: SlideData;
}

export function StorySlide({ data }: StorySlideProps) {
  return (
     <div className={`relative w-full h-full ${data.gradient || 'bg-spotify-black'} flex flex-col items-center justify-center px-6 overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-black/40 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
          {data.image && (
            <motion.div
              initial={{ y: 40, opacity: 0, rotate: -2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[280px] aspect-square rounded-lg overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <img
                src={data.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          )}

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-white mb-6 leading-tight tracking-tighter uppercase"
          >
              {data.title}
            </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base sm:text-lg text-center text-white/80 leading-relaxed max-w-sm font-medium"
          >
            {data.text}
          </motion.p>
        </div>
      </div>
  );
}
