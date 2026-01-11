import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'spirit';
  content: string;
  timestamp: Date;
}

interface SeanceChatProps {
  character: Character;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

// Flickering candle component
function Candle({ delay = 0, size = 'md' }: { delay?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { candle: 'w-3 h-8', flame: 'w-2 h-4', holder: 'w-4' },
    md: { candle: 'w-4 h-12', flame: 'w-3 h-6', holder: 'w-6' },
    lg: { candle: 'w-5 h-16', flame: 'w-4 h-8', holder: 'w-8' },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center">
      {/* Flame */}
      <motion.div
        className={`${s.flame} rounded-full relative`}
        animate={{
          height: ['100%', '120%', '90%', '110%', '100%'],
          opacity: [0.9, 1, 0.85, 0.95, 0.9],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(to top, #B58900 0%, #DCAA2B 40%, #FDF6E3 80%, white 100%)',
          boxShadow: '0 0 20px #B58900, 0 0 40px rgba(181, 137, 0, 0.5), 0 0 60px rgba(181, 137, 0, 0.3)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 30%, white 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* Candle body */}
      <div
        className={`${s.candle} rounded-t-sm -mt-1`}
        style={{
          background: 'linear-gradient(to right, #EEE8D5 0%, #FDF6E3 50%, #EEE8D5 100%)',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.1)',
        }}
      />

      {/* Candle holder */}
      <div
        className={`${s.holder} h-3 rounded-b-sm -mt-px`}
        style={{
          background: 'linear-gradient(to right, #5C4033 0%, #8B6914 50%, #5C4033 100%)',
        }}
      />
    </div>
  );
}

// Ouija-style text reveal
function OuijaText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30 + Math.random() * 20); // Variable speed for mystical effect
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ color: '#B58900' }}
        >
          ▌
        </motion.span>
      )}
    </span>
  );
}

