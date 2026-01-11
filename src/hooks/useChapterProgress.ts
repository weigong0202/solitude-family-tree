import { useState, useCallback } from 'react';

export function useChapterProgress(initialChapter: number = 1) {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  const goToChapter = useCallback((chapter: number) => {
    if (chapter >= 1 && chapter <= 20) {
      setCurrentChapter(chapter);
    }
  }, []);

  const nextChapter = useCallback(() => {
    setCurrentChapter(prev => Math.min(prev + 1, 20));
  }, []);

  const prevChapter = useCallback(() => {
    setCurrentChapter(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    currentChapter,
    goToChapter,
    nextChapter,
    prevChapter,
    isFirstChapter: currentChapter === 1,
    isLastChapter: currentChapter === 20,
  };
}
