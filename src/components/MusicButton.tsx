import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playlist } from '../data/retrospectiva';

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

interface MusicButtonProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackIndex: number;
  playTrack: (index: number) => void;
  audios: HTMLAudioElement[];
}

export function MusicButton({ 
  isPlaying, 
  setIsPlaying, 
  currentTrackIndex, 
  playTrack, 
  audios 
}: MusicButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const seekRef = useRef(false);

  const currentAudio = audios[currentTrackIndex];

  useEffect(() => {
    if (!currentAudio) return;

    const onLoaded = () => setDuration(currentAudio.duration);
    const onTimeUpdate = () => {
      if (!seekRef.current) {
        setCurrentTime(currentAudio.currentTime);
        setProgress(currentAudio.duration ? (currentAudio.currentTime / currentAudio.duration) * 100 : 0);
      }
    };

    currentAudio.addEventListener('loadedmetadata', onLoaded);
    currentAudio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      currentAudio.removeEventListener('loadedmetadata', onLoaded);
      currentAudio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [currentAudio]);

  const togglePlay = () => {
    if (!currentAudio) return;
    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      currentAudio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentAudio || !currentAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    currentAudio.currentTime = pct * currentAudio.duration;
    seekRef.current = true;
    setTimeout(() => { seekRef.current = false; }, 100);
  };

  const track = playlist[currentTrackIndex];

  return (
    <div className="absolute right-4 z-50 top-[calc(1rem+env(safe-area-inset-top))]">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-14 w-[min(18rem,calc(100vw-2rem))] bg-zinc-900/95 border border-zinc-700/50 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0"
                >
                  <svg className="w-6 h-6 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 19v2M21 16v2M5 17v2" />
                  </svg>
                </motion.div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                  <p className="text-xs text-white/50">{track.artist}</p>
                </div>
              </div>

              <div className="mb-3">
                <div
                  className="w-full h-1.5 bg-zinc-700 rounded-full cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-green-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-white/40">{formatTime(currentTime)}</span>
                  <span className="text-[10px] text-white/40">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mb-3">
                <button
                  onClick={() => playTrack(currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>
                <button
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 active:scale-95 transition-all"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l10-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => playTrack((currentTrackIndex + 1) % playlist.length)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>

              <div className="border-t border-zinc-700/50 pt-3">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium">Playlist</p>
                <div className="max-h-28 overflow-y-auto no-scrollbar">
                  {playlist.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => playTrack(i)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                        i === currentTrackIndex ? 'bg-green-500/15 text-green-400' : 'text-white/40 hover:text-white/70 hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="w-4 text-center flex-shrink-0 text-[10px]">{i + 1}</span>
                      <span className="truncate">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Toggle music player"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlaying ? 'playing' : 'paused'}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            {isPlaying ? (
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l10-7z" />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>

        {isPlaying && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid rgba(29, 185, 84, 0.4)' }}
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid rgba(29, 185, 84, 0.3)' }}
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
            />
          </>
        )}
      </button>
    </div>
  );
}
