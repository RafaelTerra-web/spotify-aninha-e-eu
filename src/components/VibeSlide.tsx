import { motion } from 'framer-motion';

export function VibeSlide({ title, subtitle, text }: { title?: string, subtitle?: string, text?: string }) {
  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Animated Spotify-like shapes */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-spotify-green/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 text-center max-w-md -mt-32 sm:-mt-16 px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-spotify-green font-bold tracking-widest uppercase text-xs sm:text-sm mb-3"
        >
          {title}
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-none"
        >
          {subtitle}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl backdrop-blur-md max-w-[90%] mx-auto"
        >
          <p className="text-base sm:text-lg text-white/80 leading-snug sm:leading-relaxed italic">
            "{text}"
          </p>
        </motion.div>
      </div>

      {/* Spotify Card Visual */}
      <motion.div
        initial={{ y: 100, opacity: 0, rotate: 0 }}
        animate={{ y: 0, opacity: 1, rotate: 3 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        className="absolute bottom-16 sm:bottom-24 w-48 h-64 sm:w-56 sm:h-72 bg-gradient-to-br from-zinc-800 to-black rounded-lg shadow-2xl flex flex-col p-3 border border-white/10"
      >
        <div className="w-full aspect-square bg-zinc-900 rounded-md mb-3 overflow-hidden border border-white/5">
          <img 
            src="/images/Nós 2.jpeg" 
            alt="Nossa Vibe" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-3/4 bg-spotify-green/40 rounded" />
          <div className="h-2 w-1/2 bg-white/10 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-spotify-green flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-1" />
            </div>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-1/3 h-full bg-spotify-green"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
