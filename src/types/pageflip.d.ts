/**
 * Type definitions for react-pageflip ref API
 * The library exports types but the ref API methods are not fully typed
 */

/**
 * PageFlip controller interface - methods available on bookRef.current.pageFlip()
 */
export interface PageFlipController {
  /** Flip to the next page */
  flipNext(corner?: 'top' | 'bottom'): void;
  /** Flip to the previous page */
  flipPrev(corner?: 'top' | 'bottom'): void;
  /** Flip to a specific page by index */
  flip(pageIndex: number, corner?: 'top' | 'bottom'): void;
  /** Turn to a specific page without animation */
  turnToPage(pageIndex: number): void;
  /** Turn to the next page without animation */
  turnToNextPage(): void;
  /** Turn to the previous page without animation */
  turnToPrevPage(): void;
  /** Get current page index */
  getCurrentPageIndex(): number;
  /** Get page count */
  getPageCount(): number;
  /** Get current orientation */
  getOrientation(): 'portrait' | 'landscape';
  /** Get current book state */
  getState(): 'user_fold' | 'fold_corner' | 'flipping' | 'read';
  /** Load pages from images */
  loadFromImages(images: string[]): void;
  /** Load pages from HTML elements */
  loadFromHTML(elements: HTMLElement[]): void;
  /** Update book state */
  updateState(newState: Partial<{ page: number }>): void;
  /** Destroy the book instance */
  destroy(): void;
}

/**
 * HTMLFlipBook ref interface
 */
export interface HTMLFlipBookRef {
  /** Get the PageFlip controller */
  pageFlip(): PageFlipController;
}
