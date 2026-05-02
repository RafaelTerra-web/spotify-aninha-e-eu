import { motion } from 'framer-motion';
import { artistasMaisOuidos } from '../data/retrospectiva';

export function TopArtistsSlide() {
  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-spotify-green/10" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-96 h-96 border border-white/5 rounded-full"
        />
      </div>

      <div className="relative z-10 pt-20 pb-24 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <p className="text-spotify-green font-bold text-sm uppercase tracking-widest mb-1">Seus Favoritos</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">
            ARTISTAS QUE <br />EMBALARAM NOSSO ANO
          </h1>
        </motion.div>

        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-4 space-y-6">
          {artistasMaisOuidos.map((artista, index) => (
            <motion.div
              key={artista.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-white/20 italic">#{index + 1}</span>
                  <span className="text-xl font-bold text-white group-hover:text-spotify-green transition-colors">
                    {artista.name}
                  </span>
                </div>
                <span className="text-sm font-mono text-white/40">{artista.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${artista.percentage * 2}%` }} // Scaling for visual impact
                  transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-spotify-green to-emerald-400"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-xs text-white/30 italic text-center shrink-0"
        >
          *Baseado na nossa playlist e vozes da minha cabeça.
        </motion.p>
      </div>
    </div>
  );
}
