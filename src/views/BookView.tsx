import { motion } from 'framer-motion';
import { BookPageFlip } from '../components/BookPageFlip';
import { BookCharacterCard } from '../components/BookCharacterCard';
import { characters } from '../data/characters';
import { chaptersData } from '../data/chapters';
import type { Character } from '../types';
import { colors, fonts, gradients, borders } from '../constants/theme';

type ViewMode = 'intro' | 'book' | 'familyTree' | 'visions';

interface BookViewProps {
  currentChapter: number;
  readingProgress: number;
  onChapterChange: (chapter: number) => void;
  onMarkAsRead: (chapter: number) => void;
  onCharacterClick: (character: Character) => void;
  onNavigate: (view: ViewMode) => void;
}

// Mood colors for chapter theming
const moodColors: Record<string, string> = {
  hopeful: colors.gold,
  turbulent: colors.red,
  magical: colors.blue,
  melancholic: colors.textSecondary,
  apocalyptic: colors.purple,
};

export function BookView({
  currentChapter,
  readingProgress,
  onChapterChange,
  onMarkAsRead,
  onCharacterClick,
  onNavigate,
}: BookViewProps) {
  const canMarkAsRead = currentChapter > readingProgress;
  return (
    <motion.div
      key="book"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
      style={{ background: gradients.darkRadial }}
    >
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6 relative z-10">
        <button
          onClick={() => onNavigate('intro')}
          className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.textMuted, border: borders.subtle }}
        >
          ← Title
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('familyTree')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ fontFamily: fonts.body, color: colors.teal, border: borders.teal }}
          >
            <span>🌳</span>
            <span className="hidden md:inline">Family Tree</span>
          </button>
          <button
            onClick={() => onNavigate('visions')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ fontFamily: fonts.body, color: colors.purple, border: borders.purple }}
          >
            <span>🎨</span>
            <span className="hidden md:inline">Visions</span>
          </button>
        </div>
      </div>

      {/* Book Content with Page Flip */}
      <div className="flex-1 flex items-center justify-center px-4 relative" style={{ marginTop: '-80px' }}>
        {/* Chapter Navigation Dots - positioned above the book */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(50% - 330px)' }}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center gap-1">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => onChapterChange(num)}
                  className="w-2 h-2 rounded-full transition-all hover:scale-150"
                  style={{
                    backgroundColor: num === currentChapter
                      ? colors.gold
                      : num <= readingProgress
                        ? colors.teal
                        : colors.backgroundBrown,
                    boxShadow: num === currentChapter ? `0 0 8px ${colors.gold}` : 'none',
                  }}
                  title={`Chapter ${num}${num <= readingProgress ? ' (read)' : ''}`}
                />
              ))}
            </div>
            {/* Reading Progress Indicator and Mark as Read Button */}
            <div className="flex items-center gap-3 text-xs" style={{ color: colors.textMuted }}>
              <span style={{ fontFamily: fonts.body }}>
                Progress: Ch. {readingProgress} of 20
              </span>
              {canMarkAsRead && (
                <button
                  onClick={() => onMarkAsRead(currentChapter)}
                  className="px-2 py-1 rounded transition-colors hover:bg-white/10"
                  style={{
                    fontFamily: fonts.body,
                    color: colors.teal,
                    border: `1px solid ${colors.teal}40`,
                  }}
                >
                  Mark Ch. {currentChapter} as read
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl flex justify-center">
          {/* Book Page Flip Component */}
          <BookPageFlip
            currentPage={currentChapter}
            totalPages={20}
            onPageChange={onChapterChange}
            pages={chaptersData.map((chapterData) => {
              const chapterNum = chapterData.number;
              const introduced = characters.filter(c =>
                chapterData.charactersIntroduced.includes(c.id)
              );
              const died = characters.filter(c =>
                chapterData.charactersDied.includes(c.id)
              );
              const chapterMood = chapterData.mood || 'hopeful';
              const moodColor = moodColors[chapterMood];

              return {
                leftContent: (
                  <>
                    {/* Chapter Number */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: colors.withAlpha(moodColor, 0.2),
                          border: `2px solid ${moodColor}`,
                        }}
                      >
                        <span
                          className="text-xl font-bold"
                          style={{ fontFamily: fonts.heading, color: moodColor }}
                        >
                          {chapterNum}
                        </span>
                      </div>
                      <div>
                        <p
                          className="text-xs tracking-[0.15em] uppercase"
                          style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                        >
                          {chapterData.era}
                        </p>
                        <h2
                          className="text-2xl md:text-3xl font-bold"
                          style={{ fontFamily: fonts.heading, color: colors.text }}
                        >
                          {chapterData.title}
                        </h2>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote
                      className="text-base md:text-lg italic border-l-4 pl-4 mb-6"
                      style={{
                        fontFamily: fonts.body,
                        color: colors.textSecondary,
                        borderColor: moodColor,
                      }}
                    >
                      "{chapterData.quote}"
                      {chapterData.quoteAttribution && (
                        <footer className="mt-2 text-sm not-italic" style={{ color: colors.textMuted }}>
                          — {chapterData.quoteAttribution}
                        </footer>
                      )}
                    </blockquote>

                    {/* Summary */}
                    <p
                      className="text-sm md:text-base leading-relaxed mb-6"
                      style={{ fontFamily: fonts.body, color: colors.text }}
                    >
                      {chapterData.summary}
                    </p>

                    {/* Key Events */}
                    <div className="mb-6">
                      <h3
                        className="text-xs tracking-[0.15em] uppercase mb-3"
                        style={{ fontFamily: fonts.accent, color: moodColor }}
                      >
                        Key Events
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {chapterData.keyEvents.map((event, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              fontFamily: fonts.body,
                              backgroundColor: colors.withAlpha(moodColor, 0.15),
                              color: colors.text,
                              border: `1px solid ${colors.withAlpha(moodColor, 0.3)}`,
                            }}
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Themes */}
                    <p
                      className="text-xs"
                      style={{ fontFamily: fonts.accent, color: colors.textMuted, fontStyle: 'italic' }}
                    >
                      Themes: {chapterData.themes.join(' · ')}
                    </p>
                  </>
                ),
                rightContent: (
                  <div className="h-full flex flex-col relative">
                    {/* Scrollable content area */}
                    <div
                      className="flex-1 overflow-y-auto overflow-x-hidden pb-8"
                      style={{ scrollbarWidth: 'thin', scrollbarColor: `${colors.withAlpha(colors.gold, 0.25)} transparent` }}
                    >
                      {/* Characters Introduced */}
                      {introduced.length > 0 && (
                        <div className="mb-6">
                          <h3
                            className="text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                            style={{ fontFamily: fonts.accent, color: colors.gold }}
                          >
                            <span className="w-8 h-px" style={{ backgroundColor: colors.gold }} />
                            Characters Introduced
                            <span className="w-8 h-px" style={{ backgroundColor: colors.gold }} />
                          </h3>
                          <div className="space-y-4">
                            {introduced.map((char, index) => (
                              <BookCharacterCard
                                key={char.id}
                                character={char}
                                isDeceased={false}
                                onClick={() => onCharacterClick(char)}
                                delay={index * 0.1}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Characters Who Died */}
                      {died.length > 0 && (
                        <div className="mb-6">
                          <h3
                            className="text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                            style={{ fontFamily: fonts.accent, color: colors.blue }}
                          >
                            <span className="w-8 h-px" style={{ backgroundColor: colors.blue }} />
                            Departed This Chapter
                            <span className="w-8 h-px" style={{ backgroundColor: colors.blue }} />
                          </h3>
                          <div className="space-y-4">
                            {died.map((char, index) => (
                              <BookCharacterCard
                                key={char.id}
                                character={char}
                                isDeceased={true}
                                onClick={() => onCharacterClick(char)}
                                delay={index * 0.1 + 0.3}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No characters message */}
                      {introduced.length === 0 && died.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-12">
                          <div className="text-4xl mb-4 opacity-30">📖</div>
                          <p
                            className="text-center italic text-lg mb-2"
                            style={{ fontFamily: fonts.body, color: colors.textMuted }}
                          >
                            The story continues...
                          </p>
                          <p
                            className="text-center text-sm"
                            style={{ fontFamily: fonts.body, color: colors.withAlpha(colors.gold, 0.5) }}
                          >
                            No new characters appear in this chapter
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Fixed page number at bottom */}
                    <div
                      className="absolute bottom-0 right-0 py-1 px-2"
                      style={{
                        background: 'linear-gradient(to top, #F8F2E4 0%, #F8F2E4 60%, transparent 100%)',
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                      >
                        {chapterNum} / 20
                      </span>
                    </div>
                  </div>
                ),
              };
            })}
          />
        </div>
      </div>
    </motion.div>
  );
}
