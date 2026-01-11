import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRoomsAtChapter, getHouseDecayLevel, type Room } from '../data/rooms';
import { characters, getCharacterStatus, chapters } from '../data/characters';
import type { Character } from '../types';
import { colors, fonts, gradients, borders } from '../constants/theme';

type ViewMode = 'intro' | 'book' | 'house' | 'familyTree' | 'visions';

interface HouseViewProps {
  currentChapter: number;
  onChapterChange: (chapter: number) => void;
  onRoomClick: (room: Room) => void;
  onNavigate: (view: ViewMode) => void;
}

// Get mood color for rooms
function getMoodColor(mood: Room['mood']): string {
  switch (mood) {
    case 'warm': return colors.gold;
    case 'mysterious': return colors.purple;
    case 'melancholic': return colors.blue;
    case 'magical': return colors.teal;
    case 'decayed': return colors.textSecondary;
    default: return colors.gold;
  }
}

// Get characters currently in a room
function getCharactersInRoom(room: Room, currentChapter: number): Character[] {
  return characters.filter(char => {
    if (!room.characterIds.includes(char.id)) return false;
    const status = getCharacterStatus(char, currentChapter);
    return status !== 'not_born';
  });
}

export function HouseView({
  currentChapter,
  onChapterChange,
  onRoomClick,
  onNavigate,
}: HouseViewProps) {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // House exploration helpers
  const visibleRooms = useMemo(() => getRoomsAtChapter(currentChapter), [currentChapter]);
  const decayLevel = useMemo(() => getHouseDecayLevel(currentChapter), [currentChapter]);

  const currentChapterInfo = chapters.find(c => c.number === currentChapter);

  return (
    <motion.div
      key="house"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
      style={{ background: gradients.darkRadial }}
    >
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 md:p-6">
        <button
          onClick={() => onNavigate('book')}
          className="text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.textMuted, border: borders.subtle }}
        >
          ← Back to Book
        </button>

        <div className="text-center">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: fonts.heading, color: colors.gold }}
          >
            La Casa de los Buendia
          </h2>
          <p
            className="text-xs"
            style={{ fontFamily: fonts.body, color: colors.textMuted }}
          >
            Chapter {currentChapter} · {currentChapterInfo?.yearRange}
          </p>
        </div>

        <button
          onClick={() => onNavigate('familyTree')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ fontFamily: fonts.body, color: colors.teal, border: borders.teal }}
        >
          <span>🌳</span>
          <span className="hidden md:inline">Family Tree</span>
        </button>
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
              backgroundColor: colors.background,
              border: `3px solid ${decayLevel > 0.5 ? colors.backgroundBrown : colors.gold}`,
              boxShadow: `inset 0 0 60px rgba(0,0,0,0.5), 0 0 40px ${colors.withAlpha(colors.gold, 0.3 - decayLevel * 0.2)}`,
            }}
          >
            {/* Rooms */}
            {visibleRooms.map((room) => {
              const isHovered = hoveredRoom === room.id;
              const roomCharacters = getCharactersInRoom(room, currentChapter);
              const hasGhosts = roomCharacters.some(c => getCharacterStatus(c, currentChapter) === 'deceased');
              const moodColor = getMoodColor(room.mood);

              return (
                <motion.div
                  key={room.id}
                  className="absolute cursor-pointer rounded-sm overflow-hidden"
                  style={{
                    left: `${room.position.x}%`,
                    top: `${room.position.y}%`,
                    width: `${room.position.width}%`,
                    height: `${room.position.height}%`,
                    backgroundColor: isHovered ? colors.withAlpha(moodColor, 0.3) : colors.backgroundDark,
                    border: `2px solid ${isHovered ? moodColor : hasGhosts ? colors.withAlpha(colors.blue, 0.5) : colors.withAlpha(colors.backgroundBrown, 0.5)}`,
                    boxShadow: isHovered ? `0 0 20px ${colors.withAlpha(moodColor, 0.4)}` : 'none',
                  }}
                  onClick={() => onRoomClick(room)}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 h-full flex flex-col">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ fontFamily: fonts.heading, color: isHovered ? moodColor : colors.gold }}
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
                              backgroundColor: isGhost ? colors.withAlpha(colors.blue, 0.3) : colors.withAlpha(colors.gold, 0.3),
                              border: `1px solid ${isGhost ? colors.blue : colors.gold}`,
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
        style={{ backgroundColor: 'rgba(29,21,16,0.95)', border: borders.gold }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-xs uppercase" style={{ fontFamily: fonts.accent, color: colors.textMuted }}>
              {currentChapterInfo?.title}
            </p>
            <p className="text-lg font-medium" style={{ fontFamily: fonts.heading, color: colors.gold }}>
              {currentChapterInfo?.yearRange}
            </p>
          </div>
          <div className="relative w-72">
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full"
              style={{ backgroundColor: colors.backgroundBrown }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full transition-all"
              style={{ width: `${((currentChapter - 1) / 19) * 100}%`, backgroundColor: colors.gold }}
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
        </div>
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${colors.gold};
            border: 2px solid ${colors.cream};
            cursor: pointer;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
