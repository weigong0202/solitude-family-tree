import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { ChatMessage } from './ChatMessage';
import { generateWithSearchGrounding, isGeminiInitialized } from '../../services/gemini';

interface ChatPanelProps {
  currentChapter: number;
  isOpen: boolean;
  onToggle: () => void;
}

interface GroundedResponse {
  text: string;
  sources?: string[];
}

export function ChatPanel({ currentChapter, isOpen, onToggle }: ChatPanelProps) {
  const { messages, isLoading, error, sendMessage, clearChat, addMessage } = useGeminiChat(currentChapter);
  const [input, setInput] = useState('');
  const [useGrounding, setUseGrounding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isSearching) return;

    const query = input.trim();
    setInput('');

    if (useGrounding && isGeminiInitialized()) {
      // Use Google Search grounding for historical context
      setIsSearching(true);
      addMessage({ role: 'user', content: query });

      try {
        const response: GroundedResponse = await generateWithSearchGrounding(query, currentChapter);
        let content = response.text;

        // Add sources if available
        if (response.sources && response.sources.length > 0) {
          content += '\n\n📚 Sources:\n' + response.sources.map(s => `• ${s}`).join('\n');
        }

        addMessage({ role: 'assistant', content });
      } catch (err) {
        console.error('Search grounding error:', err);
        addMessage({ role: 'assistant', content: 'Sorry, I couldn\'t search for that information. Please try again.' });
      } finally {
        setIsSearching(false);
      }
    } else {
      // Use regular chat
      sendMessage(query);
    }
  };

  const suggestedQuestions = useGrounding
    ? [
        'What were Colombia\'s civil wars about?',
        'Tell me about banana plantations in Colombia',
        'What is magical realism in Latin American literature?',
        'Who was García Márquez?',
      ]
    : [
        'Who are the main characters so far?',
        'Explain the family relationships',
        'What is magical realism?',
        'Tell me about Macondo',
      ];

  const isProcessing = isLoading || isSearching;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-40 ${
          isOpen
            ? 'bg-[#586E75] hover:bg-[#073642]'
            : 'bg-[#B58900] hover:bg-[#8B6914]'
        }`}
      >
        <span className="text-white text-2xl">
          {isOpen ? '×' : '💬'}
        </span>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#FDF6E3] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 border border-[#B58900]/20"
          >
            {/* Header */}
            <div
              className="px-4 py-3"
              style={{
                background: useGrounding
                  ? 'linear-gradient(135deg, #268BD2, #6C71C4)'
                  : 'linear-gradient(135deg, #B58900, #D4A017)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {useGrounding ? '🔍 Historical Context' : '📖 Ask about the story'}
                  </h3>
                  <p className="text-xs text-white/80" style={{ fontFamily: 'var(--font-mono)' }}>
                    {useGrounding ? 'Powered by Google Search' : `Spoiler-safe to Ch. ${currentChapter}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseGrounding(!useGrounding)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      useGrounding
                        ? 'bg-white/30 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={useGrounding ? 'Switch to story mode' : 'Switch to historical context mode'}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {useGrounding ? '📖' : '🔍'}
                  </button>
                  <button
                    onClick={clearChat}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors text-white"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Mode indicator */}
            {useGrounding && (
              <div
                className="px-4 py-2 text-xs border-b"
                style={{
                  backgroundColor: 'rgba(38, 139, 210, 0.1)',
                  borderColor: 'rgba(38, 139, 210, 0.2)',
                  fontFamily: 'var(--font-mono)',
                  color: '#268BD2',
                }}
              >
                🌐 Using Gemini 3 + Google Search for real historical context
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: 'rgba(238, 232, 213, 0.5)' }}>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p
                    className="text-sm mb-4"
                    style={{ fontFamily: 'var(--font-serif)', color: '#586E75' }}
                  >
                    {useGrounding
                      ? 'Ask about the historical context of the novel!'
                      : 'Ask me anything about what you\'ve read so far!'}
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(q);
                          inputRef.current?.focus();
                        }}
                        className="block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          backgroundColor: '#FDF6E3',
                          color: '#586E75',
                          border: '1px solid rgba(181, 137, 0, 0.2)',
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))
              )}

              {isProcessing && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl rounded-bl-sm px-4 py-3"
                    style={{ backgroundColor: useGrounding ? 'rgba(38, 139, 210, 0.1)' : 'rgba(181, 137, 0, 0.1)' }}
                  >
                    <div className="flex items-center gap-2">
                      {useGrounding && <span className="text-sm">🔍</span>}
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: useGrounding ? '#268BD2' : '#B58900', animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: useGrounding ? '#268BD2' : '#B58900', animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: useGrounding ? '#268BD2' : '#B58900', animationDelay: '300ms' }}
                        />
                      </div>
                      {useGrounding && (
                        <span className="text-xs" style={{ color: '#268BD2', fontFamily: 'var(--font-mono)' }}>
                          Searching...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="text-center text-sm rounded-lg p-2"
                  style={{
                    backgroundColor: 'rgba(220, 50, 47, 0.1)',
                    color: '#DC322F',
                  }}
                >
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t"
              style={{ backgroundColor: '#FDF6E3', borderColor: 'rgba(181, 137, 0, 0.2)' }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={useGrounding ? 'Ask about history...' : 'Ask a question...'}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-full text-sm outline-none transition-colors disabled:opacity-50"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    backgroundColor: 'rgba(238, 232, 213, 0.8)',
                    border: '1px solid rgba(181, 137, 0, 0.2)',
                    color: '#586E75',
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: useGrounding ? '#268BD2' : '#B58900',
                    color: '#FDF6E3',
                  }}
                >
                  ➤
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
