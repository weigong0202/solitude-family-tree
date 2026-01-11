import { motion } from 'framer-motion';
import { FamilyTree } from '../components/FamilyTree/FamilyTree';
import type { Character } from '../types';
import { colors, fonts, gradients, borders } from '../constants/theme';

type ViewMode = 'intro' | 'book' | 'house' | 'familyTree' | 'visions';

interface FamilyTreeViewProps {
  onCharacterClick: (character: Character) => void;
  onNavigate: (view: ViewMode) => void;
}

export function FamilyTreeView({ onCharacterClick, onNavigate }: FamilyTreeViewProps) {
  return (
    <motion.div
      key="familyTree"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
      style={{ background: gradients.darkRadial }}
    >
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6 relative z-10">
        <button
          onClick={() => onNavigate('book')}
          className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.textMuted, border: borders.subtle }}
        >
          ← Back to Book
        </button>

        <h2
          className="text-xl font-bold"
          style={{ fontFamily: fonts.heading, color: colors.teal }}
        >
          Buendía Family Tree
        </h2>

        <button
          onClick={() => onNavigate('house')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.gold, border: borders.gold }}
        >
          <span>🏠</span>
          <span className="hidden md:inline">Explore House</span>
        </button>
      </div>

      {/* Family Tree Component */}
      <div className="flex-1 p-4">
        <FamilyTree onCharacterClick={onCharacterClick} />
      </div>
    </motion.div>
  );
}
