import { motion } from 'framer-motion';
import { timelineData } from '../data/retrospectiva';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const timelineItem = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export function Timeline() {
  return (
    <div className="relative w-full h-full bg-zinc-950 flex flex-col px-5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(6rem+env(safe-area-inset-bottom))] flex-1 flex flex-col min-h-0"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-400 mb-2 leading-tight">
          Nossa linha do tempo
        </h2>
        <p className="text-sm text-white/50 text-center mb-6">O caminho que nos trouxe até aqui</p>

        <div className="flex-1 overflow-y-auto no-scrollbar px-1 sm:px-2 min-h-0 pb-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative pl-4"
          >
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 to-transparent" />

            {timelineData.map((t, i) => (
              <motion.div key={i} variants={timelineItem} className="relative pb-8 last:pb-0">
                <div className="absolute left-[-1.25rem] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-zinc-950" />
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 ml-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-green-500/20 text-green-400">
                    {t.date}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {t.image && (
                      <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={t.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <p className="text-sm text-white/80 leading-relaxed">{t.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
