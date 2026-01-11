import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Room, RoomObject } from '../../data/rooms';
import { characters, getCharacterStatus } from '../../data/characters';
import type { Character } from '../../types';
import { chatWithGemini } from '../../services/gemini';

interface RoomDetailProps {
  room: Room;
  currentChapter: number;
  onClose: () => void;
  onCharacterClick: (character: Character) => void;
}

export function RoomDetail({
  room,
  currentChapter,
  onClose,
  onCharacterClick,
}: RoomDetailProps) {
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [objectStory, setObjectStory] = useState<string>('');
  const [isLoadingStory, setIsLoadingStory] = useState(false);

  const roomCharacters = characters.filter(char => {
    if (!room.characterIds.includes(char.id)) return false;
    const status = getCharacterStatus(char, currentChapter);
    return status !== 'not_born';
  });

  const handleObjectClick = async (object: RoomObject) => {
    setSelectedObject(object);
    setObjectStory('');
    setIsLoadingStory(true);

    try {
      const prompt = `${object.storyPrompt}

The reader is currently at Chapter ${currentChapter}.
IMPORTANT: Only discuss events from chapters 1-${currentChapter}. Never reveal future events or deaths that occur after this chapter.
Keep the response atmospheric and evocative, in the style of magical realism. 2-3 paragraphs maximum.`;

      const response = await chatWithGemini(prompt, currentChapter);
      setObjectStory(response);
    } catch (error) {
      setObjectStory('The memories of this object remain shrouded in mystery...');
    } finally {
      setIsLoadingStory(false);
    }
  };

  const getMoodGradient = () => {
    switch (room.mood) {
      case 'warm':
        return 'linear-gradient(135deg, #2D2118 0%, #3D2B1C 100%)';
      case 'mysterious':
        return 'linear-gradient(135deg, #1A1A2E 0%, #2D2118 100%)';
      case 'melancholic':
        return 'linear-gradient(135deg, #1A2634 0%, #2D2118 100%)';
      case 'magical':
        return 'linear-gradient(135deg, #1A2A2A 0%, #2D2118 100%)';
      case 'decayed':
        return 'linear-gradient(135deg, #1A1A1A 0%, #2D2118 100%)';
      default:
        return 'linear-gradient(135deg, #2D2118 0%, #3D2B1C 100%)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg"
        style={{
          background: getMoodGradient(),
          border: '2px solid #B5890050',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(181, 137, 0, 0.1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl z-10 hover:scale-110 transition-transform"
          style={{ color: '#B58900' }}
        >
          ×
        </button>

        {/* Room header */}
        <div
          className="p-6 pb-4"
          style={{
            borderBottom: '1px solid #B5890030',
          }}
        >
          <h2
            className="text-3xl font-bold mb-1"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#B58900',
            }}
          >
            {room.spanishName}
          </h2>
          <p
            className="text-sm mb-4"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#93A1A1',
              fontStyle: 'italic',
            }}
          >
            {room.name}
          </p>
          <p
            className="text-base leading-relaxed"
            style={{
              fontFamily: 'Lora, serif',
              color: '#EEE8D5',
            }}
          >
            {room.description}
          </p>
        </div>

        {/* Characters in this room */}
        {roomCharacters.length > 0 && (
          <div className="p-6 pt-4 pb-4">
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#B58900',
              }}
            >
              Inhabitants
            </h3>
            <div className="flex flex-wrap gap-3">
              {roomCharacters.map((char) => {
                const status = getCharacterStatus(char, currentChapter);
                const isGhost = status === 'deceased';

                return (
                  <motion.button
                    key={char.id}
                    onClick={() => onCharacterClick(char)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: isGhost
                        ? 'rgba(38, 139, 210, 0.15)'
                        : 'rgba(181, 137, 0, 0.15)',
                      border: `1px solid ${isGhost ? '#268BD250' : '#B5890050'}`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: isGhost
                        ? 'rgba(38, 139, 210, 0.25)'
                        : 'rgba(181, 137, 0, 0.25)',
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: isGhost
                          ? 'rgba(38, 139, 210, 0.3)'
                          : 'rgba(181, 137, 0, 0.3)',
                        border: `1px solid ${isGhost ? '#268BD2' : '#B58900'}`,
                      }}
                    >
                      {isGhost ? '👻' : char.name.charAt(0)}
                    </span>
                    <div className="text-left">
                      <p
                        className="text-sm font-medium"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          color: isGhost ? '#268BD2' : '#EEE8D5',
                        }}
                      >
                        {char.name}
                      </p>
                      {char.nickname && (
                        <p
                          className="text-xs"
                          style={{
                            fontFamily: 'Lora, serif',
                            color: '#93A1A1',
                            fontStyle: 'italic',
                          }}
                        >
                          "{char.nickname}"
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Objects in the room */}
        {room.objects.length > 0 && (
          <div
            className="p-6 pt-4"
            style={{
              borderTop: '1px solid #B5890020',
            }}
          >
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#B58900',
              }}
            >
              Objects of Memory
            </h3>
            <div className="grid gap-3">
              {room.objects.map((object) => {
                const isSelected = selectedObject?.id === object.id;

                return (
                  <motion.div
                    key={object.id}
                    className="rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${isSelected ? '#B58900' : '#B5890030'}`,
                    }}
                  >
                    <button
                      onClick={() => handleObjectClick(object)}
                      className="w-full p-4 text-left flex items-center gap-3 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-2xl">
                        {object.id.includes('tree') && '🌳'}
                        {object.id.includes('fish') && '🐟'}
                        {object.id.includes('parchment') && '📜'}
                        {object.id.includes('gold') && '💰'}
                        {object.id.includes('shroud') && '🪦'}
                        {object.id.includes('bandage') && '🩹'}
                        {object.id.includes('pianola') && '🎹'}
                        {object.id.includes('roses') && '🌹'}
                        {object.id.includes('daguerreotype') && '📷'}
                        {object.id.includes('candy') && '🍬'}
                        {object.id.includes('tools') && '🔧'}
                        {object.id.includes('pot') && '🏺'}
                        {!['tree', 'fish', 'parchment', 'gold', 'shroud', 'bandage', 'pianola', 'roses', 'daguerreotype', 'candy', 'tools', 'pot'].some(k => object.id.includes(k)) && '✨'}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-base font-medium"
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            color: '#EEE8D5',
                          }}
                        >
                          {object.name}
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            fontFamily: 'Lora, serif',
                            color: '#93A1A1',
                          }}
                        >
                          {object.description}
                        </p>
                      </div>
                      <motion.span
                        className="text-sm"
                        style={{ color: '#B58900' }}
                        animate={isSelected ? { rotate: 90 } : { rotate: 0 }}
                      >
                        ›
                      </motion.span>
                    </button>

                    {/* Object story */}
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: 'rgba(181, 137, 0, 0.1)',
                            borderLeft: '3px solid #B58900',
                          }}
                        >
                          {isLoadingStory ? (
                            <div className="flex items-center gap-3">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                ✨
                              </motion.span>
                              <span
                                className="text-sm italic"
                                style={{
                                  fontFamily: 'Lora, serif',
                                  color: '#93A1A1',
                                }}
                              >
                                The memories stir...
                              </span>
                            </div>
                          ) : (
                            <p
                              className="text-sm leading-relaxed whitespace-pre-wrap"
                              style={{
                                fontFamily: 'Lora, serif',
                                color: '#EEE8D5',
                              }}
                            >
                              {objectStory}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div
          className="p-4 text-center"
          style={{
            borderTop: '1px solid #B5890020',
          }}
        >
          <p
            className="text-xs"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#657B83',
              fontStyle: 'italic',
            }}
          >
            Click characters to speak with them • Click objects to hear their stories
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
