import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface GoldenDustProps {
  count?: number;
  active?: boolean;
}

export function GoldenDust({ count = 20, active = true }: GoldenDustProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 8,
      });
    }
    setParticles(newParticles);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, #B58900 0%, #D4A017 50%, transparent 100%)',
            boxShadow: '0 0 6px #B58900',
          }}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              `${particle.x}vw`,
              `${particle.x + 5}vw`,
              `${particle.x - 3}vw`,
              `${particle.x + 2}vw`,
            ],
            y: [
              `${particle.y}vh`,
              `${particle.y - 10}vh`,
              `${particle.y - 20}vh`,
              `${particle.y - 30}vh`,
            ],
            opacity: [0, 0.8, 0.6, 0],
            scale: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
