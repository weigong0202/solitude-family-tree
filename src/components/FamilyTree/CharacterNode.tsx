import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character, CharacterStatus } from '../../types';
import { getPortrait, getPlaceholderPortrait } from '../../services/imagen';

interface CharacterNodeProps {
  character: Character;
  status: CharacterStatus;
  x: number;
  y: number;
  onClick: (character: Character) => void;
}

const statusStyles: Record<CharacterStatus, { opacity: number; filter: string; strokeColor: string; textColor: string }> = {
  not_born: { opacity: 0, filter: 'none', strokeColor: 'transparent', textColor: 'transparent' },
  alive_young: { opacity: 1, filter: 'none', strokeColor: '#2AA198', textColor: '#EEE8D5' },
  alive_aged: { opacity: 0.85, filter: 'sepia(30%)', strokeColor: '#B58900', textColor: '#EEE8D5' },
  deceased: { opacity: 0.5, filter: 'grayscale(100%)', strokeColor: '#657B83', textColor: '#93A1A1' },
};

export function CharacterNode({ character, status, x, y, onClick }: CharacterNodeProps) {
  const [portrait, setPortrait] = useState<string>(getPortrait(character));

  // Handle image load error by falling back to placeholder
  useEffect(() => {
    const img = new Image();
    img.src = getPortrait(character);
    img.onerror = () => setPortrait(getPlaceholderPortrait(character));
  }, [character]);

  if (status === 'not_born') return null;

  const styles = statusStyles[status];

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: styles.opacity,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(character)}
    >
      {/* Background circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={38}
        fill="#2D2118"
        stroke={styles.strokeColor}
        strokeWidth={status === 'alive_young' ? 3 : 2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      />

      {/* Portrait image */}
      <clipPath id={`clip-${character.id}`}>
        <circle cx={x} cy={y} r={35} />
      </clipPath>
      <motion.image
        href={portrait}
        x={x - 35}
        y={y - 35}
        width={70}
        height={70}
        clipPath={`url(#clip-${character.id})`}
        style={{ filter: styles.filter }}
        initial={{ opacity: 0 }}
        animate={{ opacity: styles.opacity }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />

      {/* Death indicator */}
      {status === 'deceased' && (
        <motion.circle
          cx={x + 28}
          cy={y - 28}
          r={8}
          fill="#657B83"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <title>Deceased</title>
        </motion.circle>
      )}

      {/* Name label */}
      <motion.text
        x={x}
        y={y + 55}
        textAnchor="middle"
        fontSize={11}
        fontWeight={500}
        fill={styles.textColor}
        fontFamily="Lora, serif"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {character.nickname || character.name.split(' ').slice(0, 2).join(' ')}
      </motion.text>

      {/* Generation indicator */}
      <motion.text
        x={x}
        y={y + 68}
        textAnchor="middle"
        fontSize={9}
        fill="#93A1A1"
        fontFamily="Lora, serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
      >
        Gen {character.generation}
      </motion.text>
    </motion.g>
  );
}
