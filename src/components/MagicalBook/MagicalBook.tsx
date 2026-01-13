import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { chaptersData } from '../../data/chapters';
import { characters } from '../../data/characters';
import { colors, fonts } from '../../constants/theme';
import { BookCharacterCard } from '../BookCharacterCard';
import type { Character } from '../../types';
import './MagicalBook.css';

type ViewMode = 'intro' | 'magicalBook' | 'book' | 'familyTree' | 'visions';

interface MagicalBookProps {
  onBack: () => void;
  onCharacterClick: (character: Character) => void;
  onNavigate: (view: ViewMode) => void;
}

// Book states - simplified
type BookState = 'closed' | 'open';

// Mood colors for chapter theming
const moodColors: Record<string, string> = {
  hopeful: '#B58900',
  turbulent: '#DC322F',
  magical: '#268BD2',
  melancholic: '#657B83',
  apocalyptic: '#6C71C4',
};

// Page component for react-pageflip
import { forwardRef, type ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  className?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

Page.displayName = 'Page';

// Era definitions for TOC groupings
const tocEras = {
  founders: { title: 'The Founders', date: '1820s–1870s', chapters: [1, 2, 3, 4, 5, 6] },
  wars: { title: 'The Wars', date: '1880s–1900s', chapters: [7, 8, 9] },
  banana: { title: 'The Banana Company', date: '1910s–1928', chapters: [10, 11, 12, 13, 14, 15] },
  reckoning: { title: 'The Reckoning', date: '1932–1970', chapters: [16, 17, 18, 19, 20] },
};

// TOC Left Page Content
function TOCLeftContent({ onChapterClick }: { onChapterClick: (chapter: number) => void }) {
  const foundersChapters = chaptersData.filter(c => tocEras.founders.chapters.includes(c.number));
  const warsChapters = chaptersData.filter(c => tocEras.wars.chapters.includes(c.number));

  return (
    <div className="toc-page-inner">
      <h2 className="toc-chronicle-title">
        <span className="toc-title-ornament">✦</span>
        The Chronicle of Macondo
        <span className="toc-title-ornament">✦</span>
      </h2>

      {/* The Founders Era */}
      <div className="toc-era-section">
        <div className="toc-era-header">
          <span className="toc-era-name">{tocEras.founders.title}</span>
          <span className="toc-era-date">{tocEras.founders.date}</span>
        </div>
        <div className="toc-era-chapters">
          {foundersChapters.map((chapter) => (
            <button
              key={chapter.number}
              className="toc-chapter-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChapterClick(chapter.number);
              }}
            >
              <span
                className="toc-mood-dot"
                style={{ backgroundColor: moodColors[chapter.mood] }}
              />
              <span className="toc-chapter-num">{chapter.number}</span>
              <span className="toc-chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toc-section-divider">❧</div>

      {/* The Wars Era */}
      <div className="toc-era-section">
        <div className="toc-era-header">
          <span className="toc-era-name">{tocEras.wars.title}</span>
          <span className="toc-era-date">{tocEras.wars.date}</span>
        </div>
        <div className="toc-era-chapters">
          {warsChapters.map((chapter) => (
            <button
              key={chapter.number}
              className="toc-chapter-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChapterClick(chapter.number);
              }}
            >
              <span
                className="toc-mood-dot"
                style={{ backgroundColor: moodColors[chapter.mood] }}
              />
              <span className="toc-chapter-num">{chapter.number}</span>
              <span className="toc-chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// TOC Right Page Content
function TOCRightContent({ onChapterClick }: { onChapterClick: (chapter: number) => void }) {
  const bananaChapters = chaptersData.filter(c => tocEras.banana.chapters.includes(c.number));
  const reckoningChapters = chaptersData.filter(c => tocEras.reckoning.chapters.includes(c.number));

  return (
    <div className="toc-page-inner">
      {/* The Banana Company Era */}
      <div className="toc-era-section">
        <div className="toc-era-header">
          <span className="toc-era-name">{tocEras.banana.title}</span>
          <span className="toc-era-date">{tocEras.banana.date}</span>
        </div>
        <div className="toc-era-chapters">
          {bananaChapters.map((chapter) => (
            <button
              key={chapter.number}
              className="toc-chapter-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChapterClick(chapter.number);
              }}
            >
              <span
                className="toc-mood-dot"
                style={{ backgroundColor: moodColors[chapter.mood] }}
              />
              <span className="toc-chapter-num">{chapter.number}</span>
              <span className="toc-chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toc-section-divider">❧</div>

      {/* The Reckoning Era */}
      <div className="toc-era-section">
        <div className="toc-era-header">
          <span className="toc-era-name">{tocEras.reckoning.title}</span>
          <span className="toc-era-date">{tocEras.reckoning.date}</span>
        </div>
        <div className="toc-era-chapters">
          {reckoningChapters.map((chapter) => (
            <button
              key={chapter.number}
              className="toc-chapter-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChapterClick(chapter.number);
              }}
            >
              <span
                className="toc-mood-dot"
                style={{ backgroundColor: moodColors[chapter.mood] }}
              />
              <span className="toc-chapter-num">{chapter.number}</span>
              <span className="toc-chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toc-footer">
        <div className="toc-footer-ornament">✦ ✦ ✦</div>
        <p className="toc-quote">
          "Many years later, as he faced the firing squad..."
        </p>
      </div>
    </div>
  );
}

export function MagicalBook({ onBack, onCharacterClick, onNavigate }: MagicalBookProps) {
  const [bookState, setBookState] = useState<BookState>('closed');
  const [isClosing, setIsClosing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Animate clip-path to follow cover's left edge during flip
  useEffect(() => {
    if ((bookState !== 'open' && !isClosing) || !wrapperRef.current) return;

    let animating = true;
    const wrapperEl = wrapperRef.current;

    const animateClip = () => {
      if (!animating || !wrapperRef.current) return;

      const coverEl = document.querySelector('.book-cover-page') as HTMLElement;

      if (coverEl) {
        const coverRect = coverEl.getBoundingClientRect();
        const wrapperRect = wrapperEl.getBoundingClientRect();

        // Calculate cover's left edge as percentage of wrapper width
        const leftEdgePercent = Math.max(0,
          ((coverRect.left - wrapperRect.left) / wrapperRect.width) * 100
        );

        // Use polygon to avoid top/bottom clipping from 3D perspective
        if (leftEdgePercent > 1) {
          wrapperEl.style.clipPath = `polygon(${leftEdgePercent}% -50%, 150% -50%, 150% 150%, ${leftEdgePercent}% 150%)`;
        } else {
          wrapperEl.style.clipPath = '';
        }

        // If closing and cover is back on right side (~48%), complete the close
        if (isClosing && leftEdgePercent >= 48) {
          wrapperEl.style.clipPath = '';
          setBookState('closed');
          setIsClosing(false);
          return;
        }
      }

      // Keep running while book is open or closing
      requestAnimationFrame(animateClip);
    };

    requestAnimationFrame(animateClip);

    return () => { animating = false; };
  }, [bookState, isClosing]);

  // Handle book click to open
  const handleBookClick = useCallback(() => {
    if (bookState === 'closed') {
      setBookState('open');
      // Flip the cover page after a tiny delay to sync with transform animation
      setTimeout(() => {
        if (bookRef.current) {
          bookRef.current.pageFlip().flipNext();
        }
      }, 100);
    }
  }, [bookState]);

  // TOC chapter click - flip to that chapter page (stay in book)
  const handleChapterClick = useCallback((chapter: number) => {
    if (bookState === 'open') {
      // Page structure: cover(0) + TOC(1-2) + chapters start at 3
      // Chapter N starts at page: 2*N + 1 (Chapter 1 = page 3, Chapter 2 = page 5, etc.)
      const pageIndex = 2 * chapter + 1;
      if (bookRef.current) {
        bookRef.current.pageFlip().flip(pageIndex);
      }
    }
  }, [bookState]);

  // Track page changes - start closing when flipping back to cover
  const handleFlip = useCallback((e: { data: number }) => {
    if (e.data === 0 && bookState === 'open') {
      // Start tilt immediately for simultaneous animation with flip
      setIsClosing(true);
    }
  }, [bookState]);

  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="magical-book-wrapper">
      {/* Top Navigation */}
      <div className="book-top-nav">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onBack}
          className="back-button"
          style={{
            fontFamily: fonts.body,
            color: colors.textMuted,
            border: `1px solid ${colors.withAlpha(colors.gold, 0.3)}`
          }}
        >
          ← Back
        </motion.button>

        {/* Navigation buttons - visible when book is open */}
        {bookState === 'open' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="book-nav-buttons"
          >
            <button
              onClick={() => onNavigate('familyTree')}
              className="nav-view-btn"
              style={{
                fontFamily: fonts.body,
                color: colors.teal,
                border: `1px solid ${colors.withAlpha(colors.teal, 0.3)}`
              }}
            >
              <span>🌳</span>
              <span className="nav-btn-text">Family Tree</span>
            </button>
            <button
              onClick={() => onNavigate('visions')}
              className="nav-view-btn"
              style={{
                fontFamily: fonts.body,
                color: colors.purple,
                border: `1px solid ${colors.withAlpha(colors.purple, 0.3)}`
              }}
            >
              <span>🎨</span>
              <span className="nav-btn-text">Visions</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Glow effect */}
      <div className="book-glow" />

      {/* Content container */}
      <div className="book-content-area">
        {/* Navigation button left */}
        {bookState === 'open' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={goToPrevPage}
            className="flip-nav-btn flip-nav-left"
            aria-label="Previous page"
          >
            ←
          </motion.button>
        )}

        {/* Book Scene Container with perspective */}
        <div className="flipbook-container">
          {/* Wrapper with transform for closed/open states */}
          <div
            ref={wrapperRef}
            className={`flipbook-wrapper ${bookState}${isClosing ? ' closing' : ''}`}
            onClick={bookState === 'closed' ? handleBookClick : undefined}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={480}
              height={600}
              size="fixed"
              minWidth={480}
              maxWidth={480}
              minHeight={600}
              maxHeight={600}
              drawShadow={false}
              flippingTime={800}
              usePortrait={false}
              startPage={0}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={handleFlip}
              className="page-flip-book"
              style={{}}
              clickEventForward={false}
              useMouseEvents={bookState === 'open'}
              swipeDistance={30}
              showPageCorners={bookState === 'open'}
              disableFlipByClick={bookState === 'closed'}
            >
              {/* Cover Page */}
              <Page className="book-cover-page">
                <img src="/magical-book.png?v=2" alt="Cien Años de Soledad" />
              </Page>

              {/* TOC Left Page */}
              <Page className="book-page toc-page-left">
                <TOCLeftContent onChapterClick={handleChapterClick} />
              </Page>

              {/* TOC Right Page */}
              <Page className="book-page toc-page-right">
                <TOCRightContent onChapterClick={handleChapterClick} />
              </Page>

              {/* Chapter Pages */}
              {chaptersData.map((chapter) => {
                const introduced = characters.filter(c =>
                  chapter.charactersIntroduced.includes(c.id)
                );
                const died = characters.filter(c =>
                  chapter.charactersDied.includes(c.id)
                );
                const moodColor = moodColors[chapter.mood];

                return [
                  <Page key={`chapter-${chapter.number}-left`} className="book-page">
                    <div className="chapter-page-inner">
                      <div className="chapter-header">
                        <span className="chapter-num" style={{ color: moodColor }}>
                          {chapter.number}
                        </span>
                        <h2 className="chapter-title">{chapter.title}</h2>
                        <span className="chapter-era">{chapter.era}</span>
                      </div>
                      <blockquote className="chapter-quote" style={{ borderColor: moodColor }}>
                        "{chapter.quote}"
                      </blockquote>
                      <p className="chapter-summary">{chapter.summary}</p>
                      <div className="chapter-footer">
                        <div className="chapter-divider" />
                        <p className="chapter-themes">
                          {chapter.themes.join(' · ')}
                        </p>
                      </div>
                    </div>
                  </Page>,
                  <Page key={`chapter-${chapter.number}-right`} className="book-page">
                    <div className="chapter-page-inner chapter-right-page">
                      {/* Characters Introduced */}
                      {introduced.length > 0 && (
                        <div className="chapter-section">
                          <h3 className="characters-heading characters-introduced">
                            Characters Introduced
                          </h3>
                          <div className="characters-list">
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
                        <div className="chapter-section">
                          <h3 className="characters-heading characters-departed">
                            Departed This Chapter
                          </h3>
                          <div className="characters-list">
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
                        <div className="no-characters">
                          <div className="no-characters-icon">📖</div>
                          <p className="no-characters-text">The story continues...</p>
                          <p className="no-characters-subtext">No new characters appear in this chapter</p>
                        </div>
                      )}

                      <div className="page-number">{chapter.number} / 20</div>
                    </div>
                  </Page>
                ];
              })}

              {/* Back Cover - transparent, required for proper page alignment with showCover */}
              <Page className="back-cover-page">
                <div />
              </Page>
            </HTMLFlipBook>
          </div>

          {/* Instruction - always rendered to prevent layout shift */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: bookState === 'closed' ? 0.7 : 0,
              y: 0
            }}
            transition={{ delay: bookState === 'closed' ? 0.8 : 0, duration: 0.3 }}
            className="book-instruction"
            style={{
              fontFamily: fonts.body,
              color: colors.textMuted,
              visibility: bookState === 'closed' ? 'visible' : 'hidden'
            }}
          >
            Click to open the book
          </motion.p>
        </div>

        {/* Navigation button right */}
        {bookState === 'open' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={goToNextPage}
            className="flip-nav-btn flip-nav-right"
            aria-label="Next page"
          >
            →
          </motion.button>
        )}
      </div>
    </div>
  );
}
