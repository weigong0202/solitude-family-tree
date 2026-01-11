import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { getPortrait, getPlaceholderPortrait } from '../../services/imagen';

interface CharacterNodeProps {
  character: Character;
  x: number;
  y: number;
  onClick: (character: Character) => void;
}

// Generation-based colors for visual distinction
const generationColors: Record<number, string> = {
  1: '#B58900', // Gold - founders
  2: '#2AA198', // Teal
  3: '#268BD2', // Blue
  4: '#6C71C4', // Purple
  5: '#D33682', // Magenta
  6: '#CB4B16', // Orange
  7: '#DC322F', // Red - final generation
};

export function CharacterNode({ character, x, y, onClick }: CharacterNodeProps) {
  const [portrait, setPortrait] = useState<string>(getPortrait(character));

  // Handle image load error by falling back to placeholder
  useEffect(() => {
    const img = new Image();
    img.src = getPortrait(character);
    img.onerror = () => setPortrait(getPlaceholderPortrait(character));
  }, [character]);

  const strokeColor = generationColors[character.generation] || '#B58900';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
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
        stroke={strokeColor}
        strokeWidth={3}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />

      {/* Name label */}
      <motion.text
        x={x}
        y={y + 55}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="#EEE8D5"
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
        fill={strokeColor}
        fontFamily="Lora, serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.4 }}
      >
        Gen {character.generation}
      </motion.text>
    </motion.g>
  );
}
