import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CharacterModal } from './components/CharacterModal';
import { YellowButterflies, RainEffect, GoldenDust } from './components/MagicalEffects';
import { AmbientMusic } from './components/AmbientMusic';
import { initializeGemini } from './services/gemini';
import type { Character } from './types';
import {
  IntroView,
  BookView,
  FamilyTreeView,
  VisionsView,
} from './views';
import { FINAL_CHAPTER } from './data/characters';

// Initialize Gemini on app load
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (apiKey) {
  initializeGemini(apiKey);
  console.log('Gemini 3 initialized');
} else {
  console.warn('VITE_GEMINI_API_KEY not set - AI features will be disabled');
}

type ViewMode = 'intro' | 'book' | 'familyTree' | 'visions';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalSourceView, setModalSourceView] = useState<ViewMode | null>(null);

  const handleCharacterClick = useCallback((character: Character, sourceView: ViewMode) => {
    setSelectedCharacter(character);
    setModalSourceView(sourceView);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handleNavigate = useCallback((view: ViewMode) => {
    setViewMode(view);
  }, []);

  // Magical effects based on current chapter
  const magicalEffects = useMemo(() => {
    const showButterflies = currentChapter >= 14 && currentChapter <= 17;
    const butterflyCount = currentChapter === 15 || currentChapter === 16 ? 12 : 6;
    const showRain = currentChapter === 15 || currentChapter === 16;
    const rainIntensity: 'light' | 'medium' | 'heavy' = currentChapter === 16 ? 'heavy' : 'medium';
    const dustCount = currentChapter <= 5 ? 25 : currentChapter >= 18 ? 10 : 15;
    return { showButterflies, butterflyCount, showRain, rainIntensity, dustCount };
  }, [currentChapter]);

  return (
    <div className="min-h-screen bg-[#1A1410] overflow-hidden">
      {/* Magical Effects */}
      <GoldenDust count={magicalEffects.dustCount} active={true} />
      <YellowButterflies count={magicalEffects.butterflyCount} active={magicalEffects.showButterflies} />
      <RainEffect active={magicalEffects.showRain} intensity={magicalEffects.rainIntensity} />

      <AnimatePresence mode="wait">
        {viewMode === 'intro' && (
          <IntroView onEnterBook={() => setViewMode('book')} />
        )}

        {viewMode === 'book' && (
          <BookView
            currentChapter={currentChapter}
            onChapterChange={setCurrentChapter}
            onCharacterClick={(char) => handleCharacterClick(char, 'book')}
            onNavigate={handleNavigate}
          />
        )}

        {viewMode === 'familyTree' && (
          <FamilyTreeView
            onCharacterClick={(char) => handleCharacterClick(char, 'familyTree')}
            onNavigate={handleNavigate}
          />
        )}

        {viewMode === 'visions' && (
          <VisionsView onNavigate={handleNavigate} />
        )}
      </AnimatePresence>

      {/* Character Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          currentChapter={modalSourceView === 'familyTree' ? FINAL_CHAPTER : currentChapter}
          onClose={handleCloseModal}
        />
      )}

      {/* Ambient Music */}
      <AmbientMusic currentChapter={currentChapter} />
    </div>
  );
}

export default App;
