import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface StartScreenProps {
  onNavigate: (dir: 'next' | 'prev') => void;
  onStartMusic?: () => void;
  audios?: HTMLAudioElement[];
}

export function StartScreen({ onNavigate, onStartMusic, audios }: StartScreenProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeLabel, setCurrentTimeLabel] = useState('0:00');
  const [durationLabel, setDurationLabel] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (audios && audios[0]) {
      audioRef.current = audios[0];
    }
  }, [audios]);

  const handleStart = () => {
    if (isStarting) return;
    setIsStarting(true);
    
    // Start music immediately
    if (onStartMusic) {
      onStartMusic();
    }

    // Timer for navigation (10 seconds)
    setTimeout(() => {
      onNavigate('next');
    }, 10000);
  };

  // Sync progress bar with ACTUAL audio progress
  useEffect(() => {
    let interval: number;
    
    if (isStarting) {
      interval = window.setInterval(() => {
        const audio = audioRef.current;
        if (audio) {
          const cur = audio.currentTime;
          const dur = audio.duration || 1;
          const percent = (cur / dur) * 100;
          
          setProgress(percent);
          
          const curMins = Math.floor(cur / 60);
          const curSecs = Math.floor(cur % 60);
          setCurrentTimeLabel(`${curMins}:${curSecs.toString().padStart(2, '0')}`);
          
          if (audio.duration) {
            const durMins = Math.floor(dur / 60);
            const durSecs = Math.floor(dur % 60);
            setDurationLabel(`${durMins}:${durSecs.toString().padStart(2, '0')}`);
          }
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isStarting]);

  return (
    <div className="relative w-full h-full bg-[#121212] text-white flex justify-center items-center font-sans overflow-hidden">
      
      {/* Desktop Immersive Background */}
      <div className="absolute inset-0 hidden md:block">
        <img 
          src="/images/Ida ao shopping.jpeg" 
          className="w-full h-full object-cover opacity-30 blur-[100px] scale-110" 
          alt=""
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Container */}
      <div className="relative w-full h-full md:h-[92vh] md:max-h-[850px] md:max-w-[390px] bg-[#121212] md:rounded-[45px] md:shadow-[0_0_50px_rgba(0,0,0,0.8)] md:border md:border-white/10 flex flex-col z-10 overflow-hidden">
        
        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-8 pt-[env(safe-area-inset-top,48px)] pb-4 shrink-0">
          <button 
            onClick={toggleFullscreen}
            className="p-1 -ml-1 opacity-80 active:opacity-100 transition-opacity"
          >
            {isFullscreen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">Tocando da playlist</span>
            <span className="text-xs font-bold text-white tracking-tight">Nossa retrospectiva</span>
          </div>

          <button className="p-1 -mr-1 opacity-80">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 flex flex-col px-8 mt-2 overflow-y-auto custom-scrollbar">
          
          {/* Album Art */}
          <motion.div 
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full aspect-square shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden relative shrink-0"
          >
            <img 
              src="/images/Ida ao shopping.jpeg" 
              alt="Nossa foto" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Song Content Section */}
          <div className="mt-8 flex flex-col flex-1">
            
            <div className="flex items-center justify-between mb-1">
              <div className="min-w-0 pr-4">
                <h2 className="text-2xl font-black tracking-tight truncate">Perfect</h2>
                <p className="text-white/70 font-medium text-lg leading-none mt-1">Ed Sheeran</p>
              </div>
              <motion.button 
                whileTap={{ scale: 0.8 }}
                className="text-green-500 shrink-0"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.button>
            </div>

            {/* Progress Slider synchronized with ACTUAL audio */}
            <div className="w-full mt-6">
              <div className="h-[4px] bg-white/20 rounded-full w-full relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-[width] duration-100 ease-linear" 
                  style={{ width: `${progress}%` }}
                />
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-[left] duration-100 ease-linear" 
                  style={{ left: `${progress}%`, marginLeft: progress > 0 ? '-6px' : '0px' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-white/50 tracking-widest">
                <span>{currentTimeLabel}</span>
                <span>{durationLabel !== '0:00' ? durationLabel : '4:23'}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mt-6 px-1">
              <button className="opacity-60">
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M7 11V7l-5 5 5 5v-4h10v4l5-5-5-5v4H7z" />
                </svg>
              </button>
              
              <button className="opacity-90">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleStart}
                disabled={isStarting}
                className={`w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center text-black shadow-2xl transition-all ${isStarting ? 'opacity-50' : 'active:bg-zinc-200'}`}
              >
                {isStarting ? (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 ml-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>

              <button className="opacity-90">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6zM16 6v12h2V6z" />
                </svg>
              </button>
              
              <button className="opacity-60">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 1l4 4-4 4M3 23l-4-4 4-4M13 13V5a2 2 0 00-2-2H4M11 11v8a2 2 0 002 2h7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Lyrics Card */}
            <motion.div 
              animate={isStarting ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
              className="mt-8 mb-6 p-5 bg-[#4ade80] rounded-xl text-black shadow-lg"
            >
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">Letra</h3>
              <p className="text-xl font-bold leading-tight">
                {isStarting ? "A nossa história está apenas começando..." : "Dê o play para descobrir a nossa trilha sonora."}
              </p>
            </motion.div>

            {/* Footer Artist Card */}
            <div className="mb-8 p-4 bg-zinc-800/40 rounded-2xl border border-white/5 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 border border-white/10 shrink-0">
                <img src="/images/Ana.jpeg" alt="Ana" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.1em] truncate">Especialmente para</p>
                <p className="text-sm font-bold truncate">A mulher da minha vida</p>
              </div>
              <button className="px-4 py-1.5 rounded-full border border-white/20 text-[11px] font-bold shrink-0">Seguindo</button>
            </div>
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-[env(safe-area-inset-bottom,34px)] w-full flex justify-center items-start pt-2 shrink-0">
          <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}