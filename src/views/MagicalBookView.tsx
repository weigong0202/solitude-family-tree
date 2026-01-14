import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicalBook } from '../components/MagicalBook';
import { gradients, colors, fonts } from '../constants/theme';
import type { Character, ViewMode } from '../types';

interface MagicalBookViewProps {
  onBack: () => void;
  onCharacterClick: (character: Character) => void;
  onNavigate: (view: ViewMode) => void;
}

export function MagicalBookView({ onBack, onCharacterClick, onNavigate }: MagicalBookViewProps) {
  const [showQuote, setShowQuote] = useState(true);

  useEffect(() => {
    // Hide quote after animation completes
    const timer = setTimeout(() => {
      setShowQuote(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="magicalBook"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: gradients.darkRadialSubtle }}
    >
      <AnimatePresence mode="wait">
        {showQuote ? (
          <motion.div
            key="quote"
            className="flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <p
              className="text-lg md:text-xl lg:text-2xl text-center max-w-2xl italic leading-relaxed"
              style={{
                fontFamily: fonts.body,
                color: colors.gold,
              }}
            >
              "Many years later, as he faced the firing squad, Colonel Aureliano Buendía
              was to remember that distant afternoon when his father took him to discover ice."
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="book"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MagicalBook
              onBack={onBack}
              onCharacterClick={onCharacterClick}
              onNavigate={onNavigate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
