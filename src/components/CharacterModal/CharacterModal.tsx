import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { getCharacterStatus, characters } from '../../data/characters';
import { getPlaceholderPortrait, generatePortrait, isAIGeneratedPortrait } from '../../services/imagen';
import { LivingMemoryChat } from '../LivingMemory';
import { colors, fonts } from '../../constants/theme';

interface CharacterModalProps {
  character: Character | null;
  currentChapter: number;
  onClose: () => void;
}

export function CharacterModal({ character, currentChapter, onClose }: CharacterModalProps) {
  const [isLivingMemoryMode, setIsLivingMemoryMode] = useState(false);
  const [portrait, setPortrait] = useState<string>('');
  const [isLoadingPortrait, setIsLoadingPortrait] = useState(false);

  // Handle Escape key to close modal
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (character) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [character, handleEscapeKey]);

  // Load portrait from cache or generate new one (same as BookCharacterCard)
  useEffect(() => {
    if (character) {
      setIsLivingMemoryMode(false);
      setPortrait(getPlaceholderPortrait(character));

      // Load the same portrait as the preview card
      let mounted = true;
      setIsLoadingPortrait(true);

      generatePortrait(character)
        .then((generatedPortrait) => {
          if (mounted) {
            setPortrait(generatedPortrait);
          }
        })
        .catch((error) => {
          console.error('Failed to load portrait:', error);
        })
        .finally(() => {
          if (mounted) {
            setIsLoadingPortrait(false);
          }
        });

      return () => {
        mounted = false;
      };
    } else {
      setPortrait('');
    }
  }, [character]);

  if (!character) return null;

  const status = getCharacterStatus(character, currentChapter);
  const isDeceased = status === 'deceased';
  const hasAIPortrait = isAIGeneratedPortrait(portrait);

  const parents = characters.filter(c => character.parentIds.includes(c.id));
  const spouses = characters.filter(c => character.spouseIds.includes(c.id));
  const children = characters.filter(c => c.parentIds.includes(character.id) && c.birthChapter <= currentChapter);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden"
          style={{ backgroundColor: colors.cream }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative p-6 pb-4"
            style={{
              background: isDeceased
                ? `linear-gradient(135deg, ${colors.withAlpha(colors.blue, 0.1)}, ${colors.cream})`
                : `linear-gradient(135deg, ${colors.withAlpha(colors.gold, 0.1)}, ${colors.cream})`,
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: colors.withAlpha(colors.text, 0.1),
                color: colors.text,
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={portrait}
                  alt={character.name}
                  className="w-20 h-20 rounded-full shadow-lg object-cover"
                  style={{
                    border: `3px solid ${colors.withAlpha(isDeceased ? colors.blue : colors.gold, 0.5)}`,
                    filter: isDeceased ? 'sepia(0.8) grayscale(0.4) blur(0.5px)' : 'sepia(0.5)',
                    opacity: isDeceased ? 0.7 : 1,
                  }}
                />
                {hasAIPortrait && (
                  <div
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.gold }}
                    role="img"
                    aria-label="AI Generated portrait"
                    title="AI Generated"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" />
                    </svg>
                  </div>
                )}
                {isLoadingPortrait && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl font-bold truncate"
                  style={{ fontFamily: fonts.heading, color: colors.text }}
                >
                  {character.name}
                </h2>
                {character.nickname && (
                  <p
                    className="text-sm italic"
                    style={{ fontFamily: fonts.body, color: colors.gold }}
                  >
                    "{character.nickname}"
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: fonts.accent,
                      fontStyle: 'italic',
                      backgroundColor: colors.withAlpha(colors.gold, 0.15),
                      color: colors.gold,
                    }}
                  >
                    Gen {character.generation}
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: fonts.accent,
                      fontStyle: 'italic',
                      backgroundColor: colors.withAlpha(isDeceased ? colors.blue : colors.gold, 0.15),
                      color: isDeceased ? colors.blue : colors.gold,
                    }}
                  >
                    {isDeceased ? 'Departed' : status === 'alive_aged' ? 'Elder' : 'Living'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col" style={{ height: isLivingMemoryMode ? 'calc(90vh - 140px)' : 'auto' }}>
            {isLivingMemoryMode ? (
              /* Living Memory Chat Mode */
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-2" style={{ borderBottom: `1px solid ${colors.withAlpha(colors.purple, 0.2)}` }}>
                  <button
                    onClick={() => setIsLivingMemoryMode(false)}
                    className="text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: fonts.accent, color: colors.purple, fontStyle: 'italic' }}
                  >
                    &larr; Back to biography
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <LivingMemoryChat character={character} currentChapter={currentChapter} />
                </div>
              </div>
            ) : (
              <div className="p-5 overflow-y-auto max-h-[80vh]">
                {/* Family relationships */}
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: `1px solid ${colors.withAlpha(colors.gold, 0.2)}` }}
                >
                  <h4
                    className="text-sm tracking-widest uppercase mb-2"
                    style={{ fontFamily: fonts.accent, color: colors.text, fontStyle: 'italic' }}
                  >
                    Family Connections
                  </h4>
                  <div
                    className="space-y-1 text-sm"
                    style={{ fontFamily: fonts.body, color: colors.text }}
                  >
                    {parents.length > 0 && (
                      <p><span style={{ color: colors.text }}>Parents:</span> {parents.map(p => p.name).join(' & ')}</p>
                    )}
                    {spouses.length > 0 && (
                      <p><span style={{ color: colors.text }}>Spouse:</span> {spouses.map(s => s.name).join(', ')}</p>
                    )}
                    {children.length > 0 && (
                      <p><span style={{ color: colors.text }}>Children:</span> {children.map(c => c.name).join(', ')}</p>
                    )}
                    {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
                      <p className="italic" style={{ color: colors.text }}>No known family connections yet</p>
                    )}
                  </div>
                </div>

                {/* Biography - Show first paragraph, max 400 chars */}
                <div className="mb-4">
                  <h4
                    className="text-sm tracking-widest uppercase mb-2"
                    style={{ fontFamily: fonts.accent, color: colors.text, fontStyle: 'italic' }}
                  >
                    Biography
                  </h4>

                  <div
                    className="text-sm leading-relaxed space-y-3"
                    style={{ fontFamily: fonts.body, color: colors.text }}
                  >
                    {(() => {
                      const fullBio = character.biography || character.description;
                      // Truncate to ~1000 chars if longer
                      let bio = fullBio;
                      if (fullBio.length > 1000) {
                        const truncateAt = fullBio.slice(0, 1000).lastIndexOf('. ');
                        bio = truncateAt > 500
                          ? fullBio.slice(0, truncateAt + 1)
                          : fullBio.slice(0, 1000).trim() + '...';
                      }
                      // Split into paragraphs
                      const paragraphs = bio.split('\n\n').filter(p => p.trim());
                      return paragraphs.map((p, i) => <p key={i}>{p}</p>);
                    })()}
                  </div>
                </div>

                {/* Chapter note */}
                <div className="pt-3" style={{ borderTop: `1px solid ${colors.withAlpha(colors.gold, 0.2)}` }}>
                  <p
                    className="text-sm"
                    style={{ fontFamily: fonts.accent, color: colors.text, fontStyle: 'italic' }}
                  >
                    First appears in Chapter {character.birthChapter}
                    {character.deathChapter && character.deathChapter <= currentChapter && (
                      <> - Departed in Chapter {character.deathChapter}</>
                    )}
                  </p>
                </div>

                {/* Living Memory - Available for all characters */}
                <motion.button
                  onClick={() => setIsLivingMemoryMode(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.withAlpha(colors.purple, 0.2)}, ${colors.withAlpha(colors.teal, 0.1)})`,
                    border: `1px solid ${colors.withAlpha(colors.purple, 0.3)}`,
                    color: colors.purple,
                    fontFamily: fonts.heading,
                  }}
                >
                  <span className="text-lg">🦋</span>
                  <span>
                    {isDeceased
                      ? `Speak with ${character.name.split(' ')[0]}'s Spirit`
                      : `Converse with ${character.name.split(' ')[0]}`}
                  </span>
                </motion.button>
                <p
                  className="mt-2 text-center text-sm"
                  style={{ fontFamily: fonts.body, color: colors.text, fontStyle: 'italic' }}
                >
                  Living Memory - They will remember you
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
