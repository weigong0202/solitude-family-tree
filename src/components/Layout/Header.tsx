import { useState } from 'react';
import { initializeGemini, isGeminiInitialized } from '../../services/gemini';

interface HeaderProps {
  onApiKeySet: () => void;
}

export function Header({ onApiKeySet }: HeaderProps) {
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(isGeminiInitialized());

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      initializeGemini(apiKey.trim());
      setIsConnected(true);
      setShowApiInput(false);
      setApiKey('');
      onApiKeySet();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-800">
              One Hundred Years of Solitude
            </h1>
            <p className="text-xs text-gray-500">
              Interactive Family Tree
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Gemini connection status */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span className="text-xs text-gray-600">
              {isConnected ? 'Gemini Connected' : 'Gemini Offline'}
            </span>
          </div>

          {!isConnected && (
            <div className="relative">
              <button
                onClick={() => setShowApiInput(!showApiInput)}
                className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Connect Gemini
              </button>

              {showApiInput && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSetApiKey}
                      className="flex-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => setShowApiInput(false)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Get your API key from{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
