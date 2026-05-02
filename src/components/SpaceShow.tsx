import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AUDIO_START_DELAY = 0;
const ASTRONAUTS_ENTER_MS = 4000;
const JOIN_MOMENT_MS = 16000;
const TEASER_START_MS = 21000;
const TEASER_END_MS = 26000;
const SHOW_DURATION_MS = 32000;
const FADE_IN_DURATION_MS = 2000;
const FADE_OUT_DURATION_MS = 3000;

function HeartEffect({ x, y }: { x: number; y: number }) {
  const hearts = Array.from({ length: 12 });
  return (
    <div className="absolute z-50" style={{ left: x, top: y }}>
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.5, 1, 0], 
            opacity: [0, 1, 1, 0],
            x: (Math.random() - 0.5) * 300,
            y: -Math.random() * 400 - 50,
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            ease: "easeOut",
            delay: Math.random() * 0.5 
          }}
          className="absolute text-4xl"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    const stars: any[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0) star.opacity = 0;
        if (star.opacity > 1) star.opacity = 1;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export function SpaceShow({ onSkip, onBack }: { onSkip: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState(0);
  const [showAstronauts, setShowAstronauts] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
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
      audio.volume = Math.min(0.7, (currentStep / steps) * 0.7);
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
    const audio = new Audio('/music/SignOfTheTimesDevoradorDeEstrelas.mp3');
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
    setPhase(1); // "Agora Ficção Científica..."

    const timers = [
      window.setTimeout(() => setPhase(2), 2500), // "Eu Chorei..."
      window.setTimeout(() => { setShowAstronauts(true); setPhase(3); }, ASTRONAUTS_ENTER_MS),
      window.setTimeout(() => { 
        setIsJoined(true);
        setShowHeart(true);
      }, JOIN_MOMENT_MS),
      window.setTimeout(() => setShowHeart(false), JOIN_MOMENT_MS + 2500),
      window.setTimeout(() => setShowTeaser(true), TEASER_START_MS),
      window.setTimeout(() => setShowTeaser(false), TEASER_END_MS),
      window.setTimeout(() => fadeOutMusic(), SHOW_DURATION_MS),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isReady, fadeInMusic, fadeOutMusic]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <StarsCanvas />

      {showHeart && <HeartEffect x={window.innerWidth / 2 - 30} y={window.innerHeight / 2 - 40} />}

      <div className="relative z-20 text-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.h2
              key="p1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter"
            >
              Agora Ficção Científica, <br /> o que assistimos?
            </motion.h2>
          )}
          {phase === 2 && (
            <motion.h2
              key="p2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-3xl sm:text-5xl font-black text-yellow-400 uppercase"
            >
              Eu Chorei... <br /> É muito bom
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {showAstronauts && !isJoined && (
            <>
              {/* RAFA */}
              <motion.div
                key="rafa-astronaut"
                initial={{ x: '-70vw', y: '-20vh', scale: 0.3, rotate: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, rotate: 360, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  x: { duration: 12, ease: "linear" },
                  y: { duration: 12, ease: "linear" },
                  rotate: { duration: 20, ease: "linear", repeat: Infinity },
                  opacity: { duration: 1.5 }
                }}
                className="absolute w-24 sm:w-32"
              >
                <img src="/images/RafinhaAstronauta.png" alt="Rafa" className="w-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              </motion.div>

              {/* ANA */}
              <motion.div
                key="ana-astronaut"
                initial={{ x: '70vw', y: '20vh', scale: 0.25, rotate: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, rotate: -360, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  x: { duration: 12, ease: "linear" },
                  y: { duration: 12, ease: "linear" },
                  rotate: { duration: 25, ease: "linear", repeat: Infinity },
                  opacity: { duration: 1.5 }
                }}
                className="absolute w-24 sm:w-32"
              >
                <img src="/images/AninhaAstronauta.png" alt="Ana" className="w-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              </motion.div>
            </>
          )}

          {isJoined && (
            <motion.div
              key="couple-astronaut"
              initial={{ scale: 0, opacity: 0, rotate: -10, filter: 'brightness(3) blur(10px)' }}
              animate={{ 
                scale: 0.5, 
                opacity: 1, 
                rotate: 0, 
                filter: 'brightness(1) blur(0px)',
                y: [0, -15, 0]
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 200, damping: 15 },
                filter: { duration: 0.4 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-32 sm:w-48"
            >
              <img src="/images/AstronautaCasal.png" alt="Casal Astronauta" className="w-full drop-shadow-[0_0_50px_rgba(255,100,100,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTeaser && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.2, rotate: -10 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm px-6"
          >
            <div className="max-w-xs w-full bg-zinc-900 p-2 rounded-2xl border-2 border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.4)]">
              <img src="/images/DevoradorDeEstrelas.jpg" alt="Devorador de Estrelas" className="w-full rounded-xl" />
            </div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-xl font-black text-white text-center uppercase tracking-widest"
            >
              Devorador de Estrelas <br />
              <span className="text-yellow-400 text-sm italic">"É muito bom!"</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => fadeOutMusic(500)}
        className="absolute bottom-10 right-10 z-40 bg-white/10 hover:bg-white/20 text-white/40 text-xs px-4 py-2 rounded-full transition-all"
      >
        Pular Show →
      </button>

      <button 
        onClick={onBack}
        className="absolute bottom-10 left-10 z-40 bg-white/5 hover:bg-white/10 text-white/40 text-xs px-4 py-2 rounded-full border border-white/10 transition-all"
      >
        ← Voltar
      </button>
    </div>
  );
}
