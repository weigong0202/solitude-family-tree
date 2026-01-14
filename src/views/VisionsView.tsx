import { motion } from 'framer-motion';
import { MacondoVisions } from '../components/MacondoVisions';
import { colors, fonts, gradients, borders } from '../constants/theme';
import type { ViewMode } from '../types';

interface VisionsViewProps {
  onNavigate: (view: ViewMode) => void;
}

export function VisionsView({ onNavigate }: VisionsViewProps) {
  return (
    <motion.div
      key="visions"
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
          style={{ fontFamily: fonts.body, color: colors.textLight, border: borders.subtle }}
        >
          ← Back to Book
        </button>

        {/* Absolutely centered title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: fonts.heading, color: colors.purple }}
          >
            Macondo Visions
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: fonts.body, color: colors.textLight }}
          >
            AI-Generated Illustrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('prophecies')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ fontFamily: fonts.body, color: colors.gold, border: borders.gold }}
          >
            <span>🔮</span>
            <span className="hidden md:inline">Prophecies</span>
          </button>
          <button
            onClick={() => onNavigate('familyTree')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ fontFamily: fonts.body, color: colors.teal, border: borders.teal }}
          >
            <span>🌳</span>
            <span className="hidden md:inline">Family Tree</span>
          </button>
        </div>
      </div>

      {/* Visions Component */}
      <div className="flex-1 overflow-hidden">
        <div
          className="h-full mx-4 mb-4 rounded-lg overflow-hidden"
          style={{ backgroundColor: colors.withAlpha(colors.cream, 0.95) }}
        >
          <MacondoVisions />
        </div>
      </div>
    </motion.div>
  );
}
