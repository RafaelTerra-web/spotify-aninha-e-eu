import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { elogios } from '../data/retrospectiva';

interface PhysicsLetter {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  isTarget: boolean;
  isDocked: boolean;
  opacity: number;
  size: number;
  rotation: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  targetOpacity: number;
  rotation?: number;
  vRotation?: number;
  text?: string;
}

const LOVE_LANGUAGES = [
  'Eu te amo', 'I love you', 'Te amo', 'Je t\'aime', 'Ti amo', 
  'Ich liebe dich', 'Aishiteru', 'Wo ai ni', 'Ya lyublyu tebya', 
  'Ana behibak', 'Saranghae', 'Szeretlek', 'Te iubesc', 'Eu te amo',
  'Aloha wau ia oi', 'Miluji te', 'Jeg elsker dig', 'Ik hou van jou',
  'Minä rakastan sinua', 'S\'agapo', 'Ani ohev otach', 'Saya cintamu',
  'Mahal kita', 'Volim te', 'Tave myliu', 'Jeg elsker deg', 'Kocham cie',
  'Te amo', 'Jag älskar dig', 'Seni seviyorum', 'Anh yeu em', 'Em yeu anh'
];

const NOISE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&*';

export function ElogiosSlide({ onNext }: { onNext?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentElogioIndex, setCurrentElogioIndex] = useState(0);
  const lettersRef = useRef<PhysicsLetter[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const loveTextsRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animFrameRef = useRef<number>(0);
  const [allDocked, setAllDocked] = useState(false);

  // Initialize fireflies and love texts
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 35; i++) { // Optimized count
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random(),
        targetOpacity: Math.random(),
      });
    }
    particlesRef.current = particles;

    const loveTexts: Particle[] = [];
    for (let i = 0; i < 25; i++) { // Optimized count
      loveTexts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 8 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.2,
        targetOpacity: Math.random() * 0.2,
        rotation: (Math.random() - 0.5) * 0.3, // Subtle rotation
        vRotation: (Math.random() - 0.5) * 0.005, // Very slow spin
        text: LOVE_LANGUAGES[Math.floor(Math.random() * LOVE_LANGUAGES.length)],
      });
    }
    loveTextsRef.current = loveTexts;
  }, []);

  const handleNext = () => {
    if (currentElogioIndex === elogios.length - 1) {
      onNext?.();
    } else {
      setCurrentElogioIndex((prev) => (prev + 1) % elogios.length);
    }
  };

  // Initialize letters for the current compliment
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const elogio = elogios[currentElogioIndex];
    const letters: PhysicsLetter[] = [];
    
    // Calculate layout for target text
    const isMobile = width < 640;
    const fontSize = isMobile ? 22 : 32;
    const charSpacing = fontSize * 0.65;
    
    // Split into lines if needed for mobile
    const words = elogio.split(' ');
    let lines: string[] = [''];
    let currentLine = 0;
    const maxCharsPerLine = isMobile ? 15 : 40;

    words.forEach(word => {
      if ((lines[currentLine] + word).length > maxCharsPerLine) {
        currentLine++;
        lines[currentLine] = word + ' ';
      } else {
        lines[currentLine] += word + ' ';
      }
    });

    lines.forEach((line, lineIdx) => {
      const lineY = height / 2 - (lines.length / 2) * fontSize * 1.5 + lineIdx * fontSize * 1.5;
      const startX = (width - line.length * charSpacing) / 2;
      
      line.split('').forEach((char, charIdx) => {
        if (char === ' ') return;
        letters.push({
          id: lineIdx * 100 + charIdx,
          char,
          x: width / 2 + (Math.random() - 0.5) * width * 0.6,
          y: height / 2 + (Math.random() - 0.5) * height * 0.6,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          targetX: startX + charIdx * charSpacing,
          targetY: lineY,
          isTarget: true,
          isDocked: false,
          opacity: 0,
          size: fontSize,
          rotation: Math.random() * 360,
        });
      });
    });

    // Noise Letters
    for (let i = 0; i < 30; i++) { // Optimized noise letters
      letters.push({
        id: 1000 + i,
        char: NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)],
        x: width / 2 + (Math.random() - 0.5) * width * 0.6,
        y: height / 2 + (Math.random() - 0.5) * height * 0.6,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        targetX: -200,
        targetY: -200,
        isTarget: false,
        isDocked: false,
        opacity: 0.06,
        size: 10 + Math.random() * 6,
        rotation: Math.random() * 360,
      });
    }

    lettersRef.current = letters;
    setAllDocked(false);
  }, [currentElogioIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      
      // Draw fireflies/stars background
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        p.opacity += (p.targetOpacity - p.opacity) * 0.03;
        if (Math.abs(p.opacity - p.targetOpacity) < 0.1) {
          p.targetOpacity = Math.random();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${p.opacity * 0.5})`;
        ctx.fill();
        ctx.restore();
      });

      // Draw floating "I love you" texts
      loveTextsRef.current.forEach(t => {
        t.x += t.vx;
        t.y += t.vy;
        if (t.rotation !== undefined && t.vRotation !== undefined) {
          t.rotation += t.vRotation;
        }

        if (t.x < -150) t.x = canvas.width + 150;
        if (t.x > canvas.width + 150) t.x = -150;
        if (t.y < -100) t.y = canvas.height + 100;
        if (t.y > canvas.height + 100) t.y = -100;

        t.opacity += (t.targetOpacity - t.opacity) * 0.01;
        if (Math.abs(t.opacity - t.targetOpacity) < 0.05) {
          t.targetOpacity = Math.random() * 0.2;
        }

        ctx.save();
        ctx.translate(t.x, t.y);
        if (t.rotation !== undefined) {
          ctx.rotate(t.rotation);
        }
        ctx.font = `${t.size}px sans-serif`;
        // Intense red glow with larger radius
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.9)'; // Even more intense red
        ctx.fillStyle = `rgba(255, 255, 255, ${t.opacity})`;
        ctx.textAlign = 'center';
        ctx.fillText(t.text!, 0, 0);
        ctx.restore();
      });
      
      // Physics Constants
      const isMobile = window.innerWidth < 768;
      const magnetRadius = isMobile ? 120 : 450; // Much smaller for mobile
      const repelRadius = isMobile ? 60 : 150;  // Much smaller for mobile
      const damping = 0.9; 
      const attractionForce = isMobile ? 0.15 : 0.2; // Softer on mobile
      const repelForce = 6;

      let dockedCount = 0;
      const targetLetters = lettersRef.current.filter(l => l.isTarget);

      lettersRef.current.forEach((l) => {
        if (l.isDocked) {
          l.x += (l.targetX - l.x) * 0.15; // Smoother docking
          l.y += (l.targetY - l.y) * 0.15;
          l.vx *= 0.8;
          l.vy *= 0.8;
          l.rotation += (0 - l.rotation) * 0.2;
          l.opacity = 1;
          dockedCount++;
        } else {
          const dx = mouse.x - l.x;
          const dy = mouse.y - l.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (mouse.active) {
            if (l.isTarget) {
              if (dist < magnetRadius) {
                const power = (1 - dist / magnetRadius);
                l.vx += dx * power * attractionForce;
                l.vy += dy * power * attractionForce;
                l.opacity = Math.min(0.9, l.opacity + 0.15);
                
                const distToHome = Math.sqrt(Math.pow(l.targetX - l.x, 2) + Math.pow(l.targetY - l.y, 2));
                if (distToHome < 100) {
                  l.isDocked = true;
                }
              }
            } else {
              if (dist < repelRadius) {
                const angle = Math.atan2(l.y - mouse.y, l.x - mouse.x);
                const power = (1 - dist / repelRadius);
                l.vx += Math.cos(angle) * power * repelForce;
                l.vy += Math.sin(angle) * power * repelForce;
                l.opacity = Math.max(0.05, l.opacity - 0.03);
              }
            }
          }

          l.vx *= damping;
          l.vy *= damping;
          l.x += l.vx;
          l.y += l.vy;
          l.rotation += l.vx * 2;

          if (l.x < -20) l.x = canvas.width + 20;
          if (l.x > canvas.width + 20) l.x = -20;
          if (l.y < -20) l.y = canvas.height + 20;
          if (l.y > canvas.height + 20) l.y = -20;
        }

        // Draw Letter
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate((l.rotation * Math.PI) / 180);
        
        if (l.isDocked) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#4ade80';
          ctx.fillStyle = '#4ade80';
        } else {
          ctx.fillStyle = l.isTarget ? '#22c55e' : '#ffffff';
        }
        
        ctx.globalAlpha = l.opacity;
        ctx.font = `bold ${l.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(l.char, 0, 0);
        ctx.restore();
      });

      if (dockedCount === targetLetters.length && targetLetters.length > 0 && !allDocked) {
        setAllDocked(true);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [allDocked]);

  const handlePointer = (e: React.PointerEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden touch-none">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_70%)]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        onPointerUp={() => { mouseRef.current.active = false; }}
        onPointerLeave={() => { mouseRef.current.active = false; }}
      />

      <div className="relative z-10 p-8 flex flex-col items-center justify-end h-full pointer-events-none">
        <AnimatePresence>
          {allDocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 pointer-events-auto"
            >
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-green-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95 transition-transform uppercase text-sm"
              >
                Próxima fase →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-12">
          {elogios.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentElogioIndex ? 'bg-green-500 w-8' : 'bg-white/10 w-3'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
