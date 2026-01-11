import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeGemini } from '../../services/gemini';

const STORAGE_KEY = 'solitude-gemini-api-key';

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      initializeGemini(savedKey);
      setIsConnected(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(STORAGE_KEY, apiKey.trim());
      initializeGemini(apiKey.trim());
      setIsConnected(true);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsConnected(false);
  };

  return (
    <>
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
        style={{
          backgroundColor: isConnected ? '#FDF6E3' : 'rgba(253, 246, 227, 0.9)',
          border: `2px solid ${isConnected ? '#859900' : '#B58900'}`,
        }}
        title="Settings"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke={isConnected ? '#859900' : '#586E75'}
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {isConnected && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#859900] border-2 border-[#FDF6E3]" />
        )}
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#FDF6E3] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#B58900]/20">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: 'var(--font-serif)', color: '#586E75' }}
                  >
                    Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#657B83]/10 hover:bg-[#657B83]/20 flex items-center justify-center text-[#586E75] transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Gemini API Key */}
                <div className="mb-6">
                  <label
                    className="block text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: 'var(--font-mono)', color: '#657B83' }}
                  >
                    Gemini API Key
                  </label>
                  <p
                    className="text-sm mb-3"
                    style={{ fontFamily: 'var(--font-serif)', color: '#586E75' }}
                  >
                    Required for AI-generated biographies and the "Talk to the Dead" feature.
                  </p>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key..."
                      className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none transition-colors"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'rgba(181, 137, 0, 0.05)',
                        border: '1px solid rgba(181, 137, 0, 0.2)',
                        color: '#586E75',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#657B83] hover:text-[#586E75] transition-colors"
                    >
                      {showKey ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Connection Status */}
                <div
                  className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: isConnected ? 'rgba(133, 153, 0, 0.1)' : 'rgba(181, 137, 0, 0.1)',
                  }}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#859900]' : 'bg-[#B58900]'}`}
                  />
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: isConnected ? '#859900' : '#B58900',
                    }}
                  >
                    {isConnected ? 'Connected to Gemini 3 Flash' : 'Not connected'}
                  </span>
                </div>

                {/* Get API Key Link */}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'var(--font-serif)', color: '#268BD2' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Get a free API key from Google AI Studio
                </a>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="flex-1 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: '#B58900',
                      color: '#FDF6E3',
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    Save & Connect
                  </button>
                  {isConnected && (
                    <button
                      onClick={handleClear}
                      className="px-4 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'rgba(220, 50, 47, 0.1)',
                        color: '#DC322F',
                        fontFamily: 'var(--font-serif)',
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 border-t border-[#B58900]/20"
                style={{ backgroundColor: 'rgba(181, 137, 0, 0.03)' }}
              >
                <p
                  className="text-xs text-center"
                  style={{ fontFamily: 'var(--font-mono)', color: '#657B83' }}
                >
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
