import { motion } from 'framer-motion';
import { rankingAmoEmVoce, rankingMomentos } from '../data/retrospectiva';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const rankingItem = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

function RankingList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="mb-12 last:mb-0">
      <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{title}</h3>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {items.map((text, i) => (
          <motion.div
            key={i}
            variants={rankingItem}
            className="group relative flex items-center gap-6"
          >
            <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent leading-none select-none">
              {i + 1}
            </span>
            <div className="flex-1 border-b border-white/10 pb-4">
              <p className="text-lg font-bold text-white group-hover:text-spotify-green transition-colors">{text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function RankingCard() {
  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-spotify-green/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-20 pb-12 flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 shrink-0"
        >
          <h2 className="text-spotify-green font-bold text-sm uppercase tracking-widest mb-1">
            Baseado na nossa playlist e vozes da minha cabeça (Discorde à vontade, amor)
          </h2>
          <h1 className="text-4xl font-black text-white tracking-tighter">OS MAIS TOCADOS</h1>
        </motion.div>

        <div className="space-y-12 pb-20">
          <RankingList
            title="TOP 5 COISAS QUE EU MAIS AMO EM VOCÊ"
            items={rankingAmoEmVoce}
          />
          <RankingList
            title="TOP 5 MOMENTOS NOSSOS"
            items={rankingMomentos}
          />
        </div>
      </div>
    </div>
  );
}
