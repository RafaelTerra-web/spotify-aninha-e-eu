import { motion } from 'framer-motion';
import { galleryImages } from '../data/retrospectiva';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export function PhotoGallery() {
  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-spotify-green/20 to-transparent" />
      </div>

      <div className="relative z-10 pt-20 pb-24 flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-6 mb-10"
        >
          <div className="w-48 h-48 bg-zinc-800 rounded shadow-2xl overflow-hidden flex-shrink-0 border border-white/5">
            <img 
              src={galleryImages[0]} 
              className="w-full h-full object-cover"
              alt="Cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Playlist</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-2 leading-none">MELHORES MOMENTOS</h1>
            <p className="text-sm text-white/40 font-medium">Rafael • {galleryImages.length} momentos salvos</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-10">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group aspect-square rounded-md overflow-hidden bg-zinc-900 border border-white/5 relative"
            >
              {img.endsWith('.mp4') ? (
                <video
                  src={img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase tracking-tighter">
                  {img.endsWith('.mp4') ? 'Ver Vídeo' : 'Ver Momento'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
