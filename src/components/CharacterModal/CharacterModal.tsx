import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { getCharacterStatus, characters } from '../../data/characters';
import { getPlaceholderPortrait, generatePortrait, isAIGeneratedPortrait } from '../../services/imagen';
import { LivingMemoryChat } from '../LivingMemory';

interface CharacterModalProps {
  character: Character | null;
  currentChapter: number;
  onClose: () => void;
}

export function CharacterModal({ character, currentChapter, onClose }: CharacterModalProps) {
  const [isLivingMemoryMode, setIsLivingMemoryMode] = useState(false);
  const [portrait, setPortrait] = useState<string>('');
  const [isLoadingPortrait, setIsLoadingPortrait] = useState(false);

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
          className={`rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden ${
            isLivingMemoryMode ? 'max-h-[90vh]' : 'max-h-[85vh]'
          }`}
          style={{ backgroundColor: '#FDF6E3' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative p-6 pb-4"
            style={{
              background: isDeceased
                ? 'linear-gradient(135deg, rgba(38, 139, 210, 0.1), #FDF6E3)'
                : 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), #FDF6E3)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: 'rgba(88, 110, 117, 0.1)',
                color: '#586E75',
              }}
            >
              x
            </button>

            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={portrait}
                  alt={character.name}
                  className="w-20 h-20 rounded-full shadow-lg object-cover"
                  style={{
                    border: `3px solid ${isDeceased ? '#268BD280' : '#B5890080'}`,
                    filter: isDeceased ? 'sepia(0.8) grayscale(0.4) blur(0.5px)' : 'sepia(0.5)',
                    opacity: isDeceased ? 0.7 : 1,
                  }}
                />
                {isDeceased && (
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#268BD2' }}
                  >
                    <span className="text-xs">&#128123;</span>
                  </div>
                )}
                {hasAIPortrait && (
                  <div
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#B58900' }}
                    title="AI Generated"
                  >
                    <span className="text-[10px]">&#10024;</span>
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
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  {character.name}
                </h2>
                {character.nickname && (
                  <p
                    className="text-sm italic"
                    style={{ fontFamily: 'Lora, serif', color: '#B58900' }}
                  >
                    "{character.nickname}"
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      backgroundColor: 'rgba(181, 137, 0, 0.15)',
                      color: '#B58900',
                    }}
                  >
                    Gen {character.generation}
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      backgroundColor: isDeceased ? 'rgba(38, 139, 210, 0.15)' : 'rgba(181, 137, 0, 0.15)',
                      color: isDeceased ? '#268BD2' : '#B58900',
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
                <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(108, 113, 196, 0.2)' }}>
                  <button
                    onClick={() => setIsLivingMemoryMode(false)}
                    className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#6C71C4', fontStyle: 'italic' }}
                  >
                    &larr; Back to biography
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <LivingMemoryChat
                    character={character}
                    currentChapter={currentChapter}
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {/* Family relationships */}
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: '1px solid rgba(181, 137, 0, 0.2)' }}
                >
                  <h4
                    className="text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                  >
                    Family Connections
                  </h4>
                  <div
                    className="space-y-1 text-sm"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                  >
                    {parents.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Parents:</span> {parents.map(p => p.name).join(' & ')}</p>
                    )}
                    {spouses.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Spouse:</span> {spouses.map(s => s.name).join(', ')}</p>
                    )}
                    {children.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Children:</span> {children.map(c => c.name).join(', ')}</p>
                    )}
                    {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
                      <p className="italic" style={{ color: '#93A1A1' }}>No known family connections yet</p>
                    )}
                  </div>
                </div>

                {/* Biography */}
                <div className="mb-4">
                  <h4
                    className="text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                  >
                    Biography
                  </h4>

                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                  >
                    {character.biography || character.description}
                  </div>
                </div>

                {/* Chapter note */}
                <div className="pt-4" style={{ borderTop: '1px solid rgba(181, 137, 0, 0.2)' }}>
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
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
                  className="mt-6 w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, rgba(108, 113, 196, 0.2), rgba(42, 161, 152, 0.1))',
                    border: '1px solid rgba(108, 113, 196, 0.3)',
                    color: '#6C71C4',
                    fontFamily: 'Playfair Display, serif',
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
                  className="mt-2 text-center text-xs"
                  style={{ fontFamily: 'Lora, serif', color: '#93A1A1', fontStyle: 'italic' }}
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
