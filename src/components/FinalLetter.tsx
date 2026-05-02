import { motion } from 'framer-motion';
import { finalLetter } from '../data/retrospectiva';

export function FinalLetter() {
  return (
    <div className="relative w-full h-full bg-zinc-950 flex flex-col px-5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-64 h-64 bg-green-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-green-600/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] flex-1 flex flex-col min-h-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 overflow-y-auto no-scrollbar"
        >
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 md:p-8 mx-1 sm:mx-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl font-bold text-green-400 mb-4"
            >
              {finalLetter.greeting}
            </motion.p>

            <div className="space-y-3">
              {finalLetter.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                  className="text-sm text-white/75 leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-6 text-right"
            >
              <p className="text-white/60 text-sm">{finalLetter.signoff}</p>
              <p className="text-xl font-bold text-green-400 mt-1">{finalLetter.name}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
