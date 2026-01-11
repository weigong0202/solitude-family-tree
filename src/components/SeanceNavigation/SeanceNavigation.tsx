import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChapterData } from '../../data/chapters';

interface SeanceNavigationProps {
  chapters: ChapterData[];
  currentChapter: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function SeanceNavigation({
  chapters,
  currentChapter,
  isOpen,
  onToggle
}: SeanceNavigationProps) {
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  // Calculate positions around the circle
  const getChapterPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 140; // Distance from center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <>
      {/* Toggle Button - Mystical Candle Icon */}
      <motion.button
        onClick={onToggle}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, #B58900 0%, #8B6914 100%)',
          boxShadow: isOpen
            ? '0 0 30px rgba(181, 137, 0, 0.6), 0 0 60px rgba(181, 137, 0, 0.3)'
            : '0 0 15px rgba(181, 137, 0, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? ['0 0 30px rgba(181, 137, 0, 0.6)', '0 0 40px rgba(181, 137, 0, 0.8)', '0 0 30px rgba(181, 137, 0, 0.6)']
            : '0 0 15px rgba(181, 137, 0, 0.4)',
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-2xl">🕯️</span>
      </motion.button>

      {/* Séance Table Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(7, 54, 66, 0.95)' }}
            onClick={onToggle}
          >
            {/* The Séance Table */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Table surface */}
              <div
                className="w-80 h-80 md:w-96 md:h-96 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle, #2B1810 0%, #1A0F0A 70%, #0D0705 100%)',
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), 0 0 100px rgba(181, 137, 0, 0.2)',
                  border: '3px solid #3D2817',
                }}
              >
                {/* Wood grain texture overlay */}
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(139, 105, 20, 0.3) 2px,
                      rgba(139, 105, 20, 0.3) 4px
                    )`,
                  }}
                />

                {/* Center mystical glow */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(181, 137, 0, 0.3) 0%, transparent 70%)',
                  }}
                />

                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{ fontFamily: 'var(--font-mono)', color: '#B58900' }}
                  >
                    Chapter
                  </p>
                  <motion.p
                    key={hoveredChapter || currentChapter}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold"
                    style={{ fontFamily: 'var(--font-serif)', color: '#FDF6E3' }}
                  >
                    {hoveredChapter || currentChapter}
                  </motion.p>
                  <p
                    className="text-[10px] mt-1 max-w-[100px] leading-tight"
                    style={{ fontFamily: 'var(--font-serif)', color: '#839496' }}
                  >
                    {chapters[(hoveredChapter || currentChapter) - 1]?.title}
                  </p>
                </div>

                {/* Chapter positions around the circle */}
                {chapters.map((chapter, index) => {
                  const pos = getChapterPosition(index, chapters.length);
                  const isActive = currentChapter === chapter.number;
                  const isHovered = hoveredChapter === chapter.number;

                  return (
                    <motion.a
                      key={chapter.number}
                      href={`#chapter-${chapter.number}`}
                      onClick={onToggle}
                      className="absolute flex flex-col items-center justify-center"
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseEnter={() => setHoveredChapter(chapter.number)}
                      onMouseLeave={() => setHoveredChapter(null)}
                      whileHover={{ scale: 1.2 }}
                    >
                      {/* Candle holder */}
                      <div className="relative">
                        {/* Flame */}
                        <motion.div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 w-2"
                          animate={isActive || isHovered ? {
                            height: ['8px', '12px', '8px'],
                            opacity: [0.8, 1, 0.8],
                          } : { height: '0px', opacity: 0 }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          style={{
                            background: 'linear-gradient(to top, #B58900, #DCAA2B, #FDF6E3)',
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                            boxShadow: isActive || isHovered
                              ? '0 0 10px #B58900, 0 0 20px rgba(181, 137, 0, 0.5)'
                              : 'none',
                          }}
                        />

                        {/* Candle */}
                        <div
                          className="w-4 h-6 rounded-t-sm"
                          style={{
                            background: isActive
                              ? 'linear-gradient(to bottom, #FDF6E3, #EEE8D5)'
                              : 'linear-gradient(to bottom, #839496, #657B83)',
                            boxShadow: isActive
                              ? '0 0 15px rgba(181, 137, 0, 0.5)'
                              : 'none',
                          }}
                        />

                        {/* Holder */}
                        <div
                          className="w-6 h-2 rounded-b-sm -mt-px"
                          style={{
                            background: '#3D2817',
                            marginLeft: '-4px',
                          }}
                        />
                      </div>

                      {/* Chapter number */}
                      <span
                        className="mt-1 text-xs"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: isActive ? '#B58900' : '#657B83',
                          textShadow: isActive ? '0 0 10px rgba(181, 137, 0, 0.5)' : 'none',
                        }}
                      >
                        {chapter.number}
                      </span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Decorative outer ring */}
              <div
                className="absolute inset-[-20px] rounded-full pointer-events-none"
                style={{
                  border: '1px solid rgba(181, 137, 0, 0.2)',
                }}
              />

              {/* Mystical symbols in corners */}
              {[0, 90, 180, 270].map((rotation) => (
                <motion.div
                  key={rotation}
                  className="absolute text-xl opacity-30"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${rotation}deg) translateY(-200px) translateX(-50%)`,
                    color: '#B58900',
                  }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: rotation / 360 }}
                >
                  ✦
                </motion.div>
              ))}
            </motion.div>

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 text-center"
              style={{ fontFamily: 'var(--font-mono)', color: '#657B83' }}
            >
              Click a candle to navigate • Click outside to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
