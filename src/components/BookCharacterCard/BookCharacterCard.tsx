import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { useCharacterPortrait } from '../../hooks/useCharacterPortrait';
import { colors, fonts } from '../../constants/theme';

interface BookCharacterCardProps {
  character: Character;
  isDeceased?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function BookCharacterCard({
  character,
  isDeceased = false,
  onClick,
  delay = 0,
}: BookCharacterCardProps) {
  const { portrait, isLoading: isLoadingPortrait } = useCharacterPortrait(character);

  // Derive colors based on deceased status
  const accentColor = isDeceased ? colors.blue : colors.gold;
  const cardBg = isDeceased ? '#F0F5F8' : '#FFFBF5';
  const loadingBg = isDeceased ? '#E8F4F8' : colors.cream;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden transition-all hover:shadow-lg group"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${colors.withAlpha(accentColor, 0.2)}`,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex gap-4 p-4">
        {/* Portrait */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="w-20 h-20 rounded-lg overflow-hidden"
            style={{
              border: `3px solid ${accentColor}`,
              boxShadow: `0 4px 15px ${colors.withAlpha(accentColor, 0.2)}`,
            }}
          >
            {isLoadingPortrait ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: loadingBg }}
              >
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: 'transparent' }} />
              </div>
            ) : (
              <img
                src={portrait}
                alt={character.name}
                className="w-full h-full object-cover"
                style={{
                  filter: isDeceased
                    ? 'grayscale(0.3) sepia(0.2) brightness(0.9)'
                    : 'sepia(0.15)',
                }}
              />
            )}
          </motion.div>

          {/* Generation badge */}
          <div
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: accentColor,
              color: colors.cream,
              fontFamily: fonts.heading,
            }}
          >
            {character.generation}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-bold leading-tight truncate transition-colors group-hover:text-[${colors.gold}]`}
            style={{
              fontFamily: fonts.heading,
              color: isDeceased ? colors.blue : colors.text,
            }}
          >
            {character.name}
          </h3>

          {character.nickname && (
            <p
              className="text-sm italic mt-0.5"
              style={{
                fontFamily: fonts.body,
                color: isDeceased ? colors.withAlpha(colors.blue, 0.5) : colors.gold,
              }}
            >
              "{character.nickname}"
            </p>
          )}

          <p
            className="text-xs mt-2 line-clamp-2 leading-relaxed"
            style={{
              fontFamily: fonts.body,
              color: colors.textSecondary,
            }}
          >
            {character.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span
              className="text-[10px] tracking-wider uppercase flex items-center gap-1"
              style={{
                fontFamily: fonts.accent,
                color: colors.textMuted,
              }}
            >
              <span className="text-sm">{isDeceased ? '🥀' : '🌸'}</span>
              {isDeceased ? `Gen ${character.generation} • Rest in Peace` : `Gen ${character.generation}`}
            </span>
            <span
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                fontFamily: fonts.body,
                color: colors.gold,
              }}
            >
              Click to explore →
            </span>
          </div>
        </div>
      </div>

    </motion.button>
  );
}
