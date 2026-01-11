import { motion } from 'framer-motion';
import { chapters } from '../../data/characters';

interface TimeSliderProps {
  currentChapter: number;
  onChange: (chapter: number) => void;
}

export function TimeSlider({ currentChapter, onChange }: TimeSliderProps) {
  const currentChapterData = chapters.find(c => c.number === currentChapter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-4 rounded-xl"
      style={{
        backgroundColor: 'rgba(29, 21, 16, 0.95)',
        border: '1px solid #B5890050',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Current chapter display */}
        <div className="text-center">
          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#93A1A1',
            }}
          >
            Chapter {currentChapter}
          </p>
          <p
            className="text-sm font-medium"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#B58900',
            }}
          >
            {currentChapterData?.title || 'The Story Begins'}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: 'Lora, serif',
              color: '#657B83',
              fontStyle: 'italic',
            }}
          >
            {currentChapterData?.yearRange || '~1820s'}
          </p>
        </div>

        {/* Slider */}
        <div className="relative w-64">
          {/* Track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full"
            style={{
              backgroundColor: '#4A3728',
            }}
          />
          {/* Progress */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full"
            style={{
              width: `${((currentChapter - 1) / 19) * 100}%`,
              backgroundColor: '#B58900',
            }}
          />
          {/* Input */}
          <input
            type="range"
            min={1}
            max={20}
            value={currentChapter}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="relative w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
            style={{
              WebkitAppearance: 'none',
            }}
          />
        </div>

        {/* Era labels */}
        <div className="flex justify-between w-64 text-[10px]" style={{ color: '#657B83' }}>
          <span>1820s</span>
          <span>1920s</span>
          <span>1970s</span>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #B58900;
          border: 2px solid #FDF6E3;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #B58900;
          border: 2px solid #FDF6E3;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.div>
  );
}
