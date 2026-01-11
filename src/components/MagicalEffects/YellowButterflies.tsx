import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface YellowButterfliesProps {
  count?: number;
  active?: boolean;
}

export function YellowButterflies({ count = 8, active = true }: YellowButterfliesProps) {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    if (!active) {
      setButterflies([]);
      return;
    }

    const newButterflies: Butterfly[] = [];
    for (let i = 0; i < count; i++) {
      newButterflies.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 8,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 5,
      });
    }
    setButterflies(newButterflies);
  }, [count, active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {butterflies.map((butterfly) => (
          <motion.div
            key={butterfly.id}
            className="absolute"
            initial={{
              x: `${butterfly.x}vw`,
              y: '110vh',
              opacity: 0,
            }}
            animate={{
              x: [
                `${butterfly.x}vw`,
                `${butterfly.x + 10}vw`,
                `${butterfly.x - 5}vw`,
                `${butterfly.x + 15}vw`,
                `${butterfly.x}vw`,
              ],
              y: ['110vh', '80vh', '50vh', '20vh', '-10vh'],
              opacity: [0, 1, 1, 1, 0],
              rotate: [0, 10, -10, 5, 0],
            }}
            transition={{
              duration: butterfly.duration,
              delay: butterfly.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              fontSize: butterfly.size,
            }}
          >
            <span className="butterfly-emoji">🦋</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
