import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHOW_DURATION_MS = 30000; // 30 seconds to match the audio
const FADE_IN_DURATION_MS = 1500;
const FADE_OUT_DURATION_MS = 2000;

export function HorrorShow({ onSkip, onBack }: { onSkip: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const fadeInMusic = useCallback((durationMs = FADE_IN_DURATION_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0;
    audio.play().catch(() => {});
    let currentStep = 0;
    const steps = 20;
    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(0.6, (currentStep / steps) * 0.6);
      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
      }
    }, durationMs / steps);
  }, []);

  const fadeOutMusic = useCallback((durationMs = FADE_OUT_DURATION_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    let currentStep = 0;
    const steps = 30;
    const startVol = audio.volume;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, startVol * (1 - currentStep / steps));
      if (currentStep >= steps) {
        clearInterval(fadeIntervalRef.current!);
        fadeIntervalRef.current = null;
        audio.pause();
        onSkip();
      }
    }, durationMs / steps);
  }, [onSkip]);

  useEffect(() => {
    const audio = new Audio('/music/TrilhaSonoraInvocacaoDoMal.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
    const handleCanPlay = () => setIsReady(true);
    audio.addEventListener('canplaythrough', handleCanPlay);
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isReady || hasStartedRef.current) return;
    hasStartedRef.current = true;

    fadeInMusic();

    const timers = [
      window.setTimeout(() => setPhase(1), 500),   // Pergunta inicial
      window.setTimeout(() => setPhase(2), 4000),  // Poster do filme
      window.setTimeout(() => setPhase(3), 8000),  // Perseguição (Mirror vs Axe Man)
      window.setTimeout(() => setPhase(4), 18000), // "A gente se segura..."
      window.setTimeout(() => setPhase(5), 23000), // Texto irônico final
      window.setTimeout(() => fadeOutMusic(), SHOW_DURATION_MS - FADE_OUT_DURATION_MS),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isReady, fadeInMusic, fadeOutMusic]);

  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onBack();
  };

  const handleSkip = () => {
    fadeOutMusic(500);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Atmosfera de fundo */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.5, 0.1],
            backgroundColor: ['#000', '#1a0000', '#000']
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-full h-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div
            key="p1"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-red-700 uppercase tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(153,27,27,0.8)]">
              E quando decidimos <br /> levar um susto?
            </h2>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-20 flex flex-col items-center"
          >
            <div className="max-w-xs w-full bg-zinc-950 p-1 rounded-sm border-2 border-red-900 shadow-[0_0_50px_rgba(153,27,27,0.4)] overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                src="/images/InvocacaoDoMal4.webp" 
                alt="Invocação do Mal 4" 
                className="w-full grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <p className="mt-6 text-2xl font-black text-red-600 uppercase tracking-widest animate-pulse">
              Invocação do Mal 4
            </p>
          </motion.div>
        )}

        {phase === 3 && (
          <div key="p3" className="relative w-full h-full z-30 flex items-center justify-center">
            {/* CARINHA DO MACHADO */}
            <motion.div
              initial={{ x: '120vw', y: '10vh', rotate: 0 }}
              animate={{ 
                x: ['120vw', '20vw', '-20vw', '-120vw'],
                y: ['10vh', '30vh', '0vh', '20vh'],
                rotate: [0, -10, 10, -5]
              }}
              transition={{ 
                duration: 8,
                ease: "easeInOut"
              }}
              className="absolute w-48 sm:w-64"
            >
              <img src="/images/invocacaodomal4-carinha-do-machado.png" alt="Carinha do Machado" className="w-full drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]" />
            </motion.div>

            {/* ESPELHO MALDITO */}
            <motion.div
              initial={{ x: '150vw', y: '10vh', rotate: 0, scale: 0.5 }}
              animate={{ 
                x: ['150vw', '40vw', '0vw', '-100vw'],
                y: ['10vh', '25vh', '5vh', '15vh'],
                rotate: [0, 720, 1440, 2160],
                scale: [0.5, 1, 1.2, 0.8]
              }}
              transition={{ 
                duration: 8,
                ease: "easeInOut",
                delay: 0.3
              }}
              className="absolute w-56 sm:w-80"
            >
              <img src="/images/EspelhoMaldito.png" alt="Espelho Maldito" className="w-full drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
            </motion.div>
          </div>
        )}

        {phase === 4 && (
          <motion.div
            key="p4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              "A gente se segura <br /> um no outro"
            </h2>
          </motion.div>
        )}

        {phase === 5 && (
          <motion.div
            key="p5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center px-6 max-w-lg"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-zinc-400 uppercase tracking-tight leading-none mb-4">
              Mas no fundo...
            </h2>
            <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter">
              Nem foi tão assustador assim. <br />
              <span className="text-red-600 text-2xl sm:text-4xl">O filme foi bobinho, até com o espelho girando daquele jeito.</span>
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sombras decorativas */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Botões de navegação */}
      <div className="absolute bottom-10 inset-x-10 z-50 flex justify-between pointer-events-none">
        <button 
          onClick={handleBack}
          className="pointer-events-auto bg-white/5 hover:bg-white/10 text-white/40 text-xs px-4 py-2 rounded-full border border-white/10 transition-all"
        >
          ← Voltar
        </button>
        <button 
          onClick={handleSkip}
          className="pointer-events-auto bg-red-950/20 hover:bg-red-900/40 text-red-500/60 text-xs px-4 py-2 rounded-full border border-red-900/30 transition-all"
        >
          Pular Susto →
        </button>
      </div>
    </div>
  );
}
