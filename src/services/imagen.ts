import type { Character } from '../types';

/**
 * Get the portrait for a character.
 * Uses pre-generated portraits saved in /portraits/ directory.
 * Falls back to placeholder if portrait doesn't exist.
 */
export function getPortrait(character: Character): string {
  // Use pre-generated portrait from public/portraits/
  return `/portraits/${character.id}.png`;
}

/**
 * Placeholder portrait for when the pre-generated portrait is not available.
 * Uses DiceBear for consistent placeholder avatars.
 */
export function getPlaceholderPortrait(character: Character): string {
  const style = character.generation <= 2 ? 'notionists' : 'personas';
  const backgroundColor = character.isGhost ? '268BD2' : 'd2bab0';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${character.id}&backgroundColor=${backgroundColor}`;
}

/**
 * Check if a portrait exists (for loading states).
 * Returns the portrait URL, falling back to placeholder on error.
 */
export async function loadPortrait(character: Character): Promise<string> {
  const portraitUrl = getPortrait(character);

  // Check if the portrait file exists by attempting to load it
  try {
    const response = await fetch(portraitUrl, { method: 'HEAD' });
    if (response.ok) {
      return portraitUrl;
    }
  } catch {
    // Portrait doesn't exist, use placeholder
  }

  return getPlaceholderPortrait(character);
}

/**
 * For backwards compatibility - same as loadPortrait
 */
export async function generatePortrait(character: Character): Promise<string> {
  return loadPortrait(character);
}

/**
 * Check if a portrait URL is from the pre-generated portraits (not a placeholder)
 */
export function isAIGeneratedPortrait(url: string): boolean {
  return url.startsWith('/portraits/') && url.endsWith('.png');
}
