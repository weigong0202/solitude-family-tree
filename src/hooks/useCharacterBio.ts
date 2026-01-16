import { useState, useCallback, useRef } from 'react';
import type { Character } from '../types';
import { generateCharacterBio, isGeminiInitialized } from '../services/gemini';
import { ERROR_MESSAGES } from '../constants';

export function useCharacterBio() {
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use ref for cache since we don't need to re-render when cache changes
  const cacheRef = useRef<Map<string, string>>(new Map());

  const fetchBio = useCallback(async (character: Character, currentChapter: number) => {
    const cacheKey = `${character.id}-${currentChapter}`;

    // Check cache first
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setBio(cached);
      return;
    }

    if (!isGeminiInitialized()) {
      // Return the static description if Gemini is not initialized
      setBio(character.description);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedBio = await generateCharacterBio(character, currentChapter);
      cacheRef.current.set(cacheKey, generatedBio);
      setBio(generatedBio);
    } catch {
      setError(ERROR_MESSAGES.bioGenerationFailed);
      setBio(character.description);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed - cacheRef is stable

  const clearBio = useCallback(() => {
    setBio(null);
    setError(null);
  }, []);

  return {
    bio,
    isLoading,
    error,
    fetchBio,
    clearBio,
  };
}
