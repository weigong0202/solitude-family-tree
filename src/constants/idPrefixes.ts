/**
 * Centralized ID prefix constants for generated content.
 * Used to create unique identifiers for scenes, timelines, and other generated items.
 */

export const ID_PREFIXES = {
  scene: 'scene_',
  timeline: 'timeline_',
  message: 'msg_',
  separator: 'separator_',
} as const;

/**
 * Generate a unique ID with the given prefix.
 * Format: {prefix}{timestamp}_{randomString}
 */
export function generateUniqueId(prefix: keyof typeof ID_PREFIXES): string {
  return `${ID_PREFIXES[prefix]}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
