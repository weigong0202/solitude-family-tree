import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { generatePortrait, getPlaceholderPortrait } from '../../services/imagen';

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
  const [portrait, setPortrait] = useState<string>(getPlaceholderPortrait(character));
  const [isLoadingPortrait, setIsLoadingPortrait] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPortrait() {
      setIsLoadingPortrait(true);
      try {
        const generatedPortrait = await generatePortrait(character);
        if (mounted) {
          setPortrait(generatedPortrait);
        }
      } catch (error) {
        console.error('Failed to load portrait:', error);
      } finally {
        if (mounted) {
          setIsLoadingPortrait(false);
        }
      }
    }

    loadPortrait();

    return () => {
      mounted = false;
    };
  }, [character]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden transition-all hover:shadow-lg group"
      style={{
        backgroundColor: isDeceased ? '#F0F5F8' : '#FFFBF5',
        border: `1px solid ${isDeceased ? '#268BD230' : '#B5890030'}`,
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
              border: `3px solid ${isDeceased ? '#268BD2' : '#B58900'}`,
              boxShadow: isDeceased
                ? '0 4px 15px rgba(38, 139, 210, 0.2)'
                : '0 4px 15px rgba(181, 137, 0, 0.2)',
            }}
          >
            {isLoadingPortrait ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: isDeceased ? '#E8F4F8' : '#FDF6E3' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-xl"
                >
                  ✨
                </motion.div>
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
                onError={() => setPortrait(getPlaceholderPortrait(character))}
              />
            )}
          </motion.div>

          {/* Ghost indicator */}
          {isDeceased && (
            <motion.div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#268BD2',
                border: '2px solid #F0F5F8',
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm">👻</span>
            </motion.div>
          )}

          {/* Generation badge */}
          <div
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: isDeceased ? '#268BD2' : '#B58900',
              color: '#FDF6E3',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            {character.generation}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-bold leading-tight truncate group-hover:text-[#B58900] transition-colors"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: isDeceased ? '#268BD2' : '#586E75',
            }}
          >
            {character.name}
          </h3>

          {character.nickname && (
            <p
              className="text-sm italic mt-0.5"
              style={{
                fontFamily: 'Lora, serif',
                color: isDeceased ? '#268BD280' : '#B58900',
              }}
            >
              "{character.nickname}"
            </p>
          )}

          <p
            className="text-xs mt-2 line-clamp-2 leading-relaxed"
            style={{
              fontFamily: 'Lora, serif',
              color: '#657B83',
            }}
          >
            {character.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span
              className="text-[10px] tracking-wider uppercase"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#93A1A1',
              }}
            >
              {isDeceased ? 'Rest in Peace' : `Gen ${character.generation}`}
            </span>
            <span
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                fontFamily: 'Lora, serif',
                color: '#B58900',
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
