import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PresetScenario, AlternateTimeline } from '../../types/alternateHistory';
import {
  getScenariosByCategory,
  getCategoryDisplayName,
} from '../../services/alternateHistory';
import { colors, fonts } from '../../constants/theme';

interface ScenarioPanelProps {
  selectedScenario: PresetScenario | null;
  onSelectScenario: (scenario: PresetScenario) => void;
  onClearSelection: () => void;
  savedTimelines: AlternateTimeline[];
  onShowGallery: () => void;
}

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  death: '💀',
  decision: '⚔️',
  relationship: '❤️',
  event: '🌪️',
};

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  death: colors.blue,
  decision: colors.gold,
  relationship: colors.purple,
  event: colors.teal,
};

// Collapsible Section Component
const CollapsibleSection = memo(function CollapsibleSection({
  category,
  scenarios,
  expanded,
  onToggle,
  selectedScenario,
  onSelectScenario,
}: {
  category: string;
  scenarios: PresetScenario[];
  expanded: boolean;
  onToggle: () => void;
  selectedScenario: PresetScenario | null;
  onSelectScenario: (scenario: PresetScenario) => void;
}) {
  const accentColor = CATEGORY_COLORS[category] || colors.gold;

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: accentColor }}
            className="text-sm"
          >
            ▶
          </motion.span>
          <span className="text-lg">{CATEGORY_ICONS[category]}</span>
          <h4
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            {getCategoryDisplayName(category)}
          </h4>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: colors.withAlpha(accentColor, 0.15), color: accentColor }}
          >
            {scenarios.length}
          </span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2 pl-6">
              {scenarios.map(scenario => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isSelected={selectedScenario?.id === scenario.id}
                  onClick={() => onSelectScenario(scenario)}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Scenario Card Component
const ScenarioCard = memo(function ScenarioCard({
  scenario,
  isSelected,
  onClick,
  accentColor,
}: {
  scenario: PresetScenario;
  isSelected: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg transition-all hover:shadow-sm"
      style={{
        backgroundColor: isSelected ? colors.withAlpha(accentColor, 0.1) : colors.withAlpha(colors.cream, 0.8),
        border: `1px solid ${isSelected ? accentColor : colors.withAlpha(colors.gold, 0.15)}`,
      }}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{scenario.icon}</span>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium leading-tight"
            style={{
              fontFamily: fonts.heading,
              color: isSelected ? accentColor : colors.text,
            }}
          >
            {scenario.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs"
              style={{ fontFamily: fonts.body, color: colors.text }}
            >
              Ch. {scenario.chapter}
            </span>
            <span
              className="text-xs capitalize"
              style={{ fontFamily: fonts.body, color: accentColor }}
            >
              {scenario.mood}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
});

export function ScenarioPanel({
  selectedScenario,
  onSelectScenario,
  onClearSelection,
  savedTimelines,
  onShowGallery,
}: ScenarioPanelProps) {
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    death: true,
    decision: true,
    relationship: true,
    event: true,
  });

  const toggleSection = useCallback((category: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const scenariosByCategory = getScenariosByCategory();

  return (
    <div
      className="w-80 lg:w-96 flex-shrink-0 flex flex-col border-r h-full overflow-hidden"
      style={{ borderColor: colors.withAlpha(colors.purple, 0.2) }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 p-4 border-b"
        style={{ borderColor: colors.withAlpha(colors.purple, 0.2) }}
      >
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ fontFamily: fonts.heading, color: colors.text }}
        >
          <span>📜</span>
          What If...
        </h2>
        <p
          className="text-sm mt-1"
          style={{ fontFamily: fonts.body, color: colors.textSecondary }}
        >
          Select a pivotal moment to explore
        </p>
      </div>

      {/* Scenarios List */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(scenariosByCategory).map(([category, scenarios]) => (
          <CollapsibleSection
            key={category}
            category={category}
            scenarios={scenarios}
            expanded={expandedSections[category]}
            onToggle={() => toggleSection(category)}
            selectedScenario={selectedScenario}
            onSelectScenario={onSelectScenario}
          />
        ))}

        {/* Custom Question Option */}
        <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${colors.withAlpha(colors.purple, 0.15)}` }}>
          <button
            onClick={onClearSelection}
            className="w-full text-left p-3 rounded-lg transition-all hover:shadow-sm"
            style={{
              backgroundColor: !selectedScenario ? colors.withAlpha(colors.purple, 0.1) : colors.withAlpha(colors.cream, 0.8),
              border: `1px solid ${!selectedScenario ? colors.purple : colors.withAlpha(colors.gold, 0.15)}`,
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">✨</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium leading-tight"
                  style={{
                    fontFamily: fonts.heading,
                    color: !selectedScenario ? colors.purple : colors.text,
                  }}
                >
                  Ask Your Own Question
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ fontFamily: fonts.body, color: colors.textSecondary }}
                >
                  Write a custom "what if" scenario
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Past Prophecies Link */}
      <button
        onClick={onShowGallery}
        className="flex-shrink-0 p-4 border-t flex items-center justify-between hover:bg-black/5 transition-colors"
        style={{ borderColor: colors.withAlpha(colors.purple, 0.2) }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.withAlpha(colors.purple, 0.1) }}
          >
            <span>📚</span>
          </div>
          <span
            className="text-sm font-medium"
            style={{ fontFamily: fonts.heading, color: colors.text }}
          >
            Past Prophecies
          </span>
        </div>
        <span
          className="text-sm px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: savedTimelines.length > 0
              ? colors.withAlpha(colors.purple, 0.15)
              : colors.withAlpha(colors.textMuted, 0.15),
            color: savedTimelines.length > 0 ? colors.purple : colors.text,
            fontFamily: fonts.body,
          }}
        >
          {savedTimelines.length}
        </span>
      </button>
    </div>
  );
}
