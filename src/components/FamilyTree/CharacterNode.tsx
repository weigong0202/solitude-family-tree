import { motion } from 'framer-motion';
import type { Character, CharacterStatus } from '../../types';
import { getPlaceholderPortrait } from '../../services/imagen';

interface CharacterNodeProps {
  character: Character;
  status: CharacterStatus;
  x: number;
  y: number;
  onClick: (character: Character) => void;
}

const statusStyles: Record<CharacterStatus, { opacity: number; filter: string; ring: string }> = {
  not_born: { opacity: 0, filter: 'none', ring: 'ring-0' },
  alive_young: { opacity: 1, filter: 'none', ring: 'ring-2 ring-amber-400' },
  alive_aged: { opacity: 0.85, filter: 'sepia(30%)', ring: 'ring-2 ring-amber-600' },
  deceased: { opacity: 0.5, filter: 'grayscale(100%)', ring: 'ring-1 ring-gray-400' },
};

export function CharacterNode({ character, status, x, y, onClick }: CharacterNodeProps) {
  if (status === 'not_born') return null;

  const styles = statusStyles[status];
  const portrait = getPlaceholderPortrait(character);

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
        fill={status === 'deceased' ? '#9ca3af' : '#d2bab0'}
        stroke={status === 'deceased' ? '#6b7280' : '#a18072'}
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
          fill="#6b7280"
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
        fill={status === 'deceased' ? '#6b7280' : '#43302b'}
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
        fill={status === 'deceased' ? '#9ca3af' : '#a18072'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
      >
        Gen {character.generation}
      </motion.text>
    </motion.g>
  );
}
