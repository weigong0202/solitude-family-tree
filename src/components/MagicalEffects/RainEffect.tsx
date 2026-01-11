import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Raindrop {
  id: number;
  x: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface RainEffectProps {
  active?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function RainEffect({ active = false, intensity = 'medium' }: RainEffectProps) {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  const dropCounts = {
    light: 30,
    medium: 60,
    heavy: 100,
  };

  useEffect(() => {
    if (!active) {
      setRaindrops([]);
      return;
    }

    const count = dropCounts[intensity];
    const drops: Raindrop[] = [];

    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100,
        duration: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.3,
      });
    }

    setRaindrops(drops);
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-[#839496] to-transparent"
          style={{
            left: `${drop.x}%`,
            height: '20px',
            opacity: drop.opacity,
          }}
          initial={{ y: '-20px' }}
          animate={{ y: '100vh' }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Rain overlay for atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(131, 148, 150, 0.1) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
