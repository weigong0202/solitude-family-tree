/**
 * Centralized emotional state constants for the Living Memory feature.
 * These define valid moods for character conversations and are used both
 * for TypeScript types and for AI prompt generation.
 */

/**
 * Valid mood values for character emotional state.
 * When adding new moods, add them here and they'll automatically be:
 * - Available in the TypeScript type
 * - Included in AI prompts for mood analysis
 */
export const VALID_MOODS = [
  'neutral',
  'warm',
  'melancholic',
  'agitated',
  'mysterious',
  'joyful',
] as const;

/**
 * Mood type derived from the VALID_MOODS constant.
 * This ensures type safety while keeping the source of truth in one place.
 */
export type Mood = (typeof VALID_MOODS)[number];

/**
 * Mood display information for UI.
 */
export const MOOD_DISPLAY: Record<Mood, { emoji: string; label: string }> = {
  neutral: { emoji: '😐', label: 'Neutral' },
  warm: { emoji: '😊', label: 'Warm' },
  melancholic: { emoji: '😢', label: 'Melancholic' },
  agitated: { emoji: '😠', label: 'Agitated' },
  mysterious: { emoji: '🌙', label: 'Mysterious' },
  joyful: { emoji: '😄', label: 'Joyful' },
} as const;

/**
 * Comma-separated list of valid moods for AI prompts.
 * Use this when constructing prompts that ask the AI to choose a mood.
 */
export const VALID_MOODS_FOR_PROMPT = VALID_MOODS.map(m => `"${m}"`).join(', ');

/**
 * Trust level thresholds and their descriptions.
 */
export const TRUST_LEVELS = {
  distant: { min: 0, max: 19, label: 'Distant' },
  cautious: { min: 20, max: 39, label: 'Cautious' },
  warming: { min: 40, max: 59, label: 'Warming' },
  trusting: { min: 60, max: 79, label: 'Trusting' },
  intimate: { min: 80, max: 100, label: 'Intimate' },
} as const;

/**
 * Get trust description from trust level number.
 */
export function getTrustLevelDescription(trustLevel: number): string {
  if (trustLevel < TRUST_LEVELS.cautious.min) return TRUST_LEVELS.distant.label;
  if (trustLevel < TRUST_LEVELS.warming.min) return TRUST_LEVELS.cautious.label;
  if (trustLevel < TRUST_LEVELS.trusting.min) return TRUST_LEVELS.warming.label;
  if (trustLevel < TRUST_LEVELS.intimate.min) return TRUST_LEVELS.trusting.label;
  return TRUST_LEVELS.intimate.label;
}
