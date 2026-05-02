import { useState, useCallback, useRef, useEffect } from 'react';
import { Slide } from './components/Slide';
import { totalSlides, playlist, slides } from './data/retrospectiva';

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const audiosRef = useRef<HTMLAudioElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const userHasInteractedRef = useRef(false);

  // Initialize all audios once
  useEffect(() => {
    const audios = playlist.map(track => {
      const audio = new Audio(track.file);
      audio.preload = 'auto';
      audio.volume = 0.5;
      return audio;
    });
    audiosRef.current = audios;

    return () => {
      audios.forEach(a => {
        a.pause();
        a.src = '';
      });
    };
  }, []);

  const crossfade = useCallback((fromIndex: number | null, toIndex: number) => {
    if (!audiosRef.current) return;
    
    const fadeDuration = 3000; // 3 seconds crossfade
    const steps = 30;
    const interval = fadeDuration / steps;
    
    const toAudio = audiosRef.current[toIndex];
    const fromAudio = fromIndex !== null ? audiosRef.current[fromIndex] : null;

    if (toAudio) {
      toAudio.volume = 0;
      toAudio.play().catch(e => console.error("Crossfade play failed:", e));
      
      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        const volume = currentStep / steps;
        
        toAudio.volume = volume * 0.5; // Target volume 0.5
        if (fromAudio) {
          fromAudio.volume = (1 - volume) * 0.5;
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          if (fromAudio) {
            fromAudio.pause();
            fromAudio.volume = 0.5;
          }
          toAudio.volume = 0.5;
          setCurrentTrackIndex(toIndex);
          setIsPlaying(true);
        }
      }, interval);
    }
  }, []);

  const playTrack = useCallback((index: number) => {
    if (!audiosRef.current || audiosRef.current.length === 0) return;
    
    if (currentTrackIndex === index && isPlaying) return;

    crossfade(isPlaying ? currentTrackIndex : null, index);
  }, [currentTrackIndex, isPlaying, crossfade]);

  const stopAllMusic = useCallback(() => {
    if (audiosRef.current) {
      audiosRef.current.forEach(audio => {
        // Smoothly fade out all playing audio
        if (!audio.paused) {
          let vol = audio.volume;
          const fadeOut = setInterval(() => {
            vol -= 0.05;
            if (vol <= 0) {
              audio.volume = 0;
              audio.pause();
              clearInterval(fadeOut);
            } else {
              audio.volume = vol;
            }
          }, 50);
        }
      });
    }
    setIsPlaying(false);
  }, []);

  const handleNavigate = useCallback(
    (dir: 'next' | 'prev') => {
      if (dir === 'next' && slideIndex < totalSlides - 1) {
        const nextIndex = slideIndex + 1;
        
        // CRITICAL: Trigger first play on user interaction (Start -> First Slide)
        if (slideIndex === 0) {
          userHasInteractedRef.current = true;
          
          // Unlock context for ALL tracks by playing and immediately pausing
          audiosRef.current.forEach((audio, idx) => {
            const p = audio.play();
            if (p) {
              p.then(() => {
                // If it's the first track, keep it playing, otherwise pause
                if (idx !== 0) audio.pause();
                else {
                  setIsPlaying(true);
                  setCurrentTrackIndex(0);
                }
              }).catch(e => console.error("Initial unlock failed:", e));
            }
          });
        }
        
        setSlideIndex(nextIndex);
      } else if (dir === 'prev' && slideIndex > 0) {
        let targetIndex = slideIndex - 1;
        // Skip cinematic transitions and intro texts when going back
        while (targetIndex > 0 && (slides[targetIndex].type === 'cinematic_text' || slides[targetIndex].type === 'transition')) {
          targetIndex--;
        }
        setSlideIndex(targetIndex);
      }
    },
    [slideIndex]
  );

  // Handle automatic track switching and overlap prevention
  useEffect(() => {
    if (!userHasInteractedRef.current) return;

    const currentSlide = slides[slideIndex];
    
    // Prevention: Stop background music during cinematic shows with their own audio
    const isCinematicShow = 
      currentSlide?.type === 'movie' || 
      currentSlide?.type === 'space_movie' || 
      currentSlide?.type === 'horror';

    if (isCinematicShow) {
      stopAllMusic();
      return;
    }

    // Logic: Switch to 'Aliança' (index 1) during cinematic texts and the transition
    const transitionSlideIndex = slides.findIndex(s => s.id === 411);
    const isSaudadePart = 
      currentSlide?.type === 'cinematic_text' || 
      currentSlide?.title === 'O Primeiro Jantar' || 
      currentSlide?.id === 42 ||
      currentSlide?.id === 411;

    // Logic: Switch to 'Exagerado' (index 2) during the childhood intro and childhood slide
    const isExageradoPart = currentSlide?.id === 815 || currentSlide?.type === 'childhood';

    if (isExageradoPart) {
      if (currentTrackIndex !== 2) {
        playTrack(2);
      }
    } else if (isSaudadePart) {
      if (currentTrackIndex !== 1) {
        playTrack(1);
      }
    } else if (slideIndex > 0 && slideIndex < transitionSlideIndex) {
      // Revert to 'Perfect' (index 0) if going back before transition
      if (currentTrackIndex !== 0) {
        playTrack(0);
      }
    } else {
      // General safety: resume current track if it was stopped by a cinematic show
      const activeAudio = audiosRef.current[currentTrackIndex];
      if (activeAudio && activeAudio.paused && !isCinematicShow) {
        activeAudio.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [slideIndex, currentTrackIndex, playTrack, stopAllMusic, isPlaying]);

  return (
    <div className="w-full h-dvh bg-black overflow-hidden">
      <Slide 
        slideIndex={slideIndex} 
        onNavigate={handleNavigate} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTrackIndex={currentTrackIndex}
        playTrack={playTrack}
        audios={audiosRef.current}
        onStartMusic={() => playTrack(0)}
      />
    </div>
  );
}
