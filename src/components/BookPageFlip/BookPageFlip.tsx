import { forwardRef, useRef, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import HTMLFlipBook from 'react-pageflip';
import type { HTMLFlipBookRef } from '../../types/pageflip';

interface PageProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Page component must be wrapped with forwardRef for react-pageflip
const Page = forwardRef<HTMLDivElement, PageProps>(({ children, className, style }, ref) => {
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
});

Page.displayName = 'Page';

interface BookPageFlipProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pages: Array<{
    leftContent: ReactNode;
    rightContent: ReactNode;
  }>;
}

export function BookPageFlip({
  currentPage,
  onPageChange,
  pages,
}: BookPageFlipProps) {
  const bookRef = useRef<HTMLFlipBookRef>(null);
  // Store initial page only once to prevent re-render from interrupting animations
  const [initialPage] = useState(() => Math.max(0, (currentPage - 1) * 2));

  const handleFlip = useCallback((e: { data: number }) => {
    const newChapter = Math.floor(e.data / 2) + 1;
    onPageChange(newChapter);
  }, [onPageChange]);

  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="book-container">
      {/* Previous Button - Left Side */}
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className="nav-btn nav-btn-left"
        aria-label="Previous Chapter"
      >
        <span>←</span>
      </button>

      {/* Book with flip effect */}
      <div className="book-wrapper">
        <HTMLFlipBook
          ref={bookRef}
          width={480}
          height={600}
          size="fixed"
          minWidth={480}
          maxWidth={480}
          minHeight={600}
          maxHeight={600}
          drawShadow={true}
          flippingTime={800}
          usePortrait={false}
          startPage={initialPage}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={true}
          onFlip={handleFlip}
          className="book-flip"
          style={{}}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={true}
        >
          {pages.flatMap((page, index) => [
            // Left Page
            <Page key={`left-${index}`} className="book-page book-page-left">
              <div className="page-inner">
                {page.leftContent}
              </div>
            </Page>,
            // Right Page
            <Page key={`right-${index}`} className="book-page book-page-right">
              <div className="page-inner">
                {page.rightContent}
              </div>
            </Page>,
          ])}
        </HTMLFlipBook>
      </div>

      {/* Next Button - Right Side */}
      <button
        onClick={goToNextPage}
        disabled={currentPage === pages.length}
        className="nav-btn nav-btn-right"
        aria-label="Next Chapter"
      >
        <span>→</span>
      </button>

      <style>{`
        .book-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0 1rem;
          gap: 1.5rem;
          position: relative;
        }

        .book-wrapper {
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .book-flip {
          box-shadow:
            0 0 20px rgba(0, 0, 0, 0.3),
            0 20px 50px rgba(0, 0, 0, 0.4);
          border-radius: 0 8px 8px 0;
          overflow: hidden;
        }

        .book-page {
          background: linear-gradient(to right, #F5EFE0 0%, #FDF8ED 15%, #FDF8ED 100%);
          position: relative;
          overflow: hidden;
        }

        .book-page-left {
          background: linear-gradient(to left, #EDE7D8 0%, #F8F2E4 10%, #FDF8ED 100%);
          box-shadow: inset -15px 0 25px -10px rgba(0, 0, 0, 0.08);
        }

        .book-page-right {
          background: linear-gradient(to right, #EDE7D8 0%, #F8F2E4 10%, #FDF8ED 100%);
          box-shadow: inset 15px 0 25px -10px rgba(0, 0, 0, 0.05);
        }

        .page-inner {
          padding: 30px 35px;
          height: 100%;
          max-height: 600px;
          overflow-y: auto;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .book-page-left .page-inner {
          padding-right: 30px;
          padding-left: 45px;
        }

        .book-page-right .page-inner {
          padding-left: 30px;
          padding-right: 45px;
        }

        /* Custom scrollbar styling */
        .page-inner::-webkit-scrollbar {
          width: 6px;
        }

        .page-inner::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 3px;
        }

        .page-inner::-webkit-scrollbar-thumb {
          background: rgba(181, 137, 0, 0.25);
          border-radius: 3px;
        }

        .page-inner::-webkit-scrollbar-thumb:hover {
          background: rgba(181, 137, 0, 0.4);
        }

        /* Firefox scrollbar */
        .page-inner {
          scrollbar-width: thin;
          scrollbar-color: rgba(181, 137, 0, 0.25) transparent;
        }

        /* Subtle paper texture */
        .book-page::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Navigation */
        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(181, 137, 0, 0.3);
          background: rgba(253, 246, 227, 0.9);
          color: #B58900;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(181, 137, 0, 0.15);
          transform: scale(1.1);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Override react-pageflip internal styles */
        .stf__parent {
          background: transparent !important;
        }

        .stf__block {
          background: transparent !important;
        }

        /* Add solid background to page wrappers for backward flip */
        .stf__item > div {
          background-color: #F5EFE0;
        }

        /* Make the flipping page look more solid */
        .stf__item {
          background: linear-gradient(to right, #F5EFE0 0%, #FDF8ED 100%);
        }

      `}</style>
    </div>
  );
}
