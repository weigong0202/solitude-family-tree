import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlternateTimeline, PresetScenario } from '../../types/alternateHistory';
import { AffectedTimeline } from './AffectedTimeline';
import { colors, fonts } from '../../constants/theme';

interface ProphecyResultProps {
  result: AlternateTimeline | null;
  isGenerating: boolean;
  error: string | null;
  scenario: PresetScenario | null;
  customQuestion: string;
  onCustomQuestionChange: (question: string) => void;
  onGenerate: () => void;
  isInitialized: boolean;
}

export function ProphecyResult({
  result,
  isGenerating,
  error,
  scenario,
  customQuestion,
  onCustomQuestionChange,
  onGenerate,
  isInitialized,
}: ProphecyResultProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  // Loading State
  if (isGenerating) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: colors.withAlpha(colors.backgroundBrown, 0.03) }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md"
        >
          {/* Animated parchment */}
          <div
            className="w-64 h-64 mx-auto rounded-xl flex flex-col items-center justify-center mb-6 relative overflow-hidden"
            style={{
              backgroundColor: colors.withAlpha(colors.cream, 0.9),
              border: `2px solid ${colors.withAlpha(colors.purple, 0.3)}`,
              boxShadow: `0 0 30px ${colors.withAlpha(colors.purple, 0.2)}`,
            }}
          >
            {/* Floating quill animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🪶
            </motion.div>

            {/* Writing lines animation */}
            <div className="w-40 space-y-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="h-1 rounded-full"
                  style={{ backgroundColor: colors.withAlpha(colors.purple, 0.3) }}
                />
              ))}
            </div>
          </div>

          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: fonts.heading, color: colors.purple }}
          >
            The prophet is writing...
          </h3>
          <p
            className="text-sm"
            style={{ fontFamily: fonts.body, color: colors.textSecondary }}
          >
            {scenario?.title || 'Custom prophecy'}
          </p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: colors.withAlpha(colors.backgroundBrown, 0.03) }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <span className="text-6xl block mb-4">🌫️</span>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: fonts.heading, color: colors.red }}
          >
            The vision is clouded
          </h3>
          <p
            className="text-sm mb-4"
            style={{ fontFamily: fonts.body, color: colors.textSecondary }}
          >
            {error}
          </p>
        </motion.div>
      </div>
    );
  }

  // Result State
  if (result) {
    return (
      <div
        className="h-full flex flex-col min-h-0 overflow-hidden"
        style={{ backgroundColor: colors.withAlpha(colors.backgroundBrown, 0.03) }}
      >
        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            {/* Parchment-style result card */}
            <div
              className="rounded-xl overflow-hidden shadow-lg"
              style={{ backgroundColor: colors.cream }}
            >
              {/* Header */}
              <div
                className="p-4 text-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.withAlpha(colors.purple, 0.1)}, ${colors.withAlpha(colors.gold, 0.05)})`,
                  borderBottom: `1px solid ${colors.withAlpha(colors.gold, 0.2)}`,
                }}
              >
                <span className="text-3xl block mb-2">📜</span>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: fonts.heading, color: colors.text }}
                >
                  {result.divergencePoint.title}
                </h2>
                <p
                  className="text-sm italic"
                  style={{ fontFamily: fonts.body, color: colors.purple }}
                >
                  "{result.question}"
                </p>
              </div>

              {/* Scrollable content area with max height */}
              <div
                className="overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: '50vh' }}
              >
                {/* Reasoning (collapsible) */}
                {result.thinkingTrace && (
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: colors.withAlpha(colors.purple, 0.05),
                      border: `1px solid ${colors.withAlpha(colors.purple, 0.15)}`,
                    }}
                  >
                    <button
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-black/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>🔮</span>
                        <span
                          className="text-xs font-medium"
                          style={{ fontFamily: fonts.heading, color: colors.purple }}
                        >
                          Prophet's Reasoning
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: showReasoning ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs"
                        style={{ color: colors.purple }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {showReasoning && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-3 pb-3 text-xs leading-relaxed whitespace-pre-wrap"
                            style={{
                              fontFamily: fonts.body,
                              color: colors.textSecondary,
                              fontStyle: 'italic',
                            }}
                          >
                            {result.thinkingTrace}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Narrative */}
                <div>
                  <h3
                    className="text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1"
                    style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                  >
                    <span>📖</span>
                    The Alternate Chronicle
                  </h3>
                  <div
                    className="text-sm leading-relaxed space-y-3"
                    style={{ fontFamily: fonts.body, color: colors.text }}
                  >
                    {result.narrative.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Affected Characters */}
                {result.effects && result.effects.length > 0 && (
                  <div>
                    <h3
                      className="text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1"
                      style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                    >
                      <span>🦋</span>
                      Butterfly Effects ({result.effects.length})
                    </h3>
                    <AffectedTimeline effects={result.effects} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2 text-center"
                style={{ borderTop: `1px solid ${colors.withAlpha(colors.gold, 0.15)}` }}
              >
                <p
                  className="text-[10px] italic"
                  style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                >
                  Generated on {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty/Input State - Show generation UI
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: colors.withAlpha(colors.backgroundBrown, 0.03) }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Selected Scenario Card */}
        {scenario ? (
          <div
            className="rounded-xl overflow-hidden shadow-lg mb-6"
            style={{ backgroundColor: colors.cream }}
          >
            <div
              className="p-4"
              style={{
                background: `linear-gradient(135deg, ${colors.withAlpha(colors.purple, 0.1)}, ${colors.withAlpha(colors.gold, 0.05)})`,
                borderBottom: `1px solid ${colors.withAlpha(colors.gold, 0.2)}`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{scenario.icon}</span>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: fonts.heading, color: colors.text }}
                  >
                    {scenario.title}
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ fontFamily: fonts.body, color: colors.textMuted }}
                  >
                    Chapter {scenario.chapter} • {scenario.mood}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ fontFamily: fonts.body, color: colors.textSecondary }}
              >
                {scenario.description}
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: fonts.accent, color: colors.textMuted }}
              >
                <strong>Original outcome:</strong> {scenario.originalOutcome}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <span className="text-6xl block mb-4">🔮</span>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: fonts.heading, color: colors.text }}
            >
              Ask the Prophet
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: fonts.body, color: colors.textSecondary }}
            >
              Select a pivotal moment from the left panel, or write your own "what if" question below.
            </p>
          </div>
        )}

        {/* Question Input */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: colors.withAlpha(colors.cream, 0.9),
            border: `1px solid ${colors.withAlpha(colors.purple, 0.2)}`,
          }}
        >
          <label
            className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {scenario ? 'Your Question' : 'Custom Question'}
          </label>
          <textarea
            value={customQuestion}
            onChange={(e) => onCustomQuestionChange(e.target.value)}
            placeholder={scenario ? scenario.suggestedQuestion : 'What if José Arcadio Buendía had never founded Macondo?'}
            className="w-full h-24 p-3 rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
            style={{
              fontFamily: fonts.body,
              backgroundColor: colors.withAlpha(colors.cream, 0.5),
              border: `1px solid ${colors.withAlpha(colors.purple, 0.15)}`,
              color: colors.text,
            }}
          />
          <motion.button
            onClick={onGenerate}
            disabled={!customQuestion.trim() || !isInitialized}
            className="mt-3 w-full py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: fonts.heading,
              background: `linear-gradient(135deg, ${colors.purple}, ${colors.withAlpha(colors.purple, 0.8)})`,
              color: colors.cream,
              boxShadow: `0 4px 15px ${colors.withAlpha(colors.purple, 0.3)}`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔮 Ask the Prophet
          </motion.button>
          {!isInitialized && (
            <p
              className="mt-2 text-xs text-center"
              style={{ fontFamily: fonts.body, color: colors.red }}
            >
              Gemini API key required to generate prophecies
            </p>
          )}
        </div>

        {/* Hint */}
        <div className="mt-4 text-center">
          <p
            className="text-xs italic"
            style={{ fontFamily: fonts.accent, color: colors.textMuted }}
          >
            "Many years later, as he faced the firing squad..."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
