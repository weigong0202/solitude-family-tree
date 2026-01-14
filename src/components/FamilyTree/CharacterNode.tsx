import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { getPortrait, getPlaceholderPortrait } from '../../services/imagen';
import { colors, fonts } from '../../constants/theme';

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

// Generation-based colors for visual distinction using theme
const generationColors: Record<number, string> = {
  1: colors.gold,    // Gold - founders
  2: colors.teal,    // Teal
  3: colors.blue,    // Blue
  4: colors.purple,  // Purple
  5: '#D33682',      // Magenta (not in theme)
  6: colors.orange,  // Orange
  7: colors.red,     // Red - final generation
};

// Highlight state styles using theme colors
const highlightStyles: Record<HighlightState, {
  opacity: number;
  strokeColor?: string;
  strokeWidth: number;
  glowColor?: string;
}> = {
  none: { opacity: 1, strokeWidth: 3 },
  hovered: { opacity: 1, strokeColor: colors.cream, strokeWidth: 4, glowColor: colors.cream },
  spouse: { opacity: 1, strokeColor: colors.gold, strokeWidth: 4, glowColor: colors.gold },
  parent: { opacity: 1, strokeColor: colors.teal, strokeWidth: 4, glowColor: colors.teal },
  child: { opacity: 1, strokeColor: colors.blue, strokeWidth: 4, glowColor: colors.blue },
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
      onKeyDown={(e) => e.key === 'Enter' && onClick(character)}
      role="button"
      tabIndex={0}
      aria-label={`View ${character.name}'s details`}
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
        fill={colors.background}
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
        fill={colors.creamLight}
        fontFamily={fonts.body}
        animate={{ opacity: styles.opacity }}
      >
        {displayName}
      </motion.text>

      {/* Relationship indicator on hover */}
      {highlightState !== 'none' && highlightState !== 'dimmed' && highlightState !== 'hovered' && (
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background badge */}
          <rect
            x={x - 32}
            y={y + 52}
            width={64}
            height={18}
            rx={9}
            fill={styles.strokeColor}
            fillOpacity={0.9}
          />
          {/* Text label */}
          <text
            x={x}
            y={y + 64}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={colors.backgroundDark}
            fontFamily={fonts.body}
          >
            {highlightState === 'spouse' && '♥ Spouse'}
            {highlightState === 'parent' && '↑ Parent'}
            {highlightState === 'child' && '↓ Child'}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
}
