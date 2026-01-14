import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { PresetScenario, AlternateTimeline } from '../../types/alternateHistory';
import { getAlternateTimelines } from '../../services/alternateHistory';
import { generateAlternateProphecy, isGeminiInitialized } from '../../services/gemini';
import { ScenarioPanel } from './ScenarioPanel';
import { ProphecyResult } from './ProphecyResult';
import { colors, fonts } from '../../constants/theme';

export function AlternateHistory() {
  const [selectedScenario, setSelectedScenario] = useState<PresetScenario | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AlternateTimeline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedTimelines, setSavedTimelines] = useState<AlternateTimeline[]>(() => getAlternateTimelines());
  const [showGallery, setShowGallery] = useState(false);

  const handleSelectScenario = useCallback((scenario: PresetScenario) => {
    // Find the most recent generated prophecy for this scenario
    const existingTimeline = savedTimelines.find(
      (t) => t.divergencePoint.id === scenario.id
    );

    setSelectedScenario(scenario);
    setCustomQuestion(scenario.suggestedQuestion);
    // Show existing prophecy if found, otherwise null
    setResult(existingTimeline || null);
    setError(null);
  }, [savedTimelines]);

  const handleCustomQuestionChange = useCallback((question: string) => {
    setCustomQuestion(question);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!customQuestion.trim()) {
      setError('Please enter a question to ask the prophet.');
      return;
    }

    if (!isGeminiInitialized()) {
      setError('Please configure your Gemini API key to generate prophecies.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const { timeline } = await generateAlternateProphecy(
        customQuestion.trim(),
        selectedScenario
      );
      setResult(timeline);
      setSavedTimelines(getAlternateTimelines());
    } catch (err) {
      console.error('Generation error:', err);
      setError('The prophet\'s vision was clouded. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [customQuestion, selectedScenario]);

  const handleSelectFromGallery = useCallback((timeline: AlternateTimeline) => {
    setResult(timeline);
    setCustomQuestion(timeline.question);
    if (timeline.divergencePoint.id !== 'custom') {
      setSelectedScenario(timeline.divergencePoint as PresetScenario);
    } else {
      setSelectedScenario(null);
    }
    setShowGallery(false);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedScenario(null);
    setCustomQuestion('');
    setResult(null);
    setError(null);
  }, []);

  const isInitialized = isGeminiInitialized();

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Scenarios */}
      <ScenarioPanel
        selectedScenario={selectedScenario}
        onSelectScenario={handleSelectScenario}
        onClearSelection={handleClearSelection}
        savedTimelines={savedTimelines}
        onShowGallery={() => setShowGallery(true)}
      />

      {/* Right Panel - Result (no scroll, like Visions) */}
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        <ProphecyResult
          result={result}
          isGenerating={isGenerating}
          error={error}
          scenario={selectedScenario}
          customQuestion={customQuestion}
          onCustomQuestionChange={handleCustomQuestionChange}
          onGenerate={handleGenerate}
          isInitialized={isInitialized}
        />
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setShowGallery(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[80vh] rounded-xl overflow-hidden flex flex-col"
            style={{ backgroundColor: colors.cream }}
            onClick={e => e.stopPropagation()}
          >
            {/* Gallery Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.withAlpha(colors.purple, 0.2) }}
            >
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: fonts.heading, color: colors.text }}
              >
                Past Prophecies ({savedTimelines.length})
              </h3>
              <button
                onClick={() => setShowGallery(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10"
                style={{ color: colors.text }}
                aria-label="Close gallery"
              >
                &times;
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {savedTimelines.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">📜</span>
                  <p
                    className="text-lg mb-2"
                    style={{ fontFamily: fonts.heading, color: colors.text }}
                  >
                    No prophecies yet
                  </p>
                  <p
                    className="text-sm"
                    style={{ fontFamily: fonts.body, color: colors.textMuted }}
                  >
                    Ask Melqu&iacute;ades a question to see your first prophecy
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTimelines.map(timeline => (
                    <button
                      key={timeline.id}
                      onClick={() => handleSelectFromGallery(timeline)}
                      className="w-full text-left p-4 rounded-xl transition-all hover:shadow-md"
                      style={{
                        backgroundColor: colors.withAlpha(colors.purple, 0.05),
                        border: `1px solid ${colors.withAlpha(colors.purple, 0.15)}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{timeline.divergencePoint.id === 'custom' ? '✨' : '📜'}</span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium truncate"
                            style={{ fontFamily: fonts.heading, color: colors.text }}
                          >
                            {timeline.divergencePoint.title}
                          </p>
                          <p
                            className="text-sm mt-1 line-clamp-2"
                            style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                          >
                            {timeline.question}
                          </p>
                          <p
                            className="text-xs mt-2"
                            style={{ fontFamily: fonts.accent, color: colors.textMuted }}
                          >
                            {timeline.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
