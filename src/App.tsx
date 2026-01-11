import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterModal } from './components/CharacterModal';
import { ChatPanel } from './components/Chat';
import { YellowButterflies, RainEffect, GoldenDust } from './components/MagicalEffects';
import { AmbientMusic } from './components/AmbientMusic';
import { BookPageFlip } from './components/BookPageFlip';
import { initializeGemini } from './services/gemini';
import { getRoomsAtChapter, getHouseDecayLevel, type Room } from './data/rooms';
import { characters, getCharacterStatus, chapters } from './data/characters';
import { chaptersData } from './data/chapters';
import type { Character } from './types';
import { RoomDetail } from './components/HouseNavigation/RoomDetail';
import { BookCharacterCard } from './components/BookCharacterCard';

// Initialize Gemini on app load
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (apiKey) {
  initializeGemini(apiKey);
  console.log('Gemini 3 initialized');
} else {
  console.warn('VITE_GEMINI_API_KEY not set - AI features will be disabled');
}

type ViewMode = 'intro' | 'book' | 'house';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('intro');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCharacterClick = useCallback((character: Character) => {
    setSelectedCharacter(character);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  // House exploration helpers
  const visibleRooms = useMemo(() => getRoomsAtChapter(currentChapter), [currentChapter]);
  const decayLevel = useMemo(() => getHouseDecayLevel(currentChapter), [currentChapter]);

  const getMoodColor = (mood: Room['mood']) => {
    switch (mood) {
      case 'warm': return '#B58900';
      case 'mysterious': return '#6C71C4';
      case 'melancholic': return '#268BD2';
      case 'magical': return '#2AA198';
      case 'decayed': return '#657B83';
      default: return '#B58900';
    }
  };

  const getCharactersInRoom = (room: Room): Character[] => {
    return characters.filter(char => {
      if (!room.characterIds.includes(char.id)) return false;
      const status = getCharacterStatus(char, currentChapter);
      return status !== 'not_born';
    });
  };

  // Magical effects
  const magicalEffects = useMemo(() => {
    const showButterflies = currentChapter >= 14 && currentChapter <= 17;
    const butterflyCount = currentChapter === 15 || currentChapter === 16 ? 12 : 6;
    const showRain = currentChapter === 15 || currentChapter === 16;
    const rainIntensity: 'light' | 'medium' | 'heavy' = currentChapter === 16 ? 'heavy' : 'medium';
    const dustCount = currentChapter <= 5 ? 25 : currentChapter >= 18 ? 10 : 15;
    return { showButterflies, butterflyCount, showRain, rainIntensity, dustCount };
  }, [currentChapter]);

  const moodColors: Record<string, string> = {
    hopeful: '#B58900',
    turbulent: '#DC322F',
    magical: '#268BD2',
    melancholic: '#657B83',
    apocalyptic: '#6C71C4',
  };

  return (
    <div className="min-h-screen bg-[#1A1410] overflow-hidden">
      {/* Magical Effects */}
      <GoldenDust count={magicalEffects.dustCount} active={true} />
      <YellowButterflies count={magicalEffects.butterflyCount} active={magicalEffects.showButterflies} />
      <RainEffect active={magicalEffects.showRain} intensity={magicalEffects.rainIntensity} />

      <AnimatePresence mode="wait">
        {/* ==================== INTRO SCREEN ==================== */}
        {viewMode === 'intro' && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ background: 'radial-gradient(ellipse at center, #2D2118 0%, #1A1410 70%)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm tracking-[0.3em] uppercase mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1' }}
              >
                An Interactive Experience
              </motion.p>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
                style={{ fontFamily: 'Playfair Display, serif', color: '#EEE8D5' }}
              >
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="block"
                >
                  One Hundred Years
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="block text-4xl md:text-5xl lg:text-6xl"
                  style={{ color: '#B58900' }}
                >
                  of Solitude
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-lg italic mb-12"
                style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
              >
                Gabriel Garcia Marquez
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                onClick={() => setViewMode('book')}
                className="px-8 py-4 rounded-lg cursor-pointer"
                style={{ backgroundColor: 'rgba(181, 137, 0, 0.2)', border: '2px solid #B58900' }}
                whileHover={{ backgroundColor: 'rgba(181, 137, 0, 0.3)', scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className="flex items-center gap-3 text-lg"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}
                >
                  <span className="text-2xl">📖</span>
                  Open the Book
                </span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-8 text-sm max-w-md mx-auto"
                style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
              >
                Read through chapters. Explore the house. Speak with the dead.
              </motion.p>
            </motion.div>
          </motion.section>
        )}

        {/* ==================== BOOK VIEW ==================== */}
        {viewMode === 'book' && (
          <motion.div
            key="book"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
            style={{ background: 'radial-gradient(ellipse at center, #2D2118 0%, #1A1410 100%)' }}
          >
            {/* Top Navigation */}
            <div className="flex justify-between items-center p-4 md:p-6">
              <button
                onClick={() => setViewMode('intro')}
                className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'Lora, serif', color: '#93A1A1', border: '1px solid #93A1A130' }}
              >
                ← Title
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('house')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ fontFamily: 'Lora, serif', color: '#B58900', border: '1px solid #B5890050' }}
                >
                  <span>🏠</span>
                  <span className="hidden md:inline">Explore House</span>
                </button>
              </div>
            </div>

            {/* Book Content with Page Flip */}
            <div className="flex-1 flex items-center justify-center px-4 relative" style={{ marginTop: '-80px' }}>
              {/* Chapter Navigation Dots - positioned above the book */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 'calc(50% - 330px)' }}>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => setCurrentChapter(num)}
                      className="w-2 h-2 rounded-full transition-all hover:scale-150"
                      style={{
                        backgroundColor: num === currentChapter ? '#B58900' : '#4A3728',
                        boxShadow: num === currentChapter ? '0 0 8px #B58900' : 'none',
                      }}
                      title={`Chapter ${num}`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full max-w-6xl flex justify-center">
                  {/* Book Page Flip Component */}
                <BookPageFlip
                  currentPage={currentChapter}
                  totalPages={20}
                  onPageChange={setCurrentChapter}
                  pages={chaptersData.map((chapterData) => {
                    const chapterNum = chapterData.number;
                    const introduced = characters.filter(c =>
                      chapterData.charactersIntroduced.includes(c.id)
                    );
                    const died = characters.filter(c =>
                      chapterData.charactersDied.includes(c.id)
                    );

                    return {
                      leftContent: (
                        <>
                          {/* Chapter Number */}
                          <div className="flex items-center gap-4 mb-6">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: `${moodColors[chapterData.mood || 'hopeful']}20`,
                                border: `2px solid ${moodColors[chapterData.mood || 'hopeful']}`,
                              }}
                            >
                              <span
                                className="text-xl font-bold"
                                style={{ fontFamily: 'Playfair Display, serif', color: moodColors[chapterData.mood || 'hopeful'] }}
                              >
                                {chapterNum}
                              </span>
                            </div>
                            <div>
                              <p
                                className="text-xs tracking-[0.15em] uppercase"
                                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1' }}
                              >
                                {chapterData.era}
                              </p>
                              <h2
                                className="text-2xl md:text-3xl font-bold"
                                style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                              >
                                {chapterData.title}
                              </h2>
                            </div>
                          </div>

                          {/* Quote */}
                          <blockquote
                            className="text-base md:text-lg italic border-l-4 pl-4 mb-6"
                            style={{
                              fontFamily: 'Lora, serif',
                              color: '#657B83',
                              borderColor: moodColors[chapterData.mood || 'hopeful'],
                            }}
                          >
                            "{chapterData.quote}"
                            {chapterData.quoteAttribution && (
                              <footer className="mt-2 text-sm not-italic" style={{ color: '#93A1A1' }}>
                                — {chapterData.quoteAttribution}
                              </footer>
                            )}
                          </blockquote>

                          {/* Summary */}
                          <p
                            className="text-sm md:text-base leading-relaxed mb-6"
                            style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                          >
                            {chapterData.summary}
                          </p>

                          {/* Key Events */}
                          <div className="mb-6">
                            <h3
                              className="text-xs tracking-[0.15em] uppercase mb-3"
                              style={{ fontFamily: 'Cormorant Garamond, serif', color: moodColors[chapterData.mood || 'hopeful'] }}
                            >
                              Key Events
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {chapterData.keyEvents.map((event, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 text-xs rounded-full"
                                  style={{
                                    fontFamily: 'Lora, serif',
                                    backgroundColor: `${moodColors[chapterData.mood || 'hopeful']}15`,
                                    color: '#586E75',
                                    border: `1px solid ${moodColors[chapterData.mood || 'hopeful']}30`,
                                  }}
                                >
                                  {event}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Themes */}
                          <p
                            className="text-xs"
                            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                          >
                            Themes: {chapterData.themes.join(' · ')}
                          </p>
                        </>
                      ),
                      rightContent: (
                        <div className="h-full flex flex-col relative">
                          {/* Scrollable content area */}
                          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-8" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(181, 137, 0, 0.25) transparent' }}>
                            {/* Characters Introduced */}
                            {introduced.length > 0 && (
                              <div className="mb-6">
                                <h3
                                  className="text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#B58900' }}
                                >
                                  <span className="w-8 h-px bg-[#B58900]" />
                                  Characters Introduced
                                  <span className="w-8 h-px bg-[#B58900]" />
                                </h3>
                                <div className="space-y-4">
                                  {introduced.map((char, index) => (
                                    <BookCharacterCard
                                      key={char.id}
                                      character={char}
                                      isDeceased={false}
                                      onClick={() => handleCharacterClick(char)}
                                      delay={index * 0.1}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Characters Who Died */}
                            {died.length > 0 && (
                              <div className="mb-6">
                                <h3
                                  className="text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#268BD2' }}
                                >
                                  <span className="w-8 h-px bg-[#268BD2]" />
                                  Departed This Chapter
                                  <span className="w-8 h-px bg-[#268BD2]" />
                                </h3>
                                <div className="space-y-4">
                                  {died.map((char, index) => (
                                    <BookCharacterCard
                                      key={char.id}
                                      character={char}
                                      isDeceased={true}
                                      onClick={() => handleCharacterClick(char)}
                                      delay={index * 0.1 + 0.3}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* No characters message */}
                            {introduced.length === 0 && died.length === 0 && (
                              <div className="h-full flex flex-col items-center justify-center py-12">
                                <div className="text-4xl mb-4 opacity-30">📖</div>
                                <p
                                  className="text-center italic text-lg mb-2"
                                  style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                                >
                                  The story continues...
                                </p>
                                <p
                                  className="text-center text-sm"
                                  style={{ fontFamily: 'Lora, serif', color: '#B5890080' }}
                                >
                                  No new characters appear in this chapter
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Fixed page number at bottom */}
                          <div
                            className="absolute bottom-0 right-0 py-1 px-2"
                            style={{
                              background: 'linear-gradient(to top, #F8F2E4 0%, #F8F2E4 60%, transparent 100%)',
                            }}
                          >
                            <span
                              className="text-sm"
                              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1' }}
                            >
                              {chapterNum} / 20
                            </span>
                          </div>
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== HOUSE VIEW ==================== */}
        {viewMode === 'house' && (
          <motion.div
            key="house"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
            style={{ background: 'radial-gradient(ellipse at center, #2D2118 0%, #1A1410 100%)' }}
          >
            {/* Top Navigation */}
            <div className="flex justify-between items-center p-4 md:p-6">
              <button
                onClick={() => setViewMode('book')}
                className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'Lora, serif', color: '#93A1A1', border: '1px solid #93A1A130' }}
              >
                ← Back to Book
              </button>

              <div className="text-center">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}
                >
                  La Casa de los Buendia
                </h2>
                <p
                  className="text-xs"
                  style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                >
                  Chapter {currentChapter} · {chapters.find(c => c.number === currentChapter)?.yearRange}
                </p>
              </div>

              <div className="w-24" /> {/* Spacer for centering */}
            </div>

            {/* House Floor Plan */}
            <div className="flex-1 flex items-center justify-center px-4 pb-32">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
                style={{
                  width: '85vw',
                  maxWidth: '800px',
                  height: '60vh',
                  maxHeight: '550px',
                  filter: `sepia(${decayLevel * 0.5}) contrast(${1 - decayLevel * 0.2})`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: '#2D2118',
                    border: `3px solid ${decayLevel > 0.5 ? '#4A3728' : '#B58900'}`,
                    boxShadow: `inset 0 0 60px rgba(0,0,0,0.5), 0 0 40px rgba(181,137,0,${0.3 - decayLevel * 0.2})`,
                  }}
                >
                  {/* Rooms */}
                  {visibleRooms.map((room) => {
                    const isHovered = hoveredRoom === room.id;
                    const roomCharacters = getCharactersInRoom(room);
                    const hasGhosts = roomCharacters.some(c => getCharacterStatus(c, currentChapter) === 'deceased');

                    return (
                      <motion.div
                        key={room.id}
                        className="absolute cursor-pointer rounded-sm overflow-hidden"
                        style={{
                          left: `${room.position.x}%`,
                          top: `${room.position.y}%`,
                          width: `${room.position.width}%`,
                          height: `${room.position.height}%`,
                          backgroundColor: isHovered ? `${getMoodColor(room.mood)}30` : '#1A1410',
                          border: `2px solid ${isHovered ? getMoodColor(room.mood) : hasGhosts ? '#268BD250' : '#4A372850'}`,
                          boxShadow: isHovered ? `0 0 20px ${getMoodColor(room.mood)}40` : 'none',
                        }}
                        onClick={() => setSelectedRoom(room)}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="p-2 h-full flex flex-col">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ fontFamily: 'Playfair Display, serif', color: isHovered ? getMoodColor(room.mood) : '#B58900' }}
                          >
                            {room.spanishName}
                          </p>
                          <div className="flex-1 flex items-center justify-center gap-1 flex-wrap mt-1">
                            {roomCharacters.slice(0, 3).map((char) => {
                              const isGhost = getCharacterStatus(char, currentChapter) === 'deceased';
                              return (
                                <motion.div
                                  key={char.id}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                  style={{
                                    backgroundColor: isGhost ? 'rgba(38,139,210,0.3)' : 'rgba(181,137,0,0.3)',
                                    border: `1px solid ${isGhost ? '#268BD2' : '#B58900'}`,
                                  }}
                                  animate={isGhost ? { opacity: [0.4, 0.7, 0.4] } : {}}
                                  transition={isGhost ? { duration: 2, repeat: Infinity } : {}}
                                >
                                  {isGhost ? '👻' : char.name.charAt(0)}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Courtyard tree */}
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{ left: '45%', top: '42%', fontSize: '2rem', filter: `grayscale(${decayLevel * 0.8})` }}
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    🌳
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Time Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-5 rounded-xl z-40"
              style={{ backgroundColor: 'rgba(29,21,16,0.95)', border: '1px solid #B5890050' }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="text-center">
                  <p className="text-xs uppercase" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1' }}>
                    {chapters.find(c => c.number === currentChapter)?.title}
                  </p>
                  <p className="text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}>
                    {chapters.find(c => c.number === currentChapter)?.yearRange}
                  </p>
                </div>
                <div className="relative w-72">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#4A3728' }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full transition-all"
                    style={{ width: `${((currentChapter - 1) / 19) * 100}%`, backgroundColor: '#B58900' }}
                  />
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={currentChapter}
                    onChange={(e) => setCurrentChapter(parseInt(e.target.value))}
                    className="relative w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
                  />
                </div>
              </div>
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #B58900;
                  border: 2px solid #FDF6E3;
                  cursor: pointer;
                }
              `}</style>
            </motion.div>
          </motion.div>
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
