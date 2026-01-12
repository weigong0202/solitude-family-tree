import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KEY_MOMENTS,
  LOCATIONS,
  type ArtStyle,
  type SceneRequest,
  type GeneratedScene,
  getGeneratedScenes,
} from '../../services/macondoVisions';
import { generateSceneImage, isGeminiInitialized } from '../../services/gemini';

// Default art style
const DEFAULT_STYLE: ArtStyle = 'magical';

// Combine all scenes into one list
const ALL_SCENES = [
  ...KEY_MOMENTS.map(m => ({ ...m, type: 'key_moment' as const, icon: '🎬' })),
  ...LOCATIONS.map(l => ({ ...l, type: 'location' as const, icon: '🏛️', chapter: undefined })),
];

interface SelectedPrompt {
  title: string;
  prompt: string;
  type: SceneRequest['type'];
  chapter?: number;
}

export function MacondoVisions() {
  const [selectedPrompt, setSelectedPrompt] = useState<SelectedPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [currentResult, setCurrentResult] = useState<GeneratedScene | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved scenes on mount
  useEffect(() => {
    setGeneratedScenes(getGeneratedScenes());
  }, []);

  const handleSelectScene = (scene: typeof ALL_SCENES[0]) => {
    setSelectedPrompt({
      title: scene.title,
      prompt: scene.prompt,
      type: scene.type,
      chapter: scene.chapter,
    });
    setCurrentResult(null);
    setError(null);
  };

  const handleSelectCustom = () => {
    if (!customPrompt.trim()) return;
    setSelectedPrompt({
      title: 'Custom Vision',
      prompt: customPrompt.trim(),
      type: 'custom',
    });
    setCurrentResult(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedPrompt || !isGeminiInitialized()) {
      setError('Please configure your Gemini API key to generate images.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const request: SceneRequest = {
      type: selectedPrompt.type,
      prompt: selectedPrompt.prompt,
      artStyle: DEFAULT_STYLE,
    };

    try {
      const scene = await generateSceneImage(request);
      if (scene) {
        setGeneratedScenes(prev => [scene, ...prev]);
        setCurrentResult(scene);
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('An error occurred while generating the image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isInitialized = isGeminiInitialized();

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Controls */}
      <div
        className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r h-full overflow-hidden"
        style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
      >
        {/* Scene List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3
              className="text-sm font-semibold mb-3"
              style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
            >
              Select a Scene
            </h3>

            {/* Key Moments Section */}
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
            >
              Key Moments
            </p>
            <div className="space-y-1 mb-4">
              {ALL_SCENES.filter(s => s.type === 'key_moment').map(scene => (
                <button
                  key={scene.id}
                  onClick={() => handleSelectScene(scene)}
                  className={`w-full text-left p-2 rounded-lg transition-all ${
                    selectedPrompt?.title === scene.title ? 'ring-2 ring-[#B58900]' : 'hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: selectedPrompt?.title === scene.title
                      ? 'rgba(181, 137, 0, 0.1)'
                      : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{scene.icon}</span>
                    <div className="min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{
                          fontFamily: 'Lora, serif',
                          color: selectedPrompt?.title === scene.title ? '#B58900' : '#586E75',
                        }}
                      >
                        {scene.title}
                      </p>
                      {scene.chapter && (
                        <p
                          className="text-[10px]"
                          style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                        >
                          Chapter {scene.chapter}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Locations Section */}
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
            >
              Locations
            </p>
            <div className="space-y-1 mb-4">
              {ALL_SCENES.filter(s => s.type === 'location').map(scene => (
                <button
                  key={scene.id}
                  onClick={() => handleSelectScene(scene)}
                  className={`w-full text-left p-2 rounded-lg transition-all ${
                    selectedPrompt?.title === scene.title ? 'ring-2 ring-[#2AA198]' : 'hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: selectedPrompt?.title === scene.title
                      ? 'rgba(42, 161, 152, 0.1)'
                      : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{scene.icon}</span>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: 'Lora, serif',
                        color: selectedPrompt?.title === scene.title ? '#2AA198' : '#586E75',
                      }}
                    >
                      {scene.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
            >
              Custom Scene
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your own scene..."
              className="w-full h-20 p-2 rounded-lg text-sm resize-none outline-none"
              style={{
                fontFamily: 'Lora, serif',
                backgroundColor: 'rgba(238, 232, 213, 0.5)',
                border: '1px solid rgba(181, 137, 0, 0.2)',
                color: '#586E75',
              }}
            />
            <button
              onClick={handleSelectCustom}
              disabled={!customPrompt.trim()}
              className="mt-2 w-full py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              style={{
                fontFamily: 'Lora, serif',
                backgroundColor: 'rgba(181, 137, 0, 0.1)',
                border: '1px solid rgba(181, 137, 0, 0.3)',
                color: '#B58900',
              }}
            >
              Use Custom Scene
            </button>
          </div>
        </div>

        {/* Gallery Link - Fixed at bottom */}
        <button
          onClick={() => setShowGallery(true)}
          className="flex-shrink-0 p-3 border-t flex items-center justify-between hover:bg-black/5 transition-colors"
          style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
        >
          <div className="flex items-center gap-2">
            <span>🖼️</span>
            <span
              className="text-sm"
              style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
            >
              Your Gallery
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(181, 137, 0, 0.15)',
              color: '#B58900',
              fontFamily: 'Lora, serif',
            }}
          >
            {generatedScenes.length}
          </span>
        </button>
      </div>

      {/* Right Panel - Preview / Canvas (no scroll) */}
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        <div
          className="flex-1 p-6 flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: 'rgba(45, 33, 24, 0.03)' }}
        >
          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg text-sm max-w-md"
              style={{
                backgroundColor: 'rgba(220, 50, 47, 0.1)',
                color: '#DC322F',
                fontFamily: 'Lora, serif',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* State: Generating */}
          {isGenerating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-md"
            >
              <div
                className="w-64 h-64 mx-auto rounded-xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'rgba(181, 137, 0, 0.1)',
                  border: '2px solid rgba(181, 137, 0, 0.3)',
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl"
                >
                  🎨
                </motion.div>
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}
              >
                Creating your vision...
              </h3>
              <p
                className="text-sm mb-1"
                style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
              >
                {selectedPrompt?.title}
              </p>
            </motion.div>
          ) : currentResult ? (
            /* State: Result */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl"
            >
              <div
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: '#2D2118' }}
              >
                <img
                  src={currentResult.imageUrl}
                  alt={currentResult.request.prompt}
                  className="w-full max-h-[50vh] object-contain"
                />
              </div>
              <div className="mt-4 text-center">
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  {selectedPrompt?.title}
                </h3>
                {currentResult.caption && (
                  <p
                    className="text-sm italic max-w-md mx-auto"
                    style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
                  >
                    "{currentResult.caption}"
                  </p>
                )}
                <button
                  onClick={() => {
                    setCurrentResult(null);
                    setSelectedPrompt(null);
                  }}
                  className="mt-4 px-4 py-2 rounded-lg text-sm"
                  style={{
                    fontFamily: 'Lora, serif',
                    backgroundColor: 'rgba(181, 137, 0, 0.1)',
                    border: '1px solid rgba(181, 137, 0, 0.3)',
                    color: '#B58900',
                  }}
                >
                  Create Another
                </button>
              </div>
            </motion.div>
          ) : selectedPrompt ? (
            /* State: Prompt Selected - Ready to Generate */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-md"
            >
              <div
                className="w-64 h-64 mx-auto rounded-xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'rgba(181, 137, 0, 0.05)',
                  border: '2px dashed rgba(181, 137, 0, 0.3)',
                }}
              >
                <div className="text-center p-4">
                  <span className="text-4xl block mb-2">✨</span>
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                  >
                    Your vision will appear here
                  </p>
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
              >
                {selectedPrompt.title}
              </h3>

              <p
                className="text-sm mb-6"
                style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
              >
                {selectedPrompt.prompt.slice(0, 100)}...
              </p>

              <motion.button
                onClick={handleGenerate}
                disabled={!isInitialized}
                className="px-8 py-3 rounded-xl text-base disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #B58900, #D4A017)',
                  color: '#FDF6E3',
                  fontFamily: 'Playfair Display, serif',
                  boxShadow: '0 4px 15px rgba(181, 137, 0, 0.3)',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(181, 137, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Vision
              </motion.button>

              {!isInitialized && (
                <p
                  className="mt-3 text-xs"
                  style={{ fontFamily: 'Lora, serif', color: '#DC322F' }}
                >
                  Gemini API key required
                </p>
              )}
            </motion.div>
          ) : (
            /* State: Empty - Welcome */
            <div className="text-center max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-6xl block mb-4">🎨</span>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  Create Your Vision
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
                >
                  Generate AI illustrations of scenes from One Hundred Years of Solitude.
                  Select a scene from the left panel to begin.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col"
              style={{ backgroundColor: '#FDF6E3' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Gallery Header */}
              <div
                className="p-4 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  Your Gallery ({generatedScenes.length})
                </h3>
                <button
                  onClick={() => setShowGallery(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10"
                  style={{ color: '#586E75' }}
                >
                  ×
                </button>
              </div>

              {/* Gallery Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {generatedScenes.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl mb-4 block">🖼️</span>
                    <p
                      className="text-lg mb-2"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                    >
                      Your gallery is empty
                    </p>
                    <p
                      className="text-sm"
                      style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                    >
                      Generate your first vision to see it here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedScenes.map(scene => (
                      <motion.button
                        key={scene.id}
                        onClick={() => {
                          setCurrentResult(scene);
                          setSelectedPrompt({
                            title: scene.request.prompt.slice(0, 50),
                            prompt: scene.request.prompt,
                            type: scene.request.type,
                          });
                          setShowGallery(false);
                        }}
                        className="relative rounded-lg overflow-hidden aspect-square group"
                        style={{ backgroundColor: '#2D2118' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={scene.imageUrl}
                          alt={scene.request.prompt}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"
                        >
                          <p
                            className="text-xs text-white line-clamp-2"
                            style={{ fontFamily: 'Lora, serif' }}
                          >
                            {scene.request.prompt.slice(0, 100)}...
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
