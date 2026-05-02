import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slides, totalSlides } from '../data/retrospectiva';
import { ProgressBar } from './ProgressBar';
import { MusicButton } from './MusicButton';
import { PhotoGallery } from './PhotoGallery';
import { ElogiosSlide } from './ElogiosSlide';
import { StartScreen } from './StartScreen';
import { EndingScreen } from './EndingScreen';
import { MichaelJacksonShow } from './MichaelJacksonShow';
import { SpaceShow } from './SpaceShow';
import { HorrorShow } from './HorrorShow';
import { CinematicSlide } from './CinematicSlide';
import { TransitionSlide } from './TransitionSlide';
import { VideoSlide } from './VideoSlide';
import { TopArtistsSlide } from './TopArtistsSlide';
import { MusicMoodSlide } from './MusicMoodSlide';
import { OrientationWarning } from './OrientationWarning';
import { VibeSlide } from './VibeSlide';
import { Timeline } from './Timeline';
import { RankingCard } from './RankingCard';
import { StatsSlide } from './StatsSlide';
import { StorySlide } from './StorySlide';
import { FinalLetter } from './FinalLetter';
import { ChildhoodConnection } from './ChildhoodConnection';

interface SlideProps {
  slideIndex: number;
  onNavigate: (dir: 'next' | 'prev') => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackIndex: number;
  playTrack: (index: number) => void;
  audios: HTMLAudioElement[];
  onStartMusic?: () => void;
}

export function Slide({
  slideIndex,
  onNavigate,
  isPlaying,
  setIsPlaying,
  currentTrackIndex,
  playTrack,
  audios,
  onStartMusic,
}: SlideProps) {
  const slide = slides[slideIndex];
  const lastTap = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      return;
    }
    lastTap.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const width = window.innerWidth;
    const x = e.clientX;
    
    // Disable manual taps for cinematic types and interactive childhood slide
    if (slide.type === 'cinematic_text' || slide.type === 'horror' || slide.type === 'space_movie' || slide.type === 'movie' || slide.type === 'transition' || slide.type === 'childhood') {
      return;
    }

    if (x < width / 3) {
      onNavigate('prev');
    } else if (x > (width * 2) / 3) {
      onNavigate('next');
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (slide.type === 'cinematic_text' || slide.type === 'horror' || slide.type === 'space_movie' || slide.type === 'movie' || slide.type === 'transition') {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') onNavigate('next');
      if (e.key === 'ArrowLeft') onNavigate('prev');
    },
    [onNavigate, slide.type],
  );

  const renderContent = () => {
    switch (slide.type) {
      case 'start':
        return <StartScreen onNavigate={onNavigate} onStartMusic={onStartMusic} audios={audios} />;
      case 'story':
        return <StorySlide data={slide} />;
      case 'vibe':
        return <VibeSlide {...slide} />;
      case 'timeline':
        return <Timeline />;
      case 'ranking':
        return <RankingCard />;
      case 'stats':
        return <StatsSlide />;
      case 'artists':
        return <TopArtistsSlide />;
      case 'mood':
        return <MusicMoodSlide />;
      case 'gallery':
        return <PhotoGallery />;
      case 'cinematic_text':
        return <CinematicSlide text={slide.text || ''} onNext={() => onNavigate('next')} />;
      case 'horror':
        return (
          <HorrorShow onSkip={() => onNavigate('next')} onBack={() => onNavigate('prev')} />
        );
      case 'space_movie':
        return (
          <SpaceShow onSkip={() => onNavigate('next')} onBack={() => onNavigate('prev')} />
        );
      case 'transition':
        return <TransitionSlide text={slide.text || ''} onNext={() => onNavigate('next')} />;
      case 'video':
        return <VideoSlide data={slide} />;
      case 'movie':
        return (
          <MichaelJacksonShow onSkip={() => onNavigate('next')} onBack={() => onNavigate('prev')} />
        );
      case 'elogios':
        return <ElogiosSlide onNext={() => onNavigate('next')} />;
      case 'childhood':
        return <ChildhoodConnection onNext={() => onNavigate('next')} />;
      case 'letter':
        return <FinalLetter />;
      case 'ending':
        return <EndingScreen />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full h-full outline-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full h-full overflow-hidden"
        >
          {slide.type !== 'start' && slide.type !== 'movie' && slide.type !== 'space_movie' && slide.type !== 'horror' && slide.type !== 'transition' && slide.type !== 'cinematic_text' && (
            <div className="absolute top-0 left-0 right-0 z-50">
              <ProgressBar current={slideIndex + 1} total={totalSlides} />
              <div className="flex justify-center mt-4">
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  {slideIndex + 1} de {totalSlides}
                </span>
              </div>
            </div>
          )}

          {renderContent()}

          {/* Side Navigation Buttons - More accessible for Mobile */}
          {slide.type !== 'start' && slide.type !== 'ending' && slide.type !== 'movie' && slide.type !== 'space_movie' && slide.type !== 'horror' && slide.type !== 'transition' && slide.type !== 'cinematic_text' && slide.type !== 'childhood' && (
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-40 flex items-center justify-between px-4">
              {slideIndex > 0 ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                  className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white/40 pointer-events-auto active:scale-90 transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : <div />}
              
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white/40 pointer-events-auto active:scale-90 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
