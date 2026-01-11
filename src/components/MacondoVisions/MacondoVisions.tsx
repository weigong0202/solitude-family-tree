import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KEY_MOMENTS,
  LOCATIONS,
  type ArtStyle,
  type SceneRequest,
  type GeneratedScene,
  getGeneratedScenes,
  getArtStylePrompt,
} from '../../services/macondoVisions';
import { generateSceneImage, isGeminiInitialized } from '../../services/gemini';

const ART_STYLES: { id: ArtStyle; name: string; description: string }[] = [
  { id: 'magical', name: 'Magical Realism', description: 'Dreamlike yet grounded' },
  { id: 'botero', name: 'Botero', description: 'Volumetric, rounded figures' },
  { id: 'kahlo', name: 'Frida Kahlo', description: 'Surreal, symbolic' },
  { id: 'tamayo', name: 'Tamayo', description: 'Modernist, vibrant' },
  { id: 'colonial', name: 'Colonial', description: 'Traditional Latin American' },
  { id: 'orozco', name: 'Orozco', description: 'Dramatic expressionist' },
];

type Tab = 'moments' | 'locations' | 'custom' | 'gallery';

export function MacondoVisions() {
  const [activeTab, setActiveTab] = useState<Tab>('moments');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('magical');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [selectedScene, setSelectedScene] = useState<GeneratedScene | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved scenes on mount
  useEffect(() => {
    setGeneratedScenes(getGeneratedScenes());
  }, []);

  const handleGenerate = async (prompt: string, type: SceneRequest['type'] = 'key_moment') => {
    if (!isGeminiInitialized()) {
      setError('Please configure your Gemini API key to generate images.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const request: SceneRequest = {
      type,
      prompt,
      artStyle: selectedStyle,
    };

    try {
      const scene = await generateSceneImage(request);
      if (scene) {
        setGeneratedScenes(prev => [scene, ...prev]);
        setSelectedScene(scene);
        setActiveTab('gallery');
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

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;
    handleGenerate(customPrompt.trim(), 'custom');
  };

  const isInitialized = isGeminiInitialized();

  return (
    <div className="h-full flex flex-col">
      {/* Style Selector */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm" style={{ fontFamily: 'Lora, serif', color: '#657B83' }}>
            Art Style:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ART_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedStyle === style.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                fontFamily: 'Lora, serif',
                backgroundColor: selectedStyle === style.id
                  ? 'rgba(181, 137, 0, 0.2)'
                  : 'rgba(181, 137, 0, 0.05)',
                border: `1px solid ${selectedStyle === style.id ? '#B58900' : 'rgba(181, 137, 0, 0.2)'}`,
                color: selectedStyle === style.id ? '#B58900' : '#657B83',
              }}
              title={style.description}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
      >
        {[
          { id: 'moments' as Tab, label: 'Key Moments', icon: '🎭' },
          { id: 'locations' as Tab, label: 'Locations', icon: '🏛️' },
          { id: 'custom' as Tab, label: 'Custom', icon: '✨' },
          { id: 'gallery' as Tab, label: `Gallery (${generatedScenes.length})`, icon: '🖼️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm transition-colors ${
              activeTab === tab.id ? 'border-b-2' : ''
            }`}
            style={{
              fontFamily: 'Lora, serif',
              color: activeTab === tab.id ? '#B58900' : '#93A1A1',
              borderColor: activeTab === tab.id ? '#B58900' : 'transparent',
              backgroundColor: activeTab === tab.id ? 'rgba(181, 137, 0, 0.05)' : 'transparent',
            }}
          >
            <span className="mr-1">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(220, 50, 47, 0.1)',
              color: '#DC322F',
              fontFamily: 'Lora, serif',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Generating overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎨
                </motion.div>
                <p
                  className="text-xl mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}
                >
                  Creating your vision...
                </p>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                >
                  Gemini 3 is painting your scene
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Moments Tab */}
        {activeTab === 'moments' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {KEY_MOMENTS.map(moment => (
              <motion.button
                key={moment.id}
                onClick={() => handleGenerate(moment.prompt, 'key_moment')}
                disabled={isGenerating || !isInitialized}
                className="text-left p-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: 'rgba(181, 137, 0, 0.05)',
                  border: '1px solid rgba(181, 137, 0, 0.2)',
                }}
                whileHover={{ boxShadow: '0 4px 20px rgba(181, 137, 0, 0.15)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎬</span>
                  <div>
                    <h3
                      className="font-semibold mb-1"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                    >
                      {moment.title}
                    </h3>
                    <p
                      className="text-xs mb-2"
                      style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                    >
                      Chapter {moment.chapter}
                    </p>
                    <p
                      className="text-sm"
                      style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
                    >
                      {moment.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {LOCATIONS.map(location => (
              <motion.button
                key={location.id}
                onClick={() => handleGenerate(location.prompt, 'location')}
                disabled={isGenerating || !isInitialized}
                className="text-left p-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: 'rgba(42, 161, 152, 0.05)',
                  border: '1px solid rgba(42, 161, 152, 0.2)',
                }}
                whileHover={{ boxShadow: '0 4px 20px rgba(42, 161, 152, 0.15)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <h3
                      className="font-semibold mb-1"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                    >
                      {location.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
                    >
                      {location.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: 'Playfair Display, serif', color: '#B58900' }}
              >
                Create Your Vision
              </h3>
              <p
                className="text-sm"
                style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
              >
                Describe any scene from One Hundred Years of Solitude
              </p>
            </div>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your scene... e.g., 'Úrsula in her old age, blind but still commanding the household, surrounded by grandchildren'"
              className="w-full h-32 p-4 rounded-lg text-sm resize-none outline-none"
              style={{
                fontFamily: 'Lora, serif',
                backgroundColor: 'rgba(238, 232, 213, 0.5)',
                border: '1px solid rgba(181, 137, 0, 0.2)',
                color: '#586E75',
              }}
            />

            <div className="mt-4 flex justify-between items-center">
              <p
                className="text-xs"
                style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
              >
                Style: {ART_STYLES.find(s => s.id === selectedStyle)?.name}
              </p>
              <motion.button
                onClick={handleCustomGenerate}
                disabled={!customPrompt.trim() || isGenerating || !isInitialized}
                className="px-6 py-2 rounded-lg disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #B58900, #D4A017)',
                  color: '#FDF6E3',
                  fontFamily: 'Playfair Display, serif',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Vision
              </motion.button>
            </div>

            {/* Example prompts */}
            <div className="mt-6">
              <p
                className="text-xs mb-2"
                style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
              >
                Try these:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Amaranta sewing her own shroud',
                  'The insomnia plague spreading through Macondo',
                  'Pietro Crespi playing the pianola',
                  'The ghost of Prudencio Aguilar',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomPrompt(example)}
                    className="px-2 py-1 rounded text-xs transition-colors hover:bg-opacity-20"
                    style={{
                      backgroundColor: 'rgba(181, 137, 0, 0.1)',
                      border: '1px solid rgba(181, 137, 0, 0.2)',
                      fontFamily: 'Lora, serif',
                      color: '#657B83',
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
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
                  Generate your first vision from the other tabs
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {generatedScenes.map(scene => (
                  <motion.button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className="relative rounded-lg overflow-hidden aspect-square"
                    style={{ backgroundColor: '#2D2118' }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img
                      src={scene.imageUrl}
                      alt={scene.request.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3"
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
        )}
      </div>

      {/* Scene Detail Modal */}
      <AnimatePresence>
        {selectedScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedScene(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full max-h-[90vh] rounded-xl overflow-hidden"
              style={{ backgroundColor: '#FDF6E3' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedScene.imageUrl}
                  alt={selectedScene.request.prompt}
                  className="w-full max-h-[60vh] object-contain"
                  style={{ backgroundColor: '#2D2118' }}
                />
                <button
                  onClick={() => setSelectedScene(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <p
                  className="text-sm mb-2"
                  style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                >
                  {selectedScene.request.prompt}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#93A1A1' }}>
                  <span>Style: {ART_STYLES.find(s => s.id === selectedScene.request.artStyle)?.name}</span>
                  <span>•</span>
                  <span>{new Date(selectedScene.timestamp).toLocaleDateString()}</span>
                </div>
                {selectedScene.caption && (
                  <blockquote
                    className="mt-3 pl-3 border-l-2 text-sm italic"
                    style={{
                      fontFamily: 'Lora, serif',
                      color: '#657B83',
                      borderColor: '#B58900',
                    }}
                  >
                    {selectedScene.caption}
                  </blockquote>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API not configured warning */}
      {!isInitialized && (
        <div
          className="p-4 text-center"
          style={{
            backgroundColor: 'rgba(181, 137, 0, 0.1)',
            borderTop: '1px solid rgba(181, 137, 0, 0.2)',
          }}
        >
          <p
            className="text-sm"
            style={{ fontFamily: 'Lora, serif', color: '#B58900' }}
          >
            Configure your Gemini API key to generate visions
          </p>
        </div>
      )}
    </div>
  );
}
