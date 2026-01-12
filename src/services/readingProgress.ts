/**
 * Reading Progress Service
 * Tracks the user's reading progress through the book (highest chapter read).
 * This is separate from the chapter slider, which is used for visualization.
 */

const PROGRESS_KEY = 'solitude_reading_progress';

/**
 * Get the user's current reading progress (highest chapter read).
 * Defaults to chapter 1 if not set.
 */
export function getReadingProgress(): number {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
      return parsed;
    }
  }
  return 1;
}

/**
 * Set the user's reading progress to a specific chapter.
 * Only allows setting to chapters 1-20.
 */
export function setReadingProgress(chapter: number): void {
  if (chapter >= 1 && chapter <= 20) {
    localStorage.setItem(PROGRESS_KEY, chapter.toString());
  }
}

/**
 * Check if the user has finished the book (reached chapter 20).
 */
export function hasFinishedBook(): boolean {
  return getReadingProgress() >= 20;
}
