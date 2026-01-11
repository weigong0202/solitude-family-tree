import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CharacterModal } from './components/CharacterModal';
import { ChatPanel } from './components/Chat';
import { YellowButterflies, RainEffect, GoldenDust } from './components/MagicalEffects';
import { AmbientMusic } from './components/AmbientMusic';
import { initializeGemini } from './services/gemini';
import { type Room } from './data/rooms';
import { RoomDetail } from './components/HouseNavigation/RoomDetail';
import type { Character } from './types';
import {
  IntroView,
  BookView,
  HouseView,
  FamilyTreeView,
  VisionsView,
} from './views';

// Initialize Gemini on app load
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (apiKey) {
  initializeGemini(apiKey);
  console.log('Gemini 3 initialized');
} else {
  console.warn('VITE_GEMINI_API_KEY not set - AI features will be disabled');
}

type ViewMode = 'intro' | 'book' | 'house' | 'familyTree' | 'visions';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCharacterClick = useCallback((character: Character) => {
    setSelectedCharacter(character);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handleRoomClick = useCallback((room: Room) => {
    setSelectedRoom(room);
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
            onCharacterClick={handleCharacterClick}
            onNavigate={handleNavigate}
          />
        )}

        {viewMode === 'house' && (
          <HouseView
            currentChapter={currentChapter}
            onChapterChange={setCurrentChapter}
            onRoomClick={handleRoomClick}
            onNavigate={handleNavigate}
          />
        )}

        {viewMode === 'familyTree' && (
          <FamilyTreeView
            onCharacterClick={handleCharacterClick}
            onNavigate={handleNavigate}
          />
        )}

        {viewMode === 'visions' && (
          <VisionsView onNavigate={handleNavigate} />
        )}
      </AnimatePresence>

      {/* Room Detail Panel */}
      <AnimatePresence>
        {selectedRoom && (
          <RoomDetail
            room={selectedRoom}
            currentChapter={currentChapter}
            onClose={() => setSelectedRoom(null)}
            onCharacterClick={handleCharacterClick}
          />
        )}
      </AnimatePresence>

      {/* Character Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          currentChapter={currentChapter}
          onClose={handleCloseModal}
        />
      )}

      {/* Chat Panel */}
      <ChatPanel
        currentChapter={currentChapter}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Ambient Music */}
      <AmbientMusic currentChapter={currentChapter} />
    </div>
  );
}

export default App;
