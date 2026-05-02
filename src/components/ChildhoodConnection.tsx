import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export function ChildhoodConnection({ onNext }: { onNext?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001
  });

  // Animation transforms based on scroll
  const pathLength = useTransform(smoothProgress, [0, 1], [0.05, 1]);
  const rafaTextOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  
  // Guidance texts opacity
  const guidance1Opacity = useTransform(smoothProgress, [0.2, 0.4, 0.5], [0, 1, 0]);
  const guidance2Opacity = useTransform(smoothProgress, [0.55, 0.75, 0.85], [0, 1, 0]);
  
  const anaTextOpacity = useTransform(smoothProgress, [0.95, 1], [0, 1]);
  const anaTextY = useTransform(smoothProgress, [0.95, 1], [20, 0]);
  const showButton = useTransform(smoothProgress, [0.99, 1], [0, 1]);

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden touch-none">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-green-500/10 blur-sm" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Content Container - 5x Width */}
      <div 
        ref={containerRef}
        className="relative flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar z-10"
      >
        {/* THE ROPE */}
        <div className="absolute inset-0 w-[500%] h-full pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 5000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="5%" stopColor="#1DB954" />
                <stop offset="95%" stopColor="#1DB954" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.path
              d="M 500 500 
                 C 1200 500, 1800 200, 2500 500
                 S 3800 800, 4500 500"
              fill="none"
              stroke="url(#magicGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="15 12"
              filter="url(#glow)"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* Slide 1: Rafa */}
        <div className="relative w-full h-full shrink-0 snap-start flex flex-col items-center justify-center p-8 z-10">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15)] mb-12"
          >
            <img src="/images/RafaKid.jpeg" alt="Rafa Kid" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div style={{ opacity: rafaTextOpacity }} className="text-center px-4">
            <h3 className="text-2xl md:text-3xl font-black text-white italic drop-shadow-lg leading-tight">
              "Quando crescer, quem vai ser minha princesa?"
            </h3>
            <div className="mt-6 flex flex-col items-center gap-2">
               <div className="w-px h-12 bg-gradient-to-b from-green-500 to-transparent animate-bounce" />
               <p className="text-green-500 font-bold uppercase tracking-[0.4em] text-[10px]">Arraste para o lado</p>
            </div>
          </motion.div>
        </div>

        {/* Transition Slides with Guidance */}
        <div className="w-full h-full shrink-0 snap-center flex items-center justify-center">
          <motion.p 
            style={{ opacity: guidance1Opacity }}
            className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm"
          >
            Continue arrastando...
          </motion.p>
        </div>
        
        <div className="w-full h-full shrink-0 snap-center flex items-center justify-center">
          <motion.p 
            style={{ opacity: guidance2Opacity }}
            className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm"
          >
            Só mais um pouco...
          </motion.p>
        </div>

        <div className="w-full h-full shrink-0 snap-center" />

        {/* Slide 5: Ana */}
        <div className="relative w-full h-full shrink-0 snap-end flex flex-col items-center justify-center p-8 z-10">
          <motion.div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 border-green-500/40 shadow-[0_0_60px_rgba(29,185,84,0.3)] mb-12"
          >
            <img src="/images/AnaKid.jpeg" alt="Ana Kid" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div 
            style={{ opacity: anaTextOpacity, y: anaTextY }} 
            className="text-center max-w-sm px-4"
          >
            <h3 className="text-3xl md:text-4xl font-black text-green-400 italic mb-4">
              "Eu né, bobo!"
            </h3>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm mb-12">
              <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
                Nossos caminhos já estavam traçados muito antes de cruzarem. Conectados pelo destino desde a maternidade. ❤️
              </p>
            </div>

            <motion.button
              style={{ opacity: showButton }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (smoothProgress.get() > 0.98) {
                  onNext?.();
                }
              }}
              className="px-8 py-3 bg-green-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] uppercase text-sm"
            >
              Prosseguir →
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-green-500/60"
          style={{ width: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
