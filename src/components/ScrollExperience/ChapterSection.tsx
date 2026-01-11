import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ChapterData } from '../../data/chapters';
import type { Character } from '../../types';
import { getCharacterStatus } from '../../data/characters';
import { MagicalRealistCard } from '../CharacterCard';

interface ChapterSectionProps {
  chapter: ChapterData;
  characters: Character[];
  onCharacterClick: (character: Character) => void;
}

const moodColors = {
  hopeful: { bg: 'bg-amber-50', accent: '#B58900', border: 'border-amber-200' },
  turbulent: { bg: 'bg-red-50', accent: '#DC322F', border: 'border-red-200' },
  magical: { bg: 'bg-blue-50', accent: '#268BD2', border: 'border-blue-200' },
  melancholic: { bg: 'bg-gray-50', accent: '#657B83', border: 'border-gray-200' },
  apocalyptic: { bg: 'bg-purple-50', accent: '#6C71C4', border: 'border-purple-200' },
};

export function ChapterSection({ chapter, characters, onCharacterClick }: ChapterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const mood = moodColors[chapter.mood];

  // Progressive decay effect based on chapter number
  const decayLevel = Math.min(chapter.number / 20, 1);
  const sepiaAmount = 0.3 + decayLevel * 0.4;
  const blurAmount = decayLevel * 0.5;

  // Get newly introduced characters
  const newCharacters = characters.filter(
    c => chapter.charactersIntroduced.includes(c.id)
  );

  // Get characters who died
  const diedCharacters = characters.filter(
    c => chapter.charactersDied.includes(c.id)
  );

  return (
    <section
      ref={sectionRef}
      id={`chapter-${chapter.number}`}
      className={`min-h-screen py-20 px-4 md:px-8 ${mood.bg}`}
      style={{
        filter: `sepia(${sepiaAmount * 0.1})`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Chapter number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{
              backgroundColor: `${mood.accent}20`,
              border: `2px solid ${mood.accent}`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: mood.accent,
              }}
            >
              {chapter.number}
            </span>
          </motion.div>

          {/* Era */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#657B83',
              fontStyle: 'italic',
            }}
          >
            {chapter.era}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, filter: `blur(10px) sepia(${sepiaAmount})` }}
            animate={isInView ? { opacity: 1, filter: `blur(${blurAmount}px) sepia(${sepiaAmount * 0.3})` } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#586E75',
            }}
          >
            {chapter.title}
          </motion.h2>

          {/* Opening quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg italic border-l-4 pl-6 text-left"
            style={{
              fontFamily: 'Lora, serif',
              color: '#657B83',
              borderColor: mood.accent,
            }}
          >
            "{chapter.quote}"
            {chapter.quoteAttribution && (
              <footer
                className="mt-2 text-sm not-italic"
                style={{ color: '#93A1A1' }}
              >
                — {chapter.quoteAttribution}
              </footer>
            )}
          </motion.blockquote>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <p
            className="text-lg leading-relaxed text-center"
            style={{
              fontFamily: 'Lora, serif',
              color: '#586E75',
            }}
          >
            {chapter.summary}
          </p>
        </motion.div>

        {/* Key Events */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h3
            className="text-xs tracking-[0.2em] uppercase mb-4 text-center"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: mood.accent,
              fontStyle: 'italic',
            }}
          >
            Key Events
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {chapter.keyEvents.map((event, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                className="px-3 py-1 text-sm rounded-full"
                style={{
                  fontFamily: 'Lora, serif',
                  backgroundColor: `${mood.accent}15`,
                  color: '#B58900',
                  border: `1px solid ${mood.accent}30`,
                }}
              >
                {event}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Newly Introduced Characters */}
        {newCharacters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-12"
          >
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-6 text-center"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#B58900',
                fontStyle: 'italic',
              }}
            >
              Characters Introduced
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {newCharacters.map((character, i) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 30, filter: 'sepia(1) blur(4px)' }}
                  animate={isInView ? { opacity: 1, y: 0, filter: `sepia(${sepiaAmount}) blur(0px)` } : {}}
                  transition={{ delay: 1.3 + i * 0.15, duration: 0.5 }}
                >
                  <MagicalRealistCard
                    character={character}
                    status={getCharacterStatus(character, chapter.number)}
                    onClick={onCharacterClick}
                    delay={0}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Deaths in this chapter */}
        {diedCharacters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mb-12"
          >
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-6 text-center"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#268BD2',
                fontStyle: 'italic',
              }}
            >
              Departed This Chapter
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {diedCharacters.map((character, i) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 0.6, y: 0 } : {}}
                  transition={{ delay: 1.6 + i * 0.15, duration: 0.5 }}
                  style={{ filter: 'sepia(0.8) blur(1px)' }}
                  className="ghostly"
                >
                  <MagicalRealistCard
                    character={{ ...character, isGhost: true }}
                    status="deceased"
                    onClick={onCharacterClick}
                    delay={0}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Themes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center pt-8 border-t border-amber-200/50"
        >
          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#93A1A1',
              fontStyle: 'italic',
            }}
          >
            Themes: {chapter.themes.join(' • ')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
