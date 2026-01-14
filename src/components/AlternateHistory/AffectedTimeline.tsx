import { motion } from 'framer-motion';
import type { ButterflyEffect } from '../../types/alternateHistory';
import { colors, fonts } from '../../constants/theme';

interface AffectedTimelineProps {
  effects: ButterflyEffect[];
}

// Colors for cascade levels
const CASCADE_COLORS: Record<number, string> = {
  1: colors.gold,   // Direct effect
  2: colors.teal,   // Secondary effect
  3: colors.textMuted, // Ripple effect
};

const CASCADE_LABELS: Record<number, string> = {
  1: 'Direct',
  2: 'Secondary',
  3: 'Ripple',
};

export function AffectedTimeline({ effects }: AffectedTimelineProps) {
  // Sort by cascade level
  const sortedEffects = [...effects].sort((a, b) => a.cascadeLevel - b.cascadeLevel);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedEffects.map((effect, index) => {
        const cascadeColor = CASCADE_COLORS[effect.cascadeLevel] || colors.textMuted;
        const cascadeLabel = CASCADE_LABELS[effect.cascadeLevel] || `Level ${effect.cascadeLevel}`;

        return (
          <motion.div
            key={`${effect.characterId}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.cream,
              border: `1px solid ${colors.withAlpha(cascadeColor, 0.3)}`,
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                backgroundColor: colors.withAlpha(cascadeColor, 0.1),
                borderBottom: `1px solid ${colors.withAlpha(cascadeColor, 0.2)}`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.withAlpha(cascadeColor, 0.2) }}
                >
                  <span className="text-sm">
                    {effect.cascadeLevel === 1 ? '🦋' : effect.cascadeLevel === 2 ? '🌊' : '💨'}
                  </span>
                </div>
                <div>
                  <p
                    className="text-base font-semibold"
                    style={{ fontFamily: fonts.heading, color: colors.text }}
                  >
                    {effect.characterName}
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ fontFamily: fonts.accent, color: cascadeColor }}
                  >
                    {cascadeLabel} Effect
                  </p>
                </div>
              </div>
            </div>

            {/* Fates comparison */}
            <div className="p-4 space-y-3">
              {/* Original fate */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.textSecondary }}
                  />
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
                  >
                    Original Fate
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed pl-4"
                  style={{ fontFamily: fonts.body, color: colors.text }}
                >
                  {effect.originalFate}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ color: cascadeColor }}
                >
                  ↓
                </motion.div>
              </div>

              {/* Alternate fate */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cascadeColor }}
                  />
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ fontFamily: fonts.accent, color: cascadeColor }}
                  >
                    Alternate Fate
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed pl-4"
                  style={{ fontFamily: fonts.body, color: colors.text }}
                >
                  {effect.alternateFate}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
