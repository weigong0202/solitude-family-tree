import { motion } from 'framer-motion';
import type { Character, CharacterStatus } from '../../types';
import { getPlaceholderPortrait } from '../../services/imagen';

interface MagicalRealistCardProps {
  character: Character;
  status: CharacterStatus;
  onClick?: (character: Character) => void;
  delay?: number;
}

export function MagicalRealistCard({
  character,
  status,
  onClick,
  delay = 0,
}: MagicalRealistCardProps) {
  const isGhost = character.isGhost || status === 'deceased';
  const portrait = getPlaceholderPortrait(character);

  const cardVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(8px) sepia(1)',
      scale: 0.95,
    },
    visible: {
      opacity: isGhost ? 0.5 : 1,
      filter: isGhost ? 'blur(0.5px) sepia(0.6)' : 'blur(0px) sepia(0.3)',
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const statusLabels: Record<CharacterStatus, string> = {
    not_born: 'Not Yet Born',
    alive_young: 'Living',
    alive_aged: 'Elder',
    deceased: 'Departed',
  };

  if (status === 'not_born') return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.05,
        filter: 'sepia(0.1) blur(0px)',
        transition: { duration: 0.3 },
      }}
      onClick={() => onClick?.(character)}
      className="relative cursor-pointer rounded-md overflow-hidden max-w-xs w-full"
      style={{
        backgroundColor: '#FDF6E3',
        border: `1px solid ${isGhost ? '#268BD220' : '#B5890030'}`,
        boxShadow: isGhost
          ? '0 4px 20px rgba(38, 139, 210, 0.15)'
          : '0 4px 20px rgba(181, 137, 0, 0.15)',
      }}
    >
      {/* Top accent line */}
      <div
        className="h-1 w-full"
        style={{
          background: isGhost
            ? 'linear-gradient(90deg, transparent, #268BD2, transparent)'
            : 'linear-gradient(90deg, transparent, #B58900, transparent)',
        }}
      />

      <div className="p-4">
        {/* Portrait and name */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
          >
            <img
              src={portrait}
              alt={character.name}
              className="w-14 h-14 rounded-full object-cover"
              style={{
                border: `2px solid ${isGhost ? '#268BD280' : '#B5890080'}`,
                filter: `sepia(0.7) ${isGhost ? 'blur(1px) grayscale(0.3)' : ''}`,
              }}
            />
            {isGhost && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#268BD2CC' }}
              >
                <span className="text-[10px]">&#128123;</span>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold leading-tight truncate"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: '#586E75',
              }}
            >
              {character.name}
            </h3>

            {character.nickname && (
              <p
                className="text-xs italic mt-0.5"
                style={{ color: '#B58900' }}
              >
                "{character.nickname}"
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 gap-1 mb-2 text-xs"
          style={{
            fontFamily: 'Lora, serif',
            color: '#657B83',
          }}
        >
          <div className="flex items-center gap-1">
            <span style={{ color: '#B58900' }}>GEN</span>
            <span>{character.generation}</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ color: '#B58900' }}>CH</span>
            <span>{character.birthChapter}</span>
            {character.deathChapter && (
              <>
                <span>-</span>
                <span>{character.deathChapter}</span>
              </>
            )}
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <span style={{ color: '#B58900' }}>STATUS</span>
            <span style={{ color: isGhost ? '#268BD2' : 'inherit' }}>
              {statusLabels[status]}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-2 line-clamp-3"
          style={{
            fontFamily: 'Lora, serif',
            color: '#586E75',
          }}
        >
          {character.description}
        </p>

        {/* Quote */}
        {character.quote && (
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5, duration: 0.5 }}
            className="text-xs italic border-l-2 pl-3 mt-2"
            style={{
              fontFamily: 'Lora, serif',
              color: '#93A1A1',
              borderColor: '#B5890050',
            }}
          >
            "{character.quote}"
          </motion.blockquote>
        )}

        {/* Footer */}
        <div
          className="mt-3 pt-2 text-center text-xs"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: '#93A1A1',
            fontStyle: 'italic',
            borderTop: '1px solid #B5890020',
          }}
        >
          {isGhost ? 'Speak with the dead' : 'Click to explore'}
        </div>
      </div>

      {/* Corner glow effects */}
      <div
        className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${isGhost ? '#268BD2' : '#B58900'} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-8 h-8 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at bottom left, ${isGhost ? '#268BD2' : '#B58900'} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
