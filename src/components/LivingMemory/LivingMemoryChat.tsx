import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { useLivingMemory } from '../../hooks/useLivingMemory';
import { isGeminiInitialized } from '../../services/gemini';
import { livingMemoryThemes, fonts, colors } from '../../constants/theme';

interface LivingMemoryChatProps {
  character: Character;
  currentChapter: number;
  onClose?: () => void;
}

export function LivingMemoryChat({ character, currentChapter, onClose }: LivingMemoryChatProps) {
  const {
    messages,
    memory,
    isLoading,
    error,
    moodEmoji,
    trustDescription,
    isDeceased,
    sendMessage,
    startConversation,
  } = useLivingMemory(character, currentChapter);

  // Visual theme based on living/deceased status
  const baseTheme = isDeceased ? livingMemoryThemes.deceased : livingMemoryThemes.living;

  // Add character-specific dynamic text to the theme
  const theme = useMemo(() => ({
    ...baseTheme,
    summonDescription: isDeceased
      ? `Call ${character.nickname || character.name} back from the realm of shadows to speak with the living.`
      : `Meet ${character.nickname || character.name} in the warm light of Macondo.`,
    summonDescriptionReturning: isDeceased
      ? `You have spoken with ${character.nickname || character.name} before. They will remember you...`
      : `${character.nickname || character.name} will be glad to see you again.`,
  }), [baseTheme, character, isDeceased]);

  const [input, setInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation starts
  useEffect(() => {
    if (hasStarted) {
      inputRef.current?.focus();
    }
  }, [hasStarted]);

  const handleStart = () => {
    startConversation();
    setHasStarted(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const isInitialized = isGeminiInitialized();

  // Suggested questions based on character
  const suggestedQuestions = [
    `Tell me about your life, ${character.nickname || character.name.split(' ')[0]}`,
    'What do you remember most vividly?',
    'Who did you love the most?',
    'Do you have any regrets?',
  ];

  if (!isInitialized) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4">🔮</div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: fonts.heading, color: colors.text }}
        >
          Living Memory Unavailable
        </h3>
        <p
          className="text-sm"
          style={{ fontFamily: fonts.body, color: colors.textMuted }}
        >
          Please configure your Gemini API key to speak with the spirits.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with emotional state */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          background: theme.headerBg,
          borderColor: theme.headerBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodEmoji}</span>
          <div>
            <h3
              className="font-semibold"
              style={{ fontFamily: fonts.heading, color: colors.text }}
            >
              {character.name}
            </h3>
            <div className="flex items-center gap-2 text-xs" style={{ color: colors.textMuted }}>
              <span style={{ fontFamily: fonts.body }}>{trustDescription}</span>
              <span>•</span>
              <span
                className="px-1.5 py-0.5 rounded text-xs"
                style={{
                  backgroundColor: theme.tagBg,
                  border: `1px solid ${theme.tagBorder}`,
                  color: theme.accentColor,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isDeceased ? 'Spirit' : 'Living'}
              </span>
              {memory && memory.emotionalState.interactionCount > 0 && (
                <>
                  <span>•</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {memory.emotionalState.interactionCount} visits
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xl opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: theme.chatBg }}
      >
        {!hasStarted ? (
          // Start conversation prompt
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-4"
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {theme.icon}
            </motion.div>

            <h3
              className="text-xl font-semibold mb-3"
              style={{ fontFamily: fonts.heading, color: theme.accentColor }}
            >
              {theme.summonTitle}
            </h3>

            <p
              className="text-sm mb-6 max-w-xs"
              style={{ fontFamily: fonts.body, color: colors.textSecondary }}
            >
              {memory && memory.emotionalState.interactionCount > 0
                ? theme.summonDescriptionReturning
                : theme.summonDescription}
            </p>

            <motion.button
              onClick={handleStart}
              className="px-6 py-3 rounded-lg"
              style={{
                background: theme.buttonGradient,
                color: colors.cream,
                fontFamily: fonts.heading,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDeceased ? 'Begin Conversation' : 'Start Talking'}
            </motion.button>

            {memory && memory.emotionalState.topicsDiscussed.length > 0 && (
              <div className="mt-6 text-xs" style={{ color: colors.textMuted }}>
                <p className="mb-2">Previously discussed:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {memory.emotionalState.topicsDiscussed.slice(-5).map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: theme.tagBg,
                        border: `1px solid ${theme.tagBorder}`,
                        fontFamily: fonts.body,
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Messages
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              msg.role === 'system' ? (
                // Session separator
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 my-4"
                >
                  <div className="flex-1 h-px" style={{ background: `${theme.accentColor}40` }} />
                  <span
                    className="text-xs px-3 py-1"
                    style={{
                      color: theme.accentColor,
                      fontFamily: fonts.body,
                      fontStyle: 'italic',
                    }}
                  >
                    {msg.content}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${theme.accentColor}40` }} />
                </motion.div>
              ) : (
                // Regular message
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={{
                      backgroundColor: msg.role === 'user'
                        ? theme.userMsgBg
                        : theme.assistantMsgBg,
                      border: `1px solid ${
                        msg.role === 'user'
                          ? theme.userMsgBorder
                          : theme.assistantMsgBorder
                      }`,
                    }}
                  >
                    <p
                      className="text-sm whitespace-pre-wrap"
                      style={{
                        fontFamily: fonts.body,
                        color: colors.text,
                      }}
                    >
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              )
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{
                    backgroundColor: theme.assistantMsgBg,
                    border: `1px solid ${theme.assistantMsgBorder}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {theme.icon}
                    </motion.span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: fonts.body, color: theme.accentColor }}
                    >
                      {theme.loadingText}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Error display */}
        {error && (
          <div
            className="text-center text-sm rounded-lg p-3"
            style={{
              backgroundColor: 'rgba(220, 50, 47, 0.1)',
              color: '#DC322F',
              fontFamily: fonts.body,
            }}
          >
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (only show when conversation started and no messages from user yet) */}
      {hasStarted && messages.filter(m => m.role === 'user').length === 0 && !isLoading && (
        <div
          className="px-4 py-2 border-t"
          style={{ borderColor: theme.headerBorder }}
        >
          <p
            className="text-xs mb-2"
            style={{ fontFamily: fonts.body, color: colors.textMuted }}
          >
            Suggested questions:
          </p>
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-xs px-2 py-1 rounded-full transition-colors hover:bg-opacity-20"
                style={{
                  backgroundColor: theme.tagBg,
                  border: `1px solid ${theme.tagBorder}`,
                  fontFamily: fonts.body,
                  color: colors.textSecondary,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      {hasStarted && (
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t"
          style={{
            backgroundColor: theme.chatBg,
            borderColor: theme.headerBorder,
          }}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={theme.placeholder}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-full text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                fontFamily: fonts.body,
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                color: colors.text,
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: theme.buttonGradient,
                color: colors.cream,
              }}
            >
              ➤
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
