import { useState, useEffect } from 'react';
import type { Character } from '../types';
import { generatePortrait, getPortrait, getPlaceholderPortrait, isAIGeneratedPortrait } from '../services/imagen';

interface UseCharacterPortraitOptions {
  /** If true, will attempt to generate portrait via AI if not cached */
  generateIfMissing?: boolean;
}

interface UseCharacterPortraitResult {
  portrait: string;
  isLoading: boolean;
  isAIGenerated: boolean;
  error: Error | null;
}

/**
 * Custom hook for loading character portraits with caching.
 * Consolidates portrait loading logic used across multiple components.
 */
export function useCharacterPortrait(
  character: Character | null,
  options: UseCharacterPortraitOptions = {}
): UseCharacterPortraitResult {
  const { generateIfMissing = true } = options;

  const [portrait, setPortrait] = useState<string>(() =>
    character ? getPlaceholderPortrait(character) : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!character) {
      setPortrait('');
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setPortrait(getPlaceholderPortrait(character));
    setError(null);

    async function loadPortrait() {
      if (!character) return;

      setIsLoading(true);

      try {
        // First try to get cached/static portrait
        const cachedPortrait = getPortrait(character);

        if (cachedPortrait && cachedPortrait !== getPlaceholderPortrait(character)) {
          // We have a cached portrait, use it
          if (mounted) {
            setPortrait(cachedPortrait);
            setIsLoading(false);
          }
          return;
        }

        // If generateIfMissing is true, try to generate via AI
        if (generateIfMissing) {
          const generatedPortrait = await generatePortrait(character);
          if (mounted) {
            setPortrait(generatedPortrait);
          }
        }
      } catch (err) {
        console.error('Failed to load portrait:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load portrait'));
          // Keep the placeholder portrait on error
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortrait();

    return () => {
      mounted = false;
    };
  }, [character, generateIfMissing]);

  return {
    portrait,
    isLoading,
    isAIGenerated: isAIGeneratedPortrait(portrait),
    error,
  };
}
