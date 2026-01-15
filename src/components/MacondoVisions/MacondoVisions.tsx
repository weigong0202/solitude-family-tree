import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KEY_MOMENTS,
  LOCATIONS,
  type SceneRequest,
  type GeneratedScene,
  getGeneratedScenes,
} from '../../services/macondoVisions';
import type { ArtStyle } from '../../services/macondoVisions';
import { generateSceneImage, isGeminiInitialized } from '../../services/gemini';

// Default art style
const DEFAULT_STYLE: ArtStyle = 'magical';

// Scene thumbnails/mood indicators
const SCENE_THUMBNAILS: Record<string, { emoji: string; mood: string; color: string }> = {
  // Key Moments
  'founding': { emoji: '🌅', mood: 'hopeful', color: '#B58900' },
  'ice': { emoji: '❄️', mood: 'wonder', color: '#268BD2' },
  'melquiades_room': { emoji: '📜', mood: 'mystical', color: '#6C71C4' },
  'war_departure': { emoji: '⚔️', mood: 'somber', color: '#586E75' },
  'gold_fish': { emoji: '🐟', mood: 'melancholic', color: '#B58900' },
  'remedios_ascension': { emoji: '🦋', mood: 'ethereal', color: '#D33682' },
  'rain': { emoji: '🌧️', mood: 'dreary', color: '#268BD2' },
  'banana_massacre': { emoji: '🚂', mood: 'tragic', color: '#DC322F' },
  'butterflies': { emoji: '💛', mood: 'romantic', color: '#B58900' },
  'final_aureliano': { emoji: '🌪️', mood: 'apocalyptic', color: '#CB4B16' },
  // Locations
  'house_buendia': { emoji: '🏠', mood: 'nostalgic', color: '#B58900' },
  'macondo_early': { emoji: '🌴', mood: 'idyllic', color: '#859900' },
  'macondo_decay': { emoji: '🍂', mood: 'melancholic', color: '#586E75' },
  'laboratory': { emoji: '⚗️', mood: 'obsessive', color: '#6C71C4' },
};

// Scene thumbnail type
interface SceneThumbnail {
  emoji: string;
  mood: string;
  color: string;
}

// Combined scene type
interface Scene {
  id: string;
  title: string;
  description: string;
  prompt: string;
  type: 'key_moment' | 'location';
  chapter?: number;
  thumbnail: SceneThumbnail;
}

// Combine all scenes with thumbnails
const KEY_MOMENT_SCENES: Scene[] = KEY_MOMENTS.map(m => ({
  ...m,
  type: 'key_moment' as const,
  thumbnail: SCENE_THUMBNAILS[m.id] || { emoji: '🎬', mood: 'dramatic', color: '#B58900' },
}));

const LOCATION_SCENES: Scene[] = LOCATIONS.map(l => ({
  ...l,
  type: 'location' as const,
  chapter: undefined,
  thumbnail: SCENE_THUMBNAILS[l.id] || { emoji: '🏛️', mood: 'atmospheric', color: '#2AA198' },
}));

const ALL_SCENES = [...KEY_MOMENT_SCENES, ...LOCATION_SCENES];

// Create a map for O(1) lookups by prompt
const SCENE_BY_PROMPT = new Map(ALL_SCENES.map(s => [s.prompt, s]));

interface SelectedPrompt {
  title: string;
  prompt: string;
  description: string;
  type: SceneRequest['type'];
  chapter?: number;
}

