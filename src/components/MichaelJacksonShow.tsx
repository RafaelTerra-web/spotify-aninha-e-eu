import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRE_MUSIC_INTRO_MS = 3600;
const AUDIO_INTRO_MS = 3000;
const MUSIC_SHOW_DURATION_MS = 29000; // Set to exactly 29s per user request
const SHOW_DURATION_MS = PRE_MUSIC_INTRO_MS + MUSIC_SHOW_DURATION_MS;
const FADE_DURATION_MS = 3000;
const FADE_IN_DURATION_MS = 1800;
const DANCERS_ENTER_MS = PRE_MUSIC_INTRO_MS + AUDIO_INTRO_MS;
const TITLE_ENTER_MS = DANCERS_ENTER_MS;
const SCREAM_CUE_MS = PRE_MUSIC_INTRO_MS + 18800;
const DANCER_DANCE_CUE_MS = 10000; // 10 seconds of moonwalk before drop
const TEASER_CUE_MS = SCREAM_CUE_MS + 2000;
const TEASER_DURATION_MS = 5000;

function useMobilePerformanceMode() {
  const getInitialValue = () => {
    if (typeof window === 'undefined') return false;
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    return (
      window.matchMedia('(max-width: 640px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches ||
      (navigatorWithMemory.deviceMemory !== undefined && navigatorWithMemory.deviceMemory <= 4)
    );
  };
  const [isLowPower, setIsLowPower] = useState(getInitialValue);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 640px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    const update = () => setIsLowPower(getInitialValue());
    media.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return isLowPower;
}

function Spotlights({ lowPower }: { lowPower: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      <motion.div
        className="absolute top-0 left-[20%] w-[15%] h-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,230,120,0.3) 0%, rgba(255,215,0,0.1) 45%, transparent 100%)',
          filter: lowPower ? 'blur(20px)' : 'blur(40px)',
          transformOrigin: 'top center',
        }}
        animate={{ rotate: [-15, 15, -15], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 right-[20%] w-[15%] h-full"
        style={{
          background: 'linear-gradient(180deg, rgba(255,230,120,0.3) 0%, rgba(255,215,0,0.1) 45%, transparent 100%)',
          filter: lowPower ? 'blur(20px)' : 'blur(40px)',
          transformOrigin: 'top center',
        }}
        animate={{ rotate: [15, -15, 15], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-full"
        style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }}
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function StageFloor() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[44%]" style={{ zIndex: 8 }}>
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/90 to-transparent" />
      <div
        className="absolute left-1/2 bottom-0 h-40 w-[130%] -translate-x-1/2 rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 70%, black 100%)',
          borderTop: '1px solid rgba(255,215,0,0.15)',
          boxShadow: '0 -20px 100px rgba(255,215,0,0.05)',
        }}
      />
      <div className="absolute left-1/2 bottom-20 h-1 w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent blur-md" />
    </div>
  );
}

