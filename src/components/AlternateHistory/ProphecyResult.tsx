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

type TabId = 'chronicle' | 'effects' | 'reasoning';

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
  const [activeTab, setActiveTab] = useState<TabId>('chronicle');

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
    const tabs: { id: TabId; label: string; icon: string; badge?: number }[] = [
      { id: 'chronicle', label: 'Chronicle', icon: '📖' },
      { id: 'effects', label: 'Effects', icon: '🦋', badge: result.effects?.length || 0 },
      { id: 'reasoning', label: 'Reasoning', icon: '🔮' },
    ];

    return (
      <div
        className="h-full flex flex-col min-h-0 overflow-hidden"
        style={{ backgroundColor: colors.cream }}
      >
        {/* Header */}
        <div
          className="p-4 text-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${colors.withAlpha(colors.purple, 0.1)}, ${colors.withAlpha(colors.gold, 0.05)})`,
            borderBottom: `1px solid ${colors.withAlpha(colors.gold, 0.2)}`,
          }}
        >
          <h2
            className="text-lg font-bold mb-1"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            📜 {result.divergencePoint.title}
          </h2>
          <p
            className="text-sm italic"
            style={{ fontFamily: fonts.body, color: colors.purple }}
          >
            "{result.question}"
          </p>
        </div>

        {/* Tab Bar */}
        <div
          className="flex justify-center gap-1 px-4 py-2 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${colors.withAlpha(colors.gold, 0.15)}`,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                fontFamily: fonts.heading,
                backgroundColor: activeTab === tab.id
                  ? colors.withAlpha(colors.gold, 0.15)
                  : 'transparent',
                color: activeTab === tab.id ? colors.gold : colors.text,
                border: activeTab === tab.id
                  ? `1px solid ${colors.withAlpha(colors.gold, 0.3)}`
                  : '1px solid transparent',
              }}
            >
              {tab.icon} {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: activeTab === tab.id
                      ? colors.withAlpha(colors.gold, 0.2)
                      : colors.withAlpha(colors.textMuted, 0.2),
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'chronicle' && (
              <motion.div
                key="chronicle"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h3
                  className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-semibold"
                  style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
                >
                  <span>📖</span>
                  The Alternate Chronicle
                </h3>
                <div
                  className="text-base leading-relaxed space-y-4"
                  style={{ fontFamily: fonts.body, color: colors.text }}
                >
                  {result.narrative.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'effects' && (
              <motion.div
                key="effects"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {result.effects && result.effects.length > 0 ? (
                  <>
                    <h3
                      className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-semibold"
                      style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
                    >
                      <span>🦋</span>
                      Butterfly Effects ({result.effects.length})
                    </h3>
                    <AffectedTimeline effects={result.effects} />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl block mb-2">🦋</span>
                    <p
                      className="text-base"
                      style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                    >
                      No butterfly effects recorded
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reasoning' && (
              <motion.div
                key="reasoning"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h3
                  className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2 font-semibold"
                  style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
                >
                  <span>🔮</span>
                  Prophet's Reasoning
                </h3>
                {result.thinkingTrace ? (
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-lg"
                    style={{
                      fontFamily: fonts.body,
                      color: colors.text,
                      fontStyle: 'italic',
                      backgroundColor: colors.withAlpha(colors.purple, 0.05),
                      border: `1px solid ${colors.withAlpha(colors.purple, 0.1)}`,
                    }}
                  >
                    {result.thinkingTrace}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl block mb-2">🔮</span>
                    <p
                      className="text-base"
                      style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                    >
                      The prophet's thoughts were not recorded
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 text-center flex-shrink-0"
          style={{ borderTop: `1px solid ${colors.withAlpha(colors.gold, 0.15)}` }}
        >
          <p
            className="text-xs italic"
            style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
          >
            Generated on {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
          </p>
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
                    className="text-sm mt-0.5"
                    style={{ fontFamily: fonts.body, color: colors.textSecondary }}
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
                className="text-sm"
                style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
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
            className="text-sm font-semibold uppercase tracking-wider mb-2 block"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {scenario ? 'Your Question' : 'Custom Question'}
          </label>
          <textarea
            value={customQuestion}
            onChange={(e) => onCustomQuestionChange(e.target.value)}
            placeholder={scenario ? scenario.suggestedQuestion : 'What if José Arcadio Buendía had never founded Macondo?'}
            className="w-full h-24 p-3 rounded-lg text-base resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1"
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
            className="mt-3 w-full py-3 rounded-lg text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="mt-2 text-sm text-center"
              style={{ fontFamily: fonts.body, color: colors.red }}
            >
              Gemini API key required to generate prophecies
            </p>
          )}
        </div>

        {/* Hint */}
        <div className="mt-4 text-center">
          <p
            className="text-sm italic"
            style={{ fontFamily: fonts.accent, color: colors.textSecondary }}
          >
            "Many years later, as he faced the firing squad..."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
