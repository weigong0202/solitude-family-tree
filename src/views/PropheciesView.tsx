import { motion } from 'framer-motion';
import { AlternateHistory } from '../components/AlternateHistory';
import { colors, fonts, gradients, borders } from '../constants/theme';
import type { ViewMode } from '../types';

interface PropheciesViewProps {
  onNavigate: (view: ViewMode) => void;
}

export function PropheciesView({ onNavigate }: PropheciesViewProps) {
  return (
    <motion.div
      key="prophecies"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: gradients.darkRadial }}
    >
      {/* Top Navigation - Fixed height */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 relative z-10">
        <button
          onClick={() => onNavigate('magicalBook')}
          className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.textMuted, border: borders.subtle }}
        >
          &larr; Back to Book
        </button>

        <div className="text-center">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: fonts.heading, color: colors.gold }}
          >
            Melqu&iacute;ades' Prophecy
          </h2>
          <p
            className="text-xs"
            style={{ fontFamily: fonts.body, color: colors.textMuted }}
          >
            Alternate History Generator
          </p>
        </div>

        <button
          onClick={() => onNavigate('familyTree')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.teal, border: borders.teal }}
        >
          <span>🌳</span>
          <span className="hidden md:inline">Family Tree</span>
        </button>
      </div>

      {/* Prophecies Component */}
      <div className="flex-1 overflow-hidden">
        <div
          className="h-full mx-4 mb-4 rounded-lg overflow-hidden"
          style={{ backgroundColor: colors.withAlpha(colors.cream, 0.95) }}
        >
          <AlternateHistory />
        </div>
      </div>
    </motion.div>
  );
}