function SmokeEffect({ introActive, lowPower }: { introActive: boolean; lowPower: boolean }) {
  const smokeCount = lowPower ? 2 : 4;
  const puffs = Array.from({ length: smokeCount }).map((_, i) => ({
    id: i,
    x: `${20 + i * (60 / (smokeCount - 1))}%`,
    delay: i * 0.4,
    duration: 5 + Math.random() * 2,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
      {puffs.map((puff) => (
        <motion.div
          key={puff.id}
          className="absolute bottom-10 w-64 h-64 rounded-full"
          style={{ left: puff.x, background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }}
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={introActive ? { opacity: [0, 0.4, 0], y: [-20, -150], scale: [0.5, 2] } : { opacity: [0, 0.1, 0], y: [-10, -30], scale: [0.8, 1.2] }}
          transition={{ duration: puff.duration, repeat: Infinity, delay: puff.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function StarsCanvas({ lowPower }: { lowPower: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    const stars: any[] = [];
    for (let i = 0; i < (lowPower ? 14 : 30); i++) {
      stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.random() * 2 + 0.8, speed: Math.random() * 0.3 + 0.08, opacity: Math.random() * 0.5 + 0.3, pulseSpeed: Math.random() * 0.02 + 0.008, pulseOffset: Math.random() * Math.PI * 2, swaySpeed: Math.random() * 0.002 + 0.001, swayAmplitude: Math.random() * 16 + 6 });
    }
    let animationId: number;
    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time += 1;
      stars.forEach((star) => {
        star.y -= star.speed;
        star.x += Math.sin(time * star.swaySpeed) * star.swayAmplitude * 0.015;
        const pulse = Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.3 + 0.7;
        const currentOpacity = star.opacity * pulse;
        if (star.y < -10) { star.y = window.innerHeight + 10; star.x = Math.random() * window.innerWidth; }
        ctx.beginPath(); ctx.arc(star.x, star.y, star.radius * (lowPower ? 1.9 : 2.5), 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 215, 0, ${currentOpacity * 0.25})`; ctx.fill();
        ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.85})`; ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', resizeCanvas);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resizeCanvas); };
  }, [lowPower]);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />;
}

function Curtains({ open }: { open: boolean }) {
  const curtainStyle = { background: ['linear-gradient(90deg, rgba(12,0,4,0.98), rgba(45,0,12,0.98) 18%, rgba(16,0,6,0.98) 34%, rgba(62,0,16,0.98) 52%, rgba(18,0,7,0.98) 70%, rgba(42,0,12,0.98))', 'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 30px)'].join(', '), boxShadow: 'inset -24px 0 46px rgba(0,0,0,0.7), inset 18px 0 34px rgba(255,255,255,0.025)' };
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 6 }}>
      <motion.div className="absolute left-0 top-0 h-full w-[54%]" style={curtainStyle} initial={{ x: 0 }} animate={{ x: open ? '-102%' : 0 }} transition={{ duration: 1.45, ease: [0.65, 0, 0.35, 1] }} />
      <motion.div className="absolute right-0 top-0 h-full w-[54%]" style={curtainStyle} initial={{ x: 0 }} animate={{ x: open ? '102%' : 0 }} transition={{ duration: 1.45, ease: [0.65, 0, 0.35, 1] }} />
      <div className="absolute left-0 right-0 top-0 h-16" style={{ background: 'linear-gradient(180deg, rgba(28,0,8,1), rgba(7,0,4,0.96))', boxShadow: '0 16px 38px rgba(0,0,0,0.55)' }} />
    </div>
  );
}

function DancingDuo({ visible, musicEnergy, lowPower, isScreaming }: { visible: boolean; musicEnergy: number; lowPower: boolean; isScreaming: boolean }) {
  const [danceReady, setDanceReady] = useState(false);
  const moonwalkDuration = DANCER_DANCE_CUE_MS / 1000;

  useEffect(() => {
    if (!visible) {
      setDanceReady(false);
      return;
    }
    setDanceReady(false);
    const timer = window.setTimeout(() => setDanceReady(true), DANCER_DANCE_CUE_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const dancerShadow = 'drop-shadow(0 0 7px rgba(255,215,0,0.24)) drop-shadow(0 12px 16px rgba(0,0,0,0.45))';

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[48%] flex justify-center items-end gap-10 md:gap-24 pb-12 md:pb-16"
      style={{ zIndex: 30, perspective: 900 }}
      animate={{ scale: lowPower ? 1 : 1 + musicEnergy * 0.012 }}
      transition={{ duration: 0.08, ease: 'easeOut' }}
    >
      <AnimatePresence>
        {visible && (
          <>
            {/* RAFA */}
              <motion.div
                key="rafa-dancer"
                initial={{ x: '-100vw', opacity: 1 }}
                animate={
                  isScreaming
                    ? { 
                        x: 0, 
                        y: [0, -12, 0, -12, 0], 
                        rotate: [0, -2, 2, -2, 0],
                        scale: 1.1
                      }
                    : danceReady 
                    ? { x: 0, y: [0, -20, 0], scale: [1, 1.05, 1] } 
                    : { x: 0, y: 0, scale: 1 }
                }
                transition={
                  isScreaming
                    ? { 
                        y: { duration: 0.3, repeat: 1, ease: "easeOut" },
                        rotate: { duration: 0.3, repeat: 1, ease: "easeInOut" },
                        scale: { duration: 0.2 }
                      }
                    : danceReady 
                    ? { y: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } }
                    : { x: { duration: moonwalkDuration, ease: 'linear' } }
                }
                className="relative will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
              <div className="relative">
                <motion.img
                  src="/images/Rafa-Michael.png"
                  alt="Rafa"
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain"
                  style={{ filter: dancerShadow }}
                  animate={danceReady ? { rotateY: 180 } : { rotateY: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.p animate={{ opacity: danceReady ? 1 : 0 }} className="text-center text-xs font-bold text-yellow-400 mt-2">Rafa</motion.p>
            </motion.div>

            {/* ANA */}
            <motion.div
              initial={{ x: '100vw', opacity: 1 }}
              animate={danceReady 
                ? { x: 0, y: [0, -20, 0], scale: [1, 1.05, 1] } 
                : { x: 0, y: 0, scale: 1 }
              }
              transition={danceReady 
                ? { y: { duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }, scale: { duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.1 } }
                : { x: { duration: moonwalkDuration, ease: 'linear' } }
              }
              className="relative will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                <motion.img
                  src="/images/Ana-Michael.png"
                  alt="Ana"
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain"
                  style={{ filter: dancerShadow }}
                  animate={danceReady ? { rotateY: 0 } : { rotateY: 180 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.p animate={{ opacity: danceReady ? 1 : 0 }} className="text-center text-xs font-bold text-yellow-400 mt-2">Ana</motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TeaserImage({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 pointer-events-none" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}>
          <div className="relative p-2 bg-zinc-900/80 rounded-2xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm max-w-sm w-full">
            <img src="/images/Michael.jpg" alt="Michael" className="w-full rounded-xl object-cover aspect-[2/3]" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-6 text-center max-w-xs">
            <p className="text-lg sm:text-xl font-bold text-white shadow-black drop-shadow-lg leading-tight">Filme mais recente que assistimos juntos até agora, e foi MUITO LEGAL</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScreamGlow({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 24, mixBlendMode: 'screen' }} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.95, 0.55, 0.78] }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="absolute left-1/2 top-[56%] h-[72%] w-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(255,244,172,0.26) 0%, rgba(255,210,58,0.2) 26%, rgba(255,210,58,0.07) 48%, transparent 72%)', filter: 'blur(12px)' }} animate={{ scale: [0.8, 1.08, 1], opacity: [0.45, 1, 0.72] }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="absolute left-1/2 top-[32%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.32), rgba(255,221,83,0.22) 36%, transparent 70%)', filter: 'blur(10px)' }} animate={{ scale: [0.45, 1.45, 1.15], opacity: [0.2, 0.95, 0.48] }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScreamText({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="absolute inset-x-0 top-[31%] z-50 px-4 text-center pointer-events-none" initial={{ opacity: 0, y: 24, scale: 0.4, rotate: -8 }} animate={{ opacity: 1, y: [-4, -18, -24, -28], scale: [0.65, 1.22, 1.05, 1.1], rotate: [-8, 6, -3, 4] }} exit={{ opacity: 0, y: -52, scale: 1.35, rotate: 8 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-wide md:tracking-wider text-yellow-200" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.7)', textShadow: '0 0 18px rgba(255, 255, 255, 0.65), 0 0 46px rgba(255, 215, 0, 0.95)' }}>UUUUL!</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AfterShowLetter({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div className="absolute inset-0 z-50 flex items-center justify-center px-4 py-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <motion.div initial={{ y: 24, opacity: 0, scale: 0.94 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md rounded-3xl border border-yellow-200/30 bg-zinc-950/90 p-5 sm:p-6 shadow-2xl shadow-black/60 backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-300/70">Cinema</p>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black leading-tight text-white">Filme mais recente juntos.</h2>
        <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-white/80">
          <p>O filme mais recente que assistimos juntos no cinema foi <span className="text-yellow-400 font-bold">Michael</span>, um dia depois da estreia.</p>
          <p>Foi um momento legal para criar mais uma memória ao seu lado. É bom compartilhar esses momentos com você.</p>
          <p className="font-medium text-white">Eu amo você. 💜</p>
        </div>
        <div className="mt-6 flex justify-end">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onContinue} className="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-300">Continuar →</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MichaelJacksonShow({ onSkip, onBack }: { onSkip: () => void; onBack: () => void }) {
  const lowPowerMode = useMobilePerformanceMode();
  const [phase, setPhase] = useState(0);
  const [showDancers, setShowDancers] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showScream, setShowScream] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isEndingShow, setIsEndingShow] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [musicEnergy, setMusicEnergy] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const beatZoomActive = musicEnergy > 0.3;

  const startAudioAnalysis = useCallback(() => {
    if (lowPowerMode) { setMusicEnergy(0.08); return; }
    setMusicEnergy(0.12);
  }, [lowPowerMode]);

  const stopAudioAnalysis = useCallback(() => { setMusicEnergy(0); }, []);

  const fadeInMusic = useCallback((durationMs = FADE_IN_DURATION_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetVolume = 0.6;
    const steps = 24;
    let currentStep = 0;
    audio.muted = false;
    audio.volume = 0;
    audio.play().catch(err => console.error("Audio play failed:", err));
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = window.setInterval(() => {
      currentStep += 1;
      audio.volume = Math.min(targetVolume, targetVolume * (currentStep / steps));
      if (currentStep >= steps) { 
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current); 
        fadeIntervalRef.current = null; 
      }
    }, durationMs / steps);
  }, []);

  const fadeOutMusic = useCallback((durationMs = FADE_DURATION_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    const startVolume = audio.volume;
    const steps = 30;
    let currentStep = 0;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = window.setInterval(() => {
      currentStep += 1;
      audio.volume = Math.max(0, startVolume * (1 - currentStep / steps));
      if (currentStep >= steps) { 
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current); 
        fadeIntervalRef.current = null; 
        audio.pause(); 
        stopAudioAnalysis(); 
      }
    }, durationMs / steps);
  }, [stopAudioAnalysis]);

  // Audio Initialization
  useEffect(() => {
    const audio = new Audio('/music/MichaelMusica.m4a');
    audio.preload = 'auto';
    audio.volume = 0;
    audio.muted = true;
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsReady(true);
    };
    audio.addEventListener('canplaythrough', handleCanPlay);

    // Initial attempt to unlock audio
    audio.play().then(() => {
      audio.pause();
    }).catch(() => {});

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Show Timeline Logic
  useEffect(() => {
    if (!isReady || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const timers = [
      window.setTimeout(() => { 
        if (audioRef.current) {
          audioRef.current.currentTime = 0; 
          fadeInMusic(); 
          startAudioAnalysis(); 
        }
      }, PRE_MUSIC_INTRO_MS),
      window.setTimeout(() => setPhase(1), PRE_MUSIC_INTRO_MS + 250),
      window.setTimeout(() => setPhase(2), PRE_MUSIC_INTRO_MS + 1100),
      window.setTimeout(() => { setShowDancers(true); setPhase(3); }, DANCERS_ENTER_MS),
      window.setTimeout(() => { setShowTitle(true); setPhase(4); }, TITLE_ENTER_MS),
      window.setTimeout(() => setShowScream(true), SCREAM_CUE_MS),
      window.setTimeout(() => setShowScream(false), SCREAM_CUE_MS + 2800),
      window.setTimeout(() => setShowTeaser(true), TEASER_CUE_MS),
      window.setTimeout(() => setShowTeaser(false), TEASER_CUE_MS + TEASER_DURATION_MS),
      window.setTimeout(() => { setIsEndingShow(true); fadeOutMusic(); }, SHOW_DURATION_MS),
      window.setTimeout(() => { 
        setShowDancers(false); 
        setShowTitle(false); 
        setShowLetter(true); 
      }, SHOW_DURATION_MS + FADE_DURATION_MS + 700),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isReady, fadeInMusic, fadeOutMusic, startAudioAnalysis]);

  const handleSkip = useCallback(() => { stopAudioAnalysis(); if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; } onSkip(); }, [onSkip, stopAudioAnalysis]);
  const handleBack = useCallback(() => { stopAudioAnalysis(); if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; } onBack(); }, [onBack, stopAudioAnalysis]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <motion.div className="absolute inset-0" style={{ transformOrigin: '50% 72%' }} animate={{ opacity: showLetter ? 0 : isEndingShow ? 0.18 : 1, scale: beatZoomActive ? 1.026 : 1 }} transition={{ opacity: { duration: showLetter ? 0.8 : isEndingShow ? 3 : 0.8, ease: 'easeInOut' }, scale: { duration: 0.18, ease: 'easeOut' } }}>
        <Spotlights lowPower={lowPowerMode} />
        <StageFloor />
        <SmokeEffect introActive={!showDancers} lowPower={lowPowerMode} />
        <StarsCanvas lowPower={lowPowerMode} />
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center px-4" style={{ zIndex: 15, paddingTop: 'max(4.5rem, 12dvh)' }}>
          <AnimatePresence mode="wait">
            {phase === 1 && <motion.p key="p1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -30 }} className="text-lg md:text-2xl font-light text-white/80 tracking-[0.24em] uppercase">Apresentam</motion.p>}
            {phase === 2 && <motion.div key="p2" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18 }} className="max-w-sm text-center"><p className="text-xs md:text-base font-light uppercase tracking-[0.18em] text-yellow-300/75">Dois Ingressos</p><p className="mt-2 text-lg md:text-2xl font-black leading-tight text-white">no dia seguinte à estreia de Michael</p></motion.div>}
            {phase >= 3 && !showTitle && <motion.p key="p3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-sm md:text-xl font-light text-yellow-400/80 tracking-[0.16em] uppercase mb-2">Rafa & Ana como</motion.p>}
            {showTitle && <motion.div key="p4" initial={{ opacity: 0, scale: 0.5, rotateX: 90 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ type: 'spring', duration: 1.2, bounce: 0.4 }} className="text-center"><h2 className="text-[2.05rem] leading-none sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300" style={{ textShadow: '0 0 40px rgba(255,215,0,0.5)' }}>MICHAEL JACKSON</h2><p className="text-xs md:text-base text-yellow-400/60 tracking-[0.34em] uppercase mt-3">Night</p></motion.div>}
          </AnimatePresence>
        </div>
        <DancingDuo visible={showDancers} musicEnergy={musicEnergy} lowPower={lowPowerMode} isScreaming={showScream} />
        <ScreamGlow visible={showScream} />
        <ScreamText visible={showScream} />
        <TeaserImage visible={showTeaser} />
        <Curtains open={showDancers} />
      </motion.div>

      {!showLetter && (
        <div className="absolute bottom-10 inset-x-10 z-50 flex justify-between pointer-events-none">
          <button 
            onClick={handleBack}
            className="pointer-events-auto bg-white/5 hover:bg-white/10 text-white/40 text-xs px-4 py-2 rounded-full border border-white/10 transition-all"
          >
            ← Voltar
          </button>
          <button 
            onClick={handleSkip}
            className="pointer-events-auto bg-white/5 hover:bg-white/10 text-white/40 text-xs px-4 py-2 rounded-full border border-white/10 transition-all"
          >
            Pular Show →
          </button>
        </div>
      )}

      <AnimatePresence>{showLetter && <AfterShowLetter onContinue={handleSkip} />}</AnimatePresence>
    </div>
  );
}
