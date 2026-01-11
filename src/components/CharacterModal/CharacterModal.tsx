import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { getCharacterStatus, characters } from '../../data/characters';
import { getPlaceholderPortrait, generatePortrait, isAIGeneratedPortrait } from '../../services/imagen';
import { useCharacterChat } from '../../hooks/useCharacterChat';

interface CharacterModalProps {
  character: Character | null;
  currentChapter: number;
  onClose: () => void;
}

export function CharacterModal({ character, currentChapter, onClose }: CharacterModalProps) {
  const { messages, isLoading: chatLoading, error: chatError, startSession, sendMessage, endSession } = useCharacterChat();
  const [isChatMode, setIsChatMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [portrait, setPortrait] = useState<string>('');
  const [isLoadingPortrait, setIsLoadingPortrait] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load portrait from cache or generate new one (same as BookCharacterCard)
  useEffect(() => {
    if (character) {
      setIsChatMode(false);
      setPortrait(getPlaceholderPortrait(character));

      // Load the same portrait as the preview card
      let mounted = true;
      setIsLoadingPortrait(true);

      generatePortrait(character)
        .then((generatedPortrait) => {
          if (mounted) {
            setPortrait(generatedPortrait);
          }
        })
        .catch((error) => {
          console.error('Failed to load portrait:', error);
        })
        .finally(() => {
          if (mounted) {
            setIsLoadingPortrait(false);
          }
        });

      return () => {
        mounted = false;
      };
    } else {
      endSession();
      setPortrait('');
    }
  }, [character, endSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!character) return null;

  const status = getCharacterStatus(character, currentChapter);
  const isDeceased = status === 'deceased';
  const hasAIPortrait = isAIGeneratedPortrait(portrait);

  const parents = characters.filter(c => character.parentIds.includes(c.id));
  const spouses = characters.filter(c => character.spouseIds.includes(c.id));
  const children = characters.filter(c => c.parentIds.includes(character.id) && c.birthChapter <= currentChapter);

  const handleStartChat = () => {
    const success = startSession(character, currentChapter);
    if (success) {
      setIsChatMode(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleBackToBio = () => {
    setIsChatMode(false);
    endSession();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden ${
            isChatMode ? 'max-h-[90vh]' : 'max-h-[85vh]'
          }`}
          style={{ backgroundColor: '#FDF6E3' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative p-6 pb-4"
            style={{
              background: isDeceased
                ? 'linear-gradient(135deg, rgba(38, 139, 210, 0.1), #FDF6E3)'
                : 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), #FDF6E3)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: 'rgba(88, 110, 117, 0.1)',
                color: '#586E75',
              }}
            >
              x
            </button>

            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={portrait}
                  alt={character.name}
                  className="w-20 h-20 rounded-full shadow-lg object-cover"
                  style={{
                    border: `3px solid ${isDeceased ? '#268BD280' : '#B5890080'}`,
                    filter: isDeceased ? 'sepia(0.8) grayscale(0.4) blur(0.5px)' : 'sepia(0.5)',
                    opacity: isDeceased ? 0.7 : 1,
                  }}
                />
                {isDeceased && (
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#268BD2' }}
                  >
                    <span className="text-xs">&#128123;</span>
                  </div>
                )}
                {hasAIPortrait && (
                  <div
                    className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#B58900' }}
                    title="AI Generated"
                  >
                    <span className="text-[10px]">&#10024;</span>
                  </div>
                )}
                {isLoadingPortrait && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl font-bold truncate"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  {character.name}
                </h2>
                {character.nickname && (
                  <p
                    className="text-sm italic"
                    style={{ fontFamily: 'Lora, serif', color: '#B58900' }}
                  >
                    "{character.nickname}"
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      backgroundColor: 'rgba(181, 137, 0, 0.15)',
                      color: '#B58900',
                    }}
                  >
                    Gen {character.generation}
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      backgroundColor: isDeceased ? 'rgba(38, 139, 210, 0.15)' : 'rgba(181, 137, 0, 0.15)',
                      color: isDeceased ? '#268BD2' : '#B58900',
                    }}
                  >
                    {isDeceased ? 'Departed' : status === 'alive_aged' ? 'Elder' : 'Living'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col" style={{ height: isChatMode ? 'calc(90vh - 140px)' : 'auto' }}>
            {!isChatMode ? (
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {/* Family relationships */}
                <div
                  className="mb-4 pb-4"
                  style={{ borderBottom: '1px solid rgba(181, 137, 0, 0.2)' }}
                >
                  <h4
                    className="text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                  >
                    Family Connections
                  </h4>
                  <div
                    className="space-y-1 text-sm"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                  >
                    {parents.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Parents:</span> {parents.map(p => p.name).join(' & ')}</p>
                    )}
                    {spouses.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Spouse:</span> {spouses.map(s => s.name).join(', ')}</p>
                    )}
                    {children.length > 0 && (
                      <p><span style={{ color: '#657B83' }}>Children:</span> {children.map(c => c.name).join(', ')}</p>
                    )}
                    {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
                      <p className="italic" style={{ color: '#93A1A1' }}>No known family connections yet</p>
                    )}
                  </div>
                </div>

                {/* Biography */}
                <div className="mb-4">
                  <h4
                    className="text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                  >
                    Biography
                  </h4>

                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                  >
                    {character.biography || character.description}
                  </div>
                </div>

                {/* Chapter note */}
                <div className="pt-4" style={{ borderTop: '1px solid rgba(181, 137, 0, 0.2)' }}>
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#93A1A1', fontStyle: 'italic' }}
                  >
                    First appears in Chapter {character.birthChapter}
                    {character.deathChapter && character.deathChapter <= currentChapter && (
                      <> - Departed in Chapter {character.deathChapter}</>
                    )}
                  </p>
                </div>

                {/* Talk to the Dead */}
                {isDeceased && (
                  <motion.button
                    onClick={handleStartChat}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    style={{
                      background: 'linear-gradient(135deg, rgba(38, 139, 210, 0.2), rgba(38, 139, 210, 0.1))',
                      border: '1px solid rgba(38, 139, 210, 0.3)',
                      color: '#268BD2',
                      fontFamily: 'Playfair Display, serif',
                    }}
                  >
                    <span className="text-lg">&#128123;</span>
                    <span>Speak with {character.name.split(' ')[0]}'s Spirit</span>
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(38, 139, 210, 0.2)' }}>
                  <button
                    onClick={handleBackToBio}
                    className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#268BD2', fontStyle: 'italic' }}
                  >
                    &larr; Back to biography
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="max-w-[85%] rounded-lg px-4 py-3"
                        style={{
                          fontFamily: 'Lora, serif',
                          color: '#586E75',
                          backgroundColor: message.role === 'user' ? 'rgba(181, 137, 0, 0.1)' : 'rgba(38, 139, 210, 0.08)',
                          borderLeft: message.role === 'spirit' ? '3px solid #268BD2' : 'none',
                          textAlign: message.role === 'user' ? 'right' : 'left',
                        }}
                      >
                        {message.role === 'spirit' && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">&#128123;</span>
                            <span
                              className="text-xs"
                              style={{ color: '#268BD2', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
                            >
                              {character.name}
                            </span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {chatLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div
                        className="px-4 py-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(38, 139, 210, 0.08)', borderLeft: '3px solid #268BD2' }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">&#128123;</span>
                          <div className="flex gap-1">
                            {[0, 150, 300].map((delay) => (
                              <span
                                key={delay}
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{ backgroundColor: '#268BD2', animationDelay: `${delay}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {chatError && (
                    <div className="text-center text-sm italic py-2" style={{ color: '#B58900' }}>
                      {chatError}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4" style={{ borderTop: '1px solid rgba(38, 139, 210, 0.2)' }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask the spirit..."
                      disabled={chatLoading}
                      className="flex-1 px-4 py-2 rounded-lg text-sm outline-none transition-colors disabled:opacity-50"
                      style={{
                        fontFamily: 'Lora, serif',
                        backgroundColor: 'rgba(38, 139, 210, 0.05)',
                        border: '1px solid rgba(38, 139, 210, 0.2)',
                        color: '#586E75',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !inputValue.trim()}
                      className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: '#268BD2',
                        color: '#FDF6E3',
                        fontFamily: 'Cormorant Garamond, serif',
                      }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
