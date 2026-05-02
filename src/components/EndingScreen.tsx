import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const orbs: {
      id: number;
      x: number;
      y: number;
      baseX: number;
      radius: number;
      speed: number;
      swayAmplitude: number;
      swaySpeed: number;
      swayOffset: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
    }[] = [];

    for (let i = 0; i < 20; i++) {
      orbs.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        radius: Math.random() * 4 + 1,
        speed: Math.random() * 0.3 + 0.1,
        swayAmplitude: Math.random() * 40 + 20,
        swaySpeed: Math.random() * 0.005 + 0.002,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      orbs.forEach((orb) => {
        orb.y -= orb.speed;
        orb.x = orb.baseX + Math.sin(time * orb.swaySpeed + orb.swayOffset) * orb.swayAmplitude;
        const pulse = Math.sin(time * orb.pulseSpeed + orb.pulseOffset) * 0.15 + 0.85;
        const currentOpacity = orb.opacity * pulse;

        if (orb.y < -20) {
          orb.y = canvas.height + 20;
          orb.baseX = Math.random() * canvas.width;
        }

        const isPurple = orb.id % 2 === 0;
        const color = isPurple ? '168, 85, 247' : '34, 197, 94';

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * 3,
        );
        gradient.addColorStop(0, `rgba(${color}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${color}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134, 239, 172, ${currentOpacity * 0.8})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

export function EndingScreen() {
  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="relative w-full h-full bg-zinc-950 flex flex-col items-center justify-center px-6 overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-7xl mb-8"
        >
          💚
        </motion.div>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-green-400 mb-4"
        >
          Essa foi só uma pequena parte
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-white/70 mb-2 max-w-xs"
        >
          da nossa história.
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-base text-white/50 mb-10 max-w-xs leading-relaxed"
        >
          O melhor ainda está por vir. E eu quero estar em cada momento ao seu lado.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="px-10 py-4 rounded-full font-bold text-base bg-green-500 text-black shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
          >
            Ver de novo ↻
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 text-sm font-medium text-white/50"
        >
          Feito com muito amor, por Rafael, para Ana ❤️
        </motion.p>
      </div>
    </div>
  );
}
