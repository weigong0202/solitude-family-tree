import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { getPortrait, getPlaceholderPortrait } from '../../services/imagen';

export type HighlightState = 'none' | 'hovered' | 'spouse' | 'parent' | 'child' | 'dimmed';

interface CharacterNodeProps {
  character: Character;
  x: number;
  y: number;
  isOutsider?: boolean;
  highlightState: HighlightState;
  onHover: (characterId: string | null) => void;
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

// Highlight state styles
const highlightStyles: Record<HighlightState, {
  opacity: number;
  strokeColor?: string;
  strokeWidth: number;
  glowColor?: string;
}> = {
  none: { opacity: 1, strokeWidth: 3 },
  hovered: { opacity: 1, strokeColor: '#FDF6E3', strokeWidth: 4, glowColor: '#FDF6E3' },
  spouse: { opacity: 1, strokeColor: '#B58900', strokeWidth: 4, glowColor: '#B58900' },
  parent: { opacity: 1, strokeColor: '#2AA198', strokeWidth: 4, glowColor: '#2AA198' },
  child: { opacity: 1, strokeColor: '#268BD2', strokeWidth: 4, glowColor: '#268BD2' },
  dimmed: { opacity: 0.25, strokeWidth: 2 },
};

export function CharacterNode({
  character,
  x,
  y,
  isOutsider,
  highlightState,
  onHover,
  onClick,
}: CharacterNodeProps) {
  const [portrait, setPortrait] = useState<string>(getPortrait(character));

  useEffect(() => {
    const img = new Image();
    img.src = getPortrait(character);
    img.onerror = () => setPortrait(getPlaceholderPortrait(character));
  }, [character]);

  const baseStrokeColor = generationColors[character.generation] || '#B58900';
  const styles = highlightStyles[highlightState];
  const strokeColor = styles.strokeColor || baseStrokeColor;
  const glowFilter = styles.glowColor
    ? `drop-shadow(0 0 8px ${styles.glowColor}) drop-shadow(0 0 16px ${styles.glowColor})`
    : 'none';

  // Display name - prefer nickname, fallback to shortened name
  const displayName = character.nickname || character.name.split(' ').slice(0, 2).join(' ');

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: styles.opacity,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      style={{ cursor: 'pointer', filter: glowFilter }}
      onMouseEnter={() => onHover(character.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(character)}
    >
      {/* Outsider indicator (dashed ring) */}
      {isOutsider && (
        <circle
          cx={x}
          cy={y}
          r={42}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1}
          strokeDasharray="4,4"
          opacity={styles.opacity * 0.5}
        />
      )}

      {/* Background circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={32}
        fill="#2D2118"
        stroke={strokeColor}
        strokeWidth={styles.strokeWidth}
        animate={{
          strokeWidth: styles.strokeWidth,
          stroke: strokeColor,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Portrait image */}
      <clipPath id={`clip-${character.id}`}>
        <circle cx={x} cy={y} r={29} />
      </clipPath>
      <motion.image
        href={portrait}
        x={x - 29}
        y={y - 29}
        width={58}
        height={58}
        clipPath={`url(#clip-${character.id})`}
        animate={{ opacity: styles.opacity }}
        transition={{ duration: 0.2 }}
      />

      {/* Name label */}
      <motion.text
        x={x}
        y={y + 48}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="#EEE8D5"
        fontFamily="Lora, serif"
        animate={{ opacity: styles.opacity }}
      >
        {displayName}
      </motion.text>

      {/* Relationship indicator on hover */}
      {highlightState !== 'none' && highlightState !== 'dimmed' && highlightState !== 'hovered' && (
        <motion.text
          x={x}
          y={y + 60}
          textAnchor="middle"
          fontSize={8}
          fill={styles.strokeColor}
          fontFamily="Lora, serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
        >
          {highlightState === 'spouse' && '♥ Spouse'}
          {highlightState === 'parent' && '↑ Parent'}
          {highlightState === 'child' && '↓ Child'}
        </motion.text>
      )}
    </motion.g>
  );
}
