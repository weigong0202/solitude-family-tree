import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoomsAtChapter, getHouseDecayLevel, type Room } from '../../data/rooms';
import { characters, getCharacterStatus, chapters } from '../../data/characters';
import type { Character } from '../../types';
import { RoomDetail } from './RoomDetail';

interface HouseNavigationProps {
  currentChapter: number;
  isOpen: boolean;
  onToggle: () => void;
  onCharacterClick: (character: Character) => void;
  onChapterChange?: (chapter: number) => void;
}

export function HouseNavigation({
  currentChapter,
  isOpen,
  onToggle,
  onCharacterClick,
  onChapterChange,
}: HouseNavigationProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const visibleRooms = useMemo(
    () => getRoomsAtChapter(currentChapter),
    [currentChapter]
  );

  const decayLevel = useMemo(
    () => getHouseDecayLevel(currentChapter),
    [currentChapter]
  );

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

  return (
    <>
      {/* Toggle Button - House Icon */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: '#FDF6E3',
          border: '2px solid #B58900',
          boxShadow: '0 4px 20px rgba(181, 137, 0, 0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Explore the House"
      >
        <span className="text-2xl">🏠</span>
      </motion.button>

      {/* Full Screen House View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onToggle}
              className="absolute top-6 right-6 text-3xl z-50"
              style={{ color: '#FDF6E3' }}
            >
              ×
            </button>

            {/* Title */}
            <div className="absolute top-6 left-6 z-50">
              <h2
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#B58900',
                }}
              >
                La Casa de los Buendía
              </h2>
              <p
                className="text-sm mt-1"
                style={{
                  fontFamily: 'Lora, serif',
                  color: '#93A1A1',
                  fontStyle: 'italic',
                }}
              >
                Chapter {currentChapter} • {Math.round(decayLevel * 100)}% decay
              </p>
            </div>

            {/* The House Floor Plan */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
              style={{
                width: '80vw',
                maxWidth: '800px',
                height: '70vh',
                maxHeight: '600px',
                filter: `sepia(${decayLevel * 0.5}) contrast(${1 - decayLevel * 0.2})`,
              }}
            >
              {/* House outline */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: '#2D2118',
                  border: `3px solid ${decayLevel > 0.5 ? '#4A3728' : '#B58900'}`,
                  boxShadow: `
                    inset 0 0 60px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(181, 137, 0, ${0.3 - decayLevel * 0.2})
                  `,
                }}
              >
                {/* Decorative roof lines */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-3/4 h-8"
                  style={{
                    background: 'linear-gradient(to bottom, #4A3728, transparent)',
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  }}
                />

                {/* Rooms */}
                {visibleRooms.map((room) => {
                  const isHovered = hoveredRoom === room.id;
                  const isSelected = selectedRoom?.id === room.id;
                  const roomCharacters = getCharactersInRoom(room);
                  const hasGhosts = roomCharacters.some(
                    c => getCharacterStatus(c, currentChapter) === 'deceased'
                  );

                  return (
                    <motion.div
                      key={room.id}
                      className="absolute cursor-pointer rounded-sm overflow-hidden"
                      style={{
                        left: `${room.position.x}%`,
                        top: `${room.position.y}%`,
                        width: `${room.position.width}%`,
                        height: `${room.position.height}%`,
                        backgroundColor: isHovered || isSelected
                          ? `${getMoodColor(room.mood)}30`
                          : '#1A1410',
                        border: `2px solid ${
                          isHovered || isSelected
                            ? getMoodColor(room.mood)
                            : hasGhosts
                            ? '#268BD250'
                            : '#4A372850'
                        }`,
                        boxShadow: isHovered || isSelected
                          ? `0 0 20px ${getMoodColor(room.mood)}40, inset 0 0 30px ${getMoodColor(room.mood)}20`
                          : hasGhosts
                          ? 'inset 0 0 20px rgba(38, 139, 210, 0.1)'
                          : 'none',
                      }}
                      onClick={() => setSelectedRoom(room)}
                      onMouseEnter={() => setHoveredRoom(room.id)}
                      onMouseLeave={() => setHoveredRoom(null)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Room content */}
                      <div className="p-2 h-full flex flex-col">
                        {/* Room name */}
                        <p
                          className="text-xs font-semibold truncate"
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            color: isHovered || isSelected
                              ? getMoodColor(room.mood)
                              : '#B58900',
                          }}
                        >
                          {room.spanishName}
                        </p>

                        {/* Character indicators */}
                        <div className="flex-1 flex items-center justify-center gap-1 flex-wrap mt-1">
                          {roomCharacters.slice(0, 3).map((char) => {
                            const status = getCharacterStatus(char, currentChapter);
                            const isGhost = status === 'deceased';

                            return (
                              <motion.div
                                key={char.id}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                style={{
                                  backgroundColor: isGhost
                                    ? 'rgba(38, 139, 210, 0.3)'
                                    : 'rgba(181, 137, 0, 0.3)',
                                  border: `1px solid ${isGhost ? '#268BD2' : '#B58900'}`,
                                  opacity: isGhost ? 0.6 : 1,
                                }}
                                animate={
                                  isGhost
                                    ? { opacity: [0.4, 0.7, 0.4] }
                                    : {}
                                }
                                transition={
                                  isGhost
                                    ? { duration: 2, repeat: Infinity }
                                    : {}
                                }
                                title={char.name}
                              >
                                {isGhost ? '👻' : char.name.charAt(0)}
                              </motion.div>
                            );
                          })}
                          {roomCharacters.length > 3 && (
                            <span
                              className="text-xs"
                              style={{ color: '#93A1A1' }}
                            >
                              +{roomCharacters.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Object hints */}
                        {room.objects.length > 0 && (
                          <div className="mt-auto">
                            <span
                              className="text-[10px] opacity-60"
                              style={{
                                fontFamily: 'Lora, serif',
                                color: '#93A1A1',
                              }}
                            >
                              {room.objects.length} object{room.objects.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Decay overlay */}
                      {decayLevel > 0.3 && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 10px,
                              rgba(0, 0, 0, ${decayLevel * 0.2}) 10px,
                              rgba(0, 0, 0, ${decayLevel * 0.2}) 20px
                            )`,
                            opacity: decayLevel,
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}

                {/* Central courtyard tree */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: '45%',
                    top: '42%',
                    fontSize: '2rem',
                    filter: `grayscale(${decayLevel * 0.8})`,
                  }}
                  animate={{
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🌳
                </motion.div>
              </div>

              {/* Legend */}
              <div
                className="absolute -bottom-16 left-0 right-0 flex justify-center gap-6 text-xs"
                style={{
                  fontFamily: 'Lora, serif',
                  color: '#93A1A1',
                }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#B58900' }}
                  />
                  Living
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#268BD2' }}
                  />
                  Ghost
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'repeating-linear-gradient(45deg, #657B83, #657B83 2px, transparent 2px, transparent 4px)',
                    }}
                  />
                  Decaying
                </span>
              </div>
            </motion.div>

            {/* Time Slider */}
            {onChapterChange && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl"
                style={{
                  backgroundColor: 'rgba(29, 21, 16, 0.95)',
                  border: '1px solid #B5890050',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
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
                      {chapters.find(c => c.number === currentChapter)?.title || 'The Story Begins'}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{
                        fontFamily: 'Lora, serif',
                        color: '#657B83',
                        fontStyle: 'italic',
                      }}
                    >
                      {chapters.find(c => c.number === currentChapter)?.yearRange || '~1820s'}
                    </p>
                  </div>

                  {/* Slider */}
                  <div className="relative w-64">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full"
                      style={{ backgroundColor: '#4A3728' }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full transition-all"
                      style={{
                        width: `${((currentChapter - 1) / 19) * 100}%`,
                        backgroundColor: '#B58900',
                      }}
                    />
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={currentChapter}
                      onChange={(e) => onChapterChange(parseInt(e.target.value))}
                      className="relative w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
                    />
                  </div>

                  {/* Era labels */}
                  <div className="flex justify-between w-64 text-[10px]" style={{ color: '#657B83' }}>
                    <span>1820s</span>
                    <span>1920s</span>
                    <span>1970s</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 text-center text-sm"
              style={{
                fontFamily: 'Lora, serif',
                color: '#657B83',
                fontStyle: 'italic',
              }}
            >
              Click a room to explore its secrets and inhabitants
            </motion.p>
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
            onCharacterClick={onCharacterClick}
          />
        )}
      </AnimatePresence>
    </>
  );
}
