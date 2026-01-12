import { useState, useCallback } from 'react';
import type { Character } from '../types';
import { generateCharacterBio, isGeminiInitialized } from '../services/gemini';

interface BioCache {
  [key: string]: string;
}

export function useCharacterBio() {
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache] = useState<BioCache>({});

  const fetchBio = useCallback(async (character: Character, currentChapter: number) => {
    const cacheKey = `${character.id}-${currentChapter}`;

    // Check cache first
    if (cache[cacheKey]) {
      setBio(cache[cacheKey]);
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
      cache[cacheKey] = generatedBio;
      setBio(generatedBio);
    } catch {
      setError('Failed to generate biography. Using default description.');
      setBio(character.description);
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

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