export function SeanceChat({
  character,
  messages,
  isLoading,
  error,
  onSendMessage,
  onClose,
}: SeanceChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [revealedMessages, setRevealedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, revealedMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleMessageRevealed = (messageId: string) => {
    setRevealedMessages((prev) => new Set([...prev, messageId]));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: 'linear-gradient(to bottom, #0D0705 0%, #1A0F0A 50%, #0D0705 100%)',
      }}
    >
      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(181, 137, 0, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Top candles */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-16 z-10">
        <Candle delay={0} size="md" />
        <Candle delay={0.2} size="lg" />
        <Candle delay={0.4} size="md" />
      </div>

      {/* Side candles - left */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-10">
        <Candle delay={0.1} size="sm" />
        <Candle delay={0.3} size="md" />
        <Candle delay={0.5} size="sm" />
      </div>

      {/* Side candles - right */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-10">
        <Candle delay={0.15} size="sm" />
        <Candle delay={0.35} size="md" />
        <Candle delay={0.55} size="sm" />
      </div>

      {/* Header */}
      <div className="relative z-20 pt-20 pb-4 px-4 text-center">
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(253, 246, 227, 0.1)',
            border: '1px solid rgba(181, 137, 0, 0.3)',
            color: '#B58900',
          }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(181, 137, 0, 0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ fontFamily: 'var(--font-mono)', color: '#657B83' }}
          >
            Communing with the Spirit of
          </p>
          <h2
            className="text-2xl md:text-3xl"
            style={{
              fontFamily: 'var(--font-serif)',
              color: '#FDF6E3',
              textShadow: '0 0 20px rgba(181, 137, 0, 0.5)',
            }}
          >
            {character.name}
          </h2>
          {character.nickname && (
            <p
              className="text-sm italic mt-1"
              style={{ color: '#B58900' }}
            >
              "{character.nickname}"
            </p>
          )}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mt-4 mx-auto h-px"
          style={{
            background: 'linear-gradient(to right, transparent, #B58900, transparent)',
            maxWidth: '300px',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 z-20">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, index) => {
            const isSpirit = message.role === 'spirit';
            const isLatestSpirit = isSpirit && index === messages.length - 1 && !revealedMessages.has(message.id);

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isSpirit ? 0.3 : 0 }}
                className={`flex ${isSpirit ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-5 py-4 ${
                    isSpirit ? 'text-left' : 'text-right'
                  }`}
                  style={{
                    background: isSpirit
                      ? 'linear-gradient(135deg, rgba(38, 139, 210, 0.15), rgba(108, 113, 196, 0.1))'
                      : 'rgba(181, 137, 0, 0.15)',
                    border: isSpirit
                      ? '1px solid rgba(38, 139, 210, 0.3)'
                      : '1px solid rgba(181, 137, 0, 0.3)',
                    boxShadow: isSpirit
                      ? '0 0 20px rgba(38, 139, 210, 0.1)'
                      : '0 0 20px rgba(181, 137, 0, 0.1)',
                  }}
                >
                  {isSpirit && (
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-lg"
                      >
                        👻
                      </motion.span>
                      <span
                        className="text-xs tracking-wider uppercase"
                        style={{ fontFamily: 'var(--font-mono)', color: '#268BD2' }}
                      >
                        Spirit speaks
                      </span>
                    </div>
                  )}
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: isSpirit ? '#EEE8D5' : '#FDF6E3',
                    }}
                  >
                    {isLatestSpirit ? (
                      <OuijaText
                        text={message.content}
                        onComplete={() => handleMessageRevealed(message.id)}
                      />
                    ) : (
                      message.content
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div
                className="rounded-lg px-5 py-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(38, 139, 210, 0.15), rgba(108, 113, 196, 0.1))',
                  border: '1px solid rgba(38, 139, 210, 0.3)',
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg"
                  >
                    👻
                  </motion.span>
                  <span
                    className="text-sm italic"
                    style={{ fontFamily: 'var(--font-serif)', color: '#839496' }}
                  >
                    The spirit stirs...
                  </span>
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.span
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#268BD2' }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <p
                className="text-sm italic"
                style={{ fontFamily: 'var(--font-serif)', color: '#DC322F' }}
              >
                {error}
              </p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-20 p-4 md:px-16">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div
            className="flex gap-3 p-2 rounded-lg"
            style={{
              background: 'rgba(253, 246, 227, 0.05)',
              border: '1px solid rgba(181, 137, 0, 0.3)',
              boxShadow: '0 0 30px rgba(181, 137, 0, 0.1)',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Speak your question to the beyond..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder-[#657B83] disabled:opacity-50"
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#FDF6E3',
              }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 rounded-md disabled:opacity-50 transition-all"
              style={{
                background: 'linear-gradient(135deg, #B58900 0%, #8B6914 100%)',
                color: '#FDF6E3',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 0 20px rgba(181, 137, 0, 0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(181, 137, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Commune
            </motion.button>
          </div>
        </form>

        {/* Bottom hint */}
        <p
          className="text-center mt-3 text-xs"
          style={{ fontFamily: 'var(--font-mono)', color: '#657B83' }}
        >
          The veil between worlds is thin... speak with reverence
        </p>
      </div>

      {/* Bottom candles */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-20 z-10 pointer-events-none">
        <Candle delay={0.25} size="sm" />
        <Candle delay={0.45} size="sm" />
      </div>

      {/* Mystical corner decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <motion.div
          key={corner}
          className="absolute w-24 h-24 pointer-events-none"
          style={{
            ...(corner.includes('top') ? { top: '60px' } : { bottom: '80px' }),
            ...(corner.includes('left') ? { left: '40px' } : { right: '40px' }),
            opacity: 0.15,
            color: '#B58900',
            fontSize: '4rem',
            transform: corner.includes('right')
              ? corner.includes('bottom')
                ? 'rotate(180deg)'
                : 'rotate(90deg)'
              : corner.includes('bottom')
              ? 'rotate(-90deg)'
              : 'rotate(0deg)',
          }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ❧
        </motion.div>
      ))}
    </motion.div>
  );
}
