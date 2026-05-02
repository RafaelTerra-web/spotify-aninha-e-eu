import { motion } from 'framer-motion';

const moodSongs = [
  { title: 'Vejo uma porta abrir', artist: 'Frozen', mood: 'Descoberta' },
  { title: 'Lembre de mim', artist: 'Viva', mood: 'Carinho' },
  { title: 'Perfect', artist: 'Ed Sheeran', mood: 'Romance' },
  { title: 'Saudade', artist: 'Luiz Lins', mood: 'Conexão' },
];

export function MusicMoodSlide() {
  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/4 left-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" 
        />
      </div>

      <div className="relative z-10 pt-20 pb-24 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="text-spotify-green font-bold text-sm uppercase tracking-[0.2em] mb-2">Mood Musical</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            SONS QUE <br />DEFINIRAM A GENTE
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {moodSongs.map((song, i) => (
            <motion.div
              key={song.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 50 }}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xl shadow-inner">
                🎵
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white leading-tight">{song.title}</h3>
                <p className="text-sm text-white/50">{song.artist}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase text-spotify-green tracking-widest">
                {song.mood}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center text-sm text-white/40 italic px-4"
        >
          "Nossa história tem ritmo, melodia e muito amor."
        </motion.p>
      </div>
    </div>
  );
}
