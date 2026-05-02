import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { statsData } from '../data/retrospectiva';

const startDate = new Date('2025-10-18T18:00:00-03:00');

function useTimeSince() {
  const [elapsed, setElapsed] = useState(() => Date.now() - startDate.getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startDate.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.floor(elapsed / 1000);
  const totalDays = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const months =
    (startDate.getMonth() + totalDays / 30.44) - startDate.getMonth()
    ? Math.floor(
        (new Date().getFullYear() - startDate.getFullYear()) * 12 +
        new Date().getMonth() - startDate.getMonth() +
        (new Date().getDate() < startDate.getDate() ? -1 : 0)
      )
    : 0;

  const daysInCurrentMonth = totalDays - Math.floor(months * 30.44);

  return {
    months: Math.max(0, months),
    days: Math.max(0, Math.floor(daysInCurrentMonth)),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalDays: Math.max(0, totalDays),
  };
}

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export function StatsSlide() {
  const time = useTimeSince();

  const liveStats = [
    {
      icon: '💜',
      value: `${time.months}m ${time.days}d`,
      label: 'Tempo criando memórias',
      subValue: `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`,
    },
    ...statsData.slice(1),
  ];

  return (
    <div className="relative w-full h-full bg-spotify-black flex flex-col px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-spotify-green/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-20 flex-1 flex flex-col min-h-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 px-1 shrink-0"
        >
          <h2 className="text-spotify-green font-bold text-sm uppercase tracking-widest mb-1">Estatísticas</h2>
          <h1 className="text-4xl font-black text-white tracking-tighter">NOSSOS NÚMEROS</h1>
        </motion.div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {liveStats.map((stat, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                  <p className="text-sm font-bold text-white/60 uppercase tracking-widest">{stat.label}</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-black text-spotify-green tracking-tighter">{stat.value}</p>
                  {'subValue' in stat && (
                    <p className="text-xl font-mono text-white/40">{stat.subValue}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
