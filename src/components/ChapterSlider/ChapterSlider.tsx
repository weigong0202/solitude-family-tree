import { motion } from 'framer-motion';
import { chapters } from '../../data/characters';

interface ChapterSliderProps {
  currentChapter: number;
  onChapterChange: (chapter: number) => void;
}

export function ChapterSlider({ currentChapter, onChapterChange }: ChapterSliderProps) {
  const currentChapterInfo = chapters.find(c => c.number === currentChapter);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      {/* Chapter info */}
      <div className="text-center mb-4">
        <motion.div
          key={currentChapter}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-medium text-amber-700">
            Chapter {currentChapter} of 20
          </span>
          <h3 className="text-lg font-serif text-gray-800 mt-1">
            {currentChapterInfo?.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentChapterInfo?.yearRange}
          </p>
        </motion.div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={1}
          max={20}
          value={currentChapter}
          onChange={(e) => onChapterChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #fbbf24 0%, #d97706 ${(currentChapter - 1) / 19 * 100}%, #e5e7eb ${(currentChapter - 1) / 19 * 100}%, #e5e7eb 100%)`
          }}
        />

        {/* Chapter markers */}
        <div className="flex justify-between mt-2 px-1">
          {[1, 5, 10, 15, 20].map(chapter => (
            <button
              key={chapter}
              onClick={() => onChapterChange(chapter)}
              className={`text-xs transition-colors ${
                currentChapter >= chapter
                  ? 'text-amber-700 font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {chapter}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => onChapterChange(Math.max(1, currentChapter - 1))}
          disabled={currentChapter === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onChapterChange(Math.min(20, currentChapter + 1))}
          disabled={currentChapter === 20}
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Chapter
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <span className="font-medium text-amber-700">{Math.round((currentChapter / 20) * 100)}%</span>
        {' '}through the story
      </div>
    </div>
  );
}
