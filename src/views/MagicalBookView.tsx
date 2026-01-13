import { motion } from 'framer-motion';
import { MagicalBook } from '../components/MagicalBook';
import { gradients } from '../constants/theme';
import type { Character } from '../types';

type ViewMode = 'intro' | 'magicalBook' | 'book' | 'familyTree' | 'visions';

interface MagicalBookViewProps {
  onBack: () => void;
  onCharacterClick: (character: Character) => void;
  onNavigate: (view: ViewMode) => void;
}

export function MagicalBookView({ onBack, onCharacterClick, onNavigate }: MagicalBookViewProps) {
  return (
    <motion.div
      key="magicalBook"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: gradients.darkRadialSubtle }}
    >
      <MagicalBook
        onBack={onBack}
        onCharacterClick={onCharacterClick}
        onNavigate={onNavigate}
      />
    </motion.div>
  );
}
