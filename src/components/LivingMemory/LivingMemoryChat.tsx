import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { useLivingMemory } from '../../hooks/useLivingMemory';
import { isGeminiInitialized, generateCharacterNarration, isTTSInitialized } from '../../services/gemini';
import { livingMemoryThemes, fonts, colors } from '../../constants/theme';
import { getCharacterVoice } from '../../constants/characterVoices';
import { pcmToWav } from '../../utils/audio';

/**
 * ThoughtSignature component - displays the character's inner reasoning
 * Can be expanded/collapsed by clicking
 */
function ThoughtSignature({
  signature,
  accentColor,
  characterName
}: {
  signature: string;
  accentColor: string;
  characterName: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2 pt-2 border-t"
      style={{ borderColor: `${accentColor}30` }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
        style={{ color: accentColor, fontFamily: fonts.body }}
      >
        <span>💭</span>
        <span className="italic">
          {isExpanded ? 'Hide inner thoughts' : `${characterName}'s inner thoughts...`}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p
              className="mt-2 text-sm italic leading-relaxed"
              style={{
                color: accentColor,
                fontFamily: fonts.body,
              }}
            >
              {signature}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Parse message content and render atmospheric text (*italics*) differently from dialogue
 * - Multi-word phrases in *...* are atmospheric/action text (displayed as blocks)
 * - Single words in *...* are inline emphasis (e.g., Spanish terms like *amigo*)
 */
function formatMessageContent(content: string, accentColor: string): ReactNode[] {
  // Split by *...* pattern, keeping the delimiters
  const parts = content.split(/(\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const innerText = part.slice(1, -1).trim();
      const wordCount = innerText.split(/\s+/).length;

      if (wordCount <= 2) {
        // Single word or two words - just italics, no color change
        // (e.g., *amigo*, *¡Jamás!*, *Mi amor*)
        return (
          <span
            key={index}
            style={{ fontStyle: 'italic' }}
          >
            {innerText}
          </span>
        );
      } else {
        // Multi-word phrase - atmospheric/action text as block
        return (
          <span
            key={index}
            style={{
              fontStyle: 'italic',
              color: accentColor,
              opacity: 0.85,
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            {innerText}
          </span>
        );
      }
    }
    // Regular dialogue - render normally
    return part ? <span key={index}>{part}</span> : null;
  });
}

interface LivingMemoryChatProps {
  character: Character;
  currentChapter: number;
  onClose?: () => void;
}

export type ResponseStyle = 'brief' | 'balanced' | 'immersive';

const RESPONSE_STYLE_KEY = 'solitude_response_style';

function getStoredResponseStyle(): ResponseStyle {
  const stored = localStorage.getItem(RESPONSE_STYLE_KEY);
  if (stored === 'brief' || stored === 'balanced' || stored === 'immersive') {
    return stored;
  }
  return 'balanced';
}

export function LivingMemoryChat({ character, currentChapter, onClose }: LivingMemoryChatProps) {
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>(getStoredResponseStyle);

  // Update localStorage when style changes
  useEffect(() => {
    localStorage.setItem(RESPONSE_STYLE_KEY, responseStyle);
  }, [responseStyle]);

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
  } = useLivingMemory(character, currentChapter, responseStyle);

  // Visual theme based on living/deceased status
  const baseTheme = isDeceased ? livingMemoryThemes.deceased : livingMemoryThemes.living;

  // Use the base theme directly (removed intermediate screen-specific properties)
  const theme = baseTheme;

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasStartedRef = useRef(false);

  // Audio narration state
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const audioAbortRef = useRef<AbortController | null>(null);

  // Cleanup audio resources helper
  const cleanupAudio = useCallback(() => {
    // Abort any pending audio generation
    if (audioAbortRef.current) {
      audioAbortRef.current.abort();
      audioAbortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  // Handle audio playback for character responses
  const handlePlayAudio = useCallback(async (messageId: string, text: string) => {
    if (loadingAudioId === messageId) return;

    // Stop current playback and cleanup
    cleanupAudio();
    setAudioError(null);

    // Toggle off if already playing this message
    if (playingMessageId === messageId) {
      setPlayingMessageId(null);
      return;
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    audioAbortRef.current = abortController;

    setLoadingAudioId(messageId);

    try {
      const voice = getCharacterVoice(character.id);
      const pcmBase64 = await generateCharacterNarration(text, voice);

      // Check if this request was aborted while waiting
      if (abortController.signal.aborted) {
        return;
      }

      const wavBlob = pcmToWav(pcmBase64);
      const audioUrl = URL.createObjectURL(wavBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setPlayingMessageId(null);
        cleanupAudio();
      };
      audio.onerror = () => {
        setAudioError('Failed to play audio');
        setPlayingMessageId(null);
        cleanupAudio();
      };
      audioRef.current = audio;

      await audio.play();
      setPlayingMessageId(messageId);
    } catch (error) {
      // Don't show error if request was aborted
      if (abortController.signal.aborted) {
        return;
      }
      console.error('Failed to generate narration:', error);
      setAudioError('Failed to generate audio. Please try again.');
      cleanupAudio();
    } finally {
      if (!abortController.signal.aborted) {
        setLoadingAudioId(null);
      }
    }
  }, [character.id, loadingAudioId, playingMessageId, cleanupAudio]);

  // Cleanup audio on unmount or character change
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Auto-start conversation when memory is ready
  useEffect(() => {
    if (!hasStartedRef.current && memory) {
      hasStartedRef.current = true;
      startConversation();
    }
  }, [memory, startConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when messages appear
  useEffect(() => {
    if (messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const isInitialized = isGeminiInitialized();

  // Generate personalized suggested questions based on character
  const suggestedQuestions = useMemo(() => {
    const firstName = character.nickname || character.name.split(' ')[0];
    const questions: string[] = [];

    // Character-specific questions based on their story
    const characterQuestions: Record<string, string[]> = {
      'jose-arcadio-buendia': [
        'Tell me about founding Macondo',
        'What did the gypsies teach you?',
        'Why were you tied to the chestnut tree?',
        'Do you still speak with Melquíades?',
      ],
      'ursula': [
        'How did you hold the family together?',
        'Tell me about your candy animals business',
        'What was your greatest sacrifice?',
        'Which of your children worried you most?',
      ],
      'melquiades': [
        'What is written in your manuscripts?',
        'What is death like?',
        'Why did you return from the afterlife?',
        'What is the fate of the Buendías?',
      ],
      'colonel-aureliano': [
        'Tell me about the 32 wars',
        'Why do you make little gold fish?',
        'Do you remember Remedios Moscote?',
        'What was your greatest defeat?',
      ],
      'amaranta': [
        'Why did you wear the black bandage?',
        'Tell me about Pietro Crespi',
        'Why did you never marry?',
        'What was it like sewing your own shroud?',
      ],
      'rebeca': [
        'Where did you come from?',
        'Why did you eat earth?',
        'Tell me about José Arcadio',
        'How did you endure solitude?',
      ],
      'remedios-the-beauty': [
        'Why did men die for you?',
        'Tell me about ascending to heaven',
        'Did you understand your effect on others?',
        'What was beauty like for you?',
      ],
      'aureliano-segundo': [
        'Tell me about the eating contests',
        'Did you love Petra Cotes or Fernanda?',
        'What happened to your fortune?',
        'Tell me about the rain that lasted years',
      ],
      'fernanda': [
        'Tell me about your royal education',
        'Why did you hide Meme\'s child?',
        'What did you think of Macondo?',
        'Do you still write to the invisible doctors?',
      ],
      'meme': [
        'Tell me about Mauricio Babilonia',
        'What were the yellow butterflies?',
        'Do you regret your silence?',
        'What happened in the convent?',
      ],
      'aureliano-babilonia': [
        'Did you decipher the manuscripts?',
        'Tell me about Amaranta Úrsula',
        'What is the prophecy?',
        'What was it like being raised in solitude?',
      ],
      // Generation 2
      'jose-arcadio-son': [
        'What did you see traveling with the gypsies?',
        'Tell me about your tattoos',
        'Why did you marry Rebeca?',
        'What happened the night you died?',
      ],
      'pilar-ternera': [
        'How did you learn to read the cards?',
        'Tell me about your sons',
        'Why did you never grow old?',
        'What secrets have you kept?',
      ],
      // Generation 3
      'arcadio': [
        'What was it like not knowing your parents?',
        'Why did you become so cruel in power?',
        'What were your last thoughts before the firing squad?',
        'Did you ever forgive your mother?',
      ],
      'aureliano-jose': [
        'Tell me about your love for Amaranta',
        'What was it like fighting in the wars?',
        'Did you ever meet your father?',
        'What do you remember of your death?',
      ],
      'remedios-moscote': [
        'What was it like marrying so young?',
        'Did you love the Colonel?',
        'Tell me about the twins you carried',
        'Were you happy in Macondo?',
      ],
      'santa-sofia': [
        'Why did you serve the family so silently?',
        'What did you think of your children?',
        'When did you finally leave the house?',
        'Did anyone ever truly see you?',
      ],
      // Generation 4
      'jose-arcadio-segundo': [
        'What really happened at the banana company massacre?',
        'Why did no one believe you about the dead?',
        'Tell me about the train with three thousand corpses',
        'What did Melquíades teach you?',
      ],
      'petra-cotes': [
        'How did your animals multiply so miraculously?',
        'Tell me about your love for Aureliano Segundo',
        'What happened when the rains came?',
        'Did you ever resent Fernanda?',
      ],
      // Generation 5
      'jose-arcadio-iii': [
        'What was your life like in Rome?',
        'Tell me about the letters from your mother',
        'What secrets did you hide in the house?',
        'Who killed you and why?',
      ],
      'amaranta-ursula': [
        'What drew you back to Macondo?',
        'Tell me about your time in Brussels',
        'When did you realize who Aureliano was?',
        'What was your vision for the house?',
      ],
      'mauricio-babilonia': [
        'Why did yellow butterflies follow you?',
        'Tell me about your love for Meme',
        'What happened the night you were shot?',
        'What was your life like after, paralyzed?',
      ],
      'gaston': [
        'Why did you let Amaranta Úrsula return alone?',
        'Tell me about your airmail business',
        'When did you know you had lost her?',
        'Did you ever understand Macondo?',
      ],
      // Generation 7
      'aureliano-pig-tail': [
        'What was the world like in your brief moments?',
        'Did you feel the prophecy being fulfilled?',
        'What did you see before the ants came?',
        'Were you the end or a new beginning?',
      ],
    };

    // Get character-specific questions or generate generic ones
    const specificQuestions = characterQuestions[character.id];
    if (specificQuestions) {
      questions.push(...specificQuestions);
    } else {
      // Generic but personalized questions for characters without specific ones
      questions.push(
        `Tell me about your life, ${firstName}`,
        'What do you remember most vividly?',
        'Who did you love the most?',
        'What is your deepest regret?',
      );
    }

    return questions;
  }, [character]);

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

        <div className="flex items-center gap-2">
          {/* Response style toggle */}
          <div
            className="flex rounded-full text-xs overflow-hidden"
            style={{ border: `1px solid ${theme.tagBorder}` }}
          >
            {(['brief', 'balanced', 'immersive'] as ResponseStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setResponseStyle(style)}
                className="px-2 py-1 transition-colors capitalize"
                style={{
                  backgroundColor: responseStyle === style ? theme.accentColor : 'transparent',
                  color: responseStyle === style ? colors.cream : colors.textMuted,
                  fontFamily: fonts.body,
                }}
              >
                {style}
              </button>
            ))}
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
      </div>

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ backgroundColor: theme.chatBg }}
      >
        {/* Messages */}
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
                    <div
                      className="text-sm whitespace-pre-wrap"
                      style={{
                        fontFamily: fonts.body,
                        color: colors.text,
                      }}
                    >
                      {msg.role === 'assistant'
                        ? formatMessageContent(msg.content, theme.accentColor)
                        : msg.content}
                    </div>

                    {/* Thought signature for assistant messages */}
                    {msg.role === 'assistant' && msg.thoughtSignature && (
                      <ThoughtSignature
                        signature={msg.thoughtSignature}
                        accentColor={theme.accentColor}
                        characterName={character.nickname || character.name.split(' ')[0]}
                      />
                    )}

                    {/* Audio playback button for assistant messages */}
                    {msg.role === 'assistant' && isTTSInitialized() && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: `${theme.accentColor}20` }}>
                        <button
                          onClick={() => handlePlayAudio(msg.id, msg.content)}
                          disabled={loadingAudioId === msg.id}
                          className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80 disabled:opacity-50"
                          style={{ color: theme.accentColor, fontFamily: fonts.body }}
                          title={playingMessageId === msg.id ? 'Stop playback' : 'Listen to response'}
                        >
                          <span className="text-base">
                            {loadingAudioId === msg.id ? '⏳' :
                             playingMessageId === msg.id ? '🔊' : '🔈'}
                          </span>
                          <span>
                            {loadingAudioId === msg.id ? 'Generating audio...' :
                             playingMessageId === msg.id ? 'Playing...' : 'Listen'}
                          </span>
                        </button>
                      </div>
                    )}
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

        {/* Error display */}
        {(error || audioError) && (
          <div
            className="text-center text-sm rounded-lg p-3"
            style={{
              backgroundColor: 'rgba(220, 50, 47, 0.1)',
              color: '#DC322F',
              fontFamily: fonts.body,
            }}
          >
            {error || audioError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions - show when not loading */}
      {!isLoading && (
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
    </div>
  );
}