// Collapsible Section Component
const CollapsibleSection = memo(function CollapsibleSection({
  title,
  count,
  expanded,
  onToggle,
  children,
  accentColor,
}: {
  title: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: accentColor }}
          >
            ▶
          </motion.span>
          <h4
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
          >
            {title}
          </h4>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {count}
          </span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Scene Card Component with hover preview
const SceneCard = memo(function SceneCard({
  scene,
  isSelected,
  onClick,
}: {
  scene: Scene;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { emoji, mood, color } = scene.thumbnail;

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top,
        left: rect.right + 8,
      });
    }
    setShowPreview(true);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowPreview(false)}
        className="w-full text-left p-3 rounded-xl transition-all hover:shadow-md"
        style={{
          backgroundColor: isSelected ? `${color}15` : 'rgba(253, 246, 227, 0.8)',
          border: `2px solid ${isSelected ? color : 'rgba(181, 137, 0, 0.15)'}`,
          boxShadow: isSelected ? `0 0 0 2px ${color}30` : undefined,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <span className="text-lg">{emoji}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium leading-tight"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: isSelected ? color : '#586E75',
              }}
            >
              {scene.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {'chapter' in scene && scene.chapter && (
                <span
                  className="text-xs"
                  style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                >
                  Ch. {scene.chapter}
                </span>
              )}
              <span
                className="text-xs capitalize"
                style={{ fontFamily: 'Lora, serif', color: color }}
              >
                {mood}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Hover Preview Tooltip - Portal to body */}
      {createPortal(
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="fixed z-50 p-3 rounded-lg shadow-lg w-56 pointer-events-none"
              style={{
                top: tooltipPos.top,
                left: tooltipPos.left,
                backgroundColor: '#FDF6E3',
                border: `1px solid ${color}40`,
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
              >
                {scene.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
});

export function MacondoVisions() {
  const [selectedPrompt, setSelectedPrompt] = useState<SelectedPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [currentResult, setCurrentResult] = useState<GeneratedScene | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collapsible section states (expanded by default)
  const [momentsExpanded, setMomentsExpanded] = useState(true);
  const [locationsExpanded, setLocationsExpanded] = useState(true);

  // Memoized toggle handlers
  const toggleMoments = useCallback(() => setMomentsExpanded(v => !v), []);
  const toggleLocations = useCallback(() => setLocationsExpanded(v => !v), []);

  // Load saved scenes on mount
  useEffect(() => {
    setGeneratedScenes(getGeneratedScenes());
  }, []);

  const handleSelectScene = useCallback((scene: Scene) => {
    // Find the most recent generated image for this scene's prompt
    const existingImage = generatedScenes.find(
      (gs) => gs.request.prompt === scene.prompt
    );

    setSelectedPrompt({
      title: scene.title,
      prompt: scene.prompt,
      description: scene.description,
      type: scene.type,
      chapter: scene.chapter,
    });
    setShowCustomInput(false);

    // Show existing image if found, otherwise null
    setCurrentResult(existingImage || null);
    setError(null);
  }, [generatedScenes]);

  const handleEnterCustomMode = useCallback(() => {
    setSelectedPrompt(null);
    setShowCustomInput(true);
    setCustomPrompt('');
    setCurrentResult(null);
    setError(null);
  }, []);

  const handleGenerateCustom = useCallback(() => {
    if (!customPrompt.trim()) return;
    setSelectedPrompt({
      title: 'Custom Vision',
      prompt: customPrompt.trim(),
      description: customPrompt.trim(),
      type: 'custom',
    });
  }, [customPrompt]);

  const handleGenerate = useCallback(async () => {
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
  }, [selectedPrompt]);

  const handleGalleryItemClick = useCallback((scene: GeneratedScene) => {
    const matchedScene = SCENE_BY_PROMPT.get(scene.request.prompt);
    setCurrentResult(scene);
    setSelectedPrompt({
      title: matchedScene?.title || 'Custom Vision',
      prompt: scene.request.prompt,
      description: matchedScene?.description || scene.request.prompt,
      type: scene.request.type,
    });
    setShowCustomInput(false);
    setShowGallery(false);
  }, []);

  const isInitialized = isGeminiInitialized();

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Controls */}
      <div
        className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r h-full overflow-hidden"
        style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 p-4 border-b"
          style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
        >
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
          >
            Select a Scene
          </h2>
          <p
            className="text-sm mt-1"
            style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
          >
            Choose a moment or location to visualize
          </p>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Key Moments Section */}
          <CollapsibleSection
            title="Key Moments"
            count={KEY_MOMENT_SCENES.length}
            expanded={momentsExpanded}
            onToggle={toggleMoments}
            accentColor="#B58900"
          >
            {KEY_MOMENT_SCENES.map(scene => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isSelected={selectedPrompt?.title === scene.title}
                onClick={() => handleSelectScene(scene)}
              />
            ))}
          </CollapsibleSection>

          {/* Locations Section */}
          <CollapsibleSection
            title="Locations"
            count={LOCATION_SCENES.length}
            expanded={locationsExpanded}
            onToggle={toggleLocations}
            accentColor="#2AA198"
          >
            {LOCATION_SCENES.map(scene => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isSelected={selectedPrompt?.title === scene.title}
                onClick={() => handleSelectScene(scene)}
              />
            ))}
          </CollapsibleSection>

          {/* Custom Scene Button */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(108, 113, 196, 0.15)' }}>
            <button
              onClick={handleEnterCustomMode}
              className="w-full text-left p-3 rounded-xl transition-all hover:shadow-sm"
              style={{
                backgroundColor: showCustomInput ? 'rgba(108, 113, 196, 0.1)' : 'rgba(253, 246, 227, 0.8)',
                border: `1px solid ${showCustomInput ? '#6C71C4' : 'rgba(181, 137, 0, 0.15)'}`,
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">✨</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-tight"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: showCustomInput ? '#6C71C4' : '#586E75',
                    }}
                  >
                    Imagine Your Own Scene
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                  >
                    Describe a custom scene to visualize
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Gallery Link - Fixed at bottom */}
        <button
          onClick={() => setShowGallery(true)}
          className="flex-shrink-0 p-4 border-t flex items-center justify-between hover:bg-black/5 transition-colors"
          style={{ borderColor: 'rgba(181, 137, 0, 0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(181, 137, 0, 0.1)' }}
            >
              <span>🖼️</span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
            >
              Your Gallery
            </span>
          </div>
          <span
            className="text-sm px-2 py-1 rounded-full font-medium"
            style={{
              backgroundColor: generatedScenes.length > 0 ? 'rgba(181, 137, 0, 0.15)' : 'rgba(147, 161, 161, 0.15)',
              color: generatedScenes.length > 0 ? '#B58900' : '#586E75',
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
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  {selectedPrompt?.title}
                </h3>
                {currentResult.timestamp && (
                  <p
                    className="text-sm mb-3"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                  >
                    Generated {new Date(currentResult.timestamp).toLocaleDateString()}
                  </p>
                )}
                {selectedPrompt?.description && (
                  <p
                    className="text-sm max-w-xl mx-auto mb-4"
                    style={{ fontFamily: 'Lora, serif', color: '#657B83' }}
                  >
                    {selectedPrompt.description}
                  </p>
                )}
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
                  ✨ Regenerate Vision
                </motion.button>
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
                    className="text-sm"
                    style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
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
                  className="mt-3 text-sm"
                  style={{ fontFamily: 'Lora, serif', color: '#DC322F' }}
                >
                  Gemini API key required
                </p>
              )}
            </motion.div>
          ) : showCustomInput ? (
            /* State: Custom Input Mode */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-4">
                <span className="text-5xl block mb-2">🎨</span>
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#586E75' }}
                >
                  Imagine Your Own Scene
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'Lora, serif', color: '#93A1A1' }}
                >
                  Describe a scene from the novel to visualize
                </p>
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="The room where Melquíades wrote the parchments, filled with ancient manuscripts and alchemical instruments..."
                rows={4}
                className="w-full p-3 rounded-lg text-base resize-none outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                style={{
                  fontFamily: 'Lora, serif',
                  backgroundColor: 'rgba(253, 246, 227, 0.5)',
                  border: '1px solid rgba(108, 113, 196, 0.2)',
                  color: '#586E75',
                }}
              />

              <motion.button
                onClick={handleGenerateCustom}
                disabled={!customPrompt.trim()}
                className="w-full py-3 rounded-lg text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  background: customPrompt.trim()
                    ? 'linear-gradient(135deg, #6C71C4, rgba(108, 113, 196, 0.8))'
                    : 'rgba(108, 113, 196, 0.3)',
                  color: '#FDF6E3',
                  boxShadow: customPrompt.trim() ? '0 4px 15px rgba(108, 113, 196, 0.3)' : 'none',
                }}
                whileHover={customPrompt.trim() ? { scale: 1.02 } : {}}
                whileTap={customPrompt.trim() ? { scale: 0.98 } : {}}
              >
                ✨ Use This Scene
              </motion.button>
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
                      className="text-base"
                      style={{ fontFamily: 'Lora, serif', color: '#586E75' }}
                    >
                      Generate your first vision to see it here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedScenes.map(scene => {
                      const matchedScene = SCENE_BY_PROMPT.get(scene.request.prompt);
                      return (
                        <motion.button
                          key={scene.id}
                          onClick={() => handleGalleryItemClick(scene)}
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
                              className="text-sm text-white line-clamp-2"
                              style={{ fontFamily: 'Lora, serif' }}
                            >
                              {matchedScene?.title || 'Custom Vision'}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
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
