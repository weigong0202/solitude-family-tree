import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbientMusicProps {
  currentChapter: number;
}

export function AmbientMusic({ currentChapter }: AmbientMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Create ambient drone sounds using Web Audio API
  const createAmbientSound = useCallback(() => {
    if (audioContextRef.current) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;

    // Create layered drones for ambient atmosphere
    const frequencies = [
      { freq: 55, type: 'sine' as OscillatorType, gain: 0.15 },      // Low drone
      { freq: 82.5, type: 'sine' as OscillatorType, gain: 0.1 },     // Fifth above
      { freq: 110, type: 'triangle' as OscillatorType, gain: 0.08 }, // Octave
      { freq: 165, type: 'sine' as OscillatorType, gain: 0.05 },     // Higher fifth
      { freq: 220, type: 'sine' as OscillatorType, gain: 0.03 },     // Two octaves
    ];

    frequencies.forEach(({ freq, type, gain }) => {
      const oscillator = audioContext.createOscillator();
      const oscGain = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = freq;

      // Add subtle frequency modulation for organic feel
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 0.1 + Math.random() * 0.2;
      lfoGain.gain.value = freq * 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

      oscGain.gain.value = gain;
      oscillator.connect(oscGain);
      oscGain.connect(gainNode);
      oscillator.start();

      oscillatorsRef.current.push(oscillator);
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioContextRef.current) {
      createAmbientSound();
    }

    if (audioContextRef.current && gainNodeRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const now = audioContextRef.current.currentTime;
      if (isPlaying) {
        // Fade out
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
      } else {
        // Fade in
        gainNodeRef.current.gain.linearRampToValueAtTime(volume, now + 1);
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, volume, createAmbientSound]);

  // Adjust mood based on chapter
  useEffect(() => {
    if (!gainNodeRef.current || !audioContextRef.current || !isPlaying) return;

    // Subtle volume changes based on chapter mood
    let targetVolume = volume;
    if (currentChapter >= 18) {
      // Apocalyptic chapters - slightly louder, more ominous
      targetVolume = volume * 1.2;
    } else if (currentChapter >= 15) {
      // Rain chapters - softer
      targetVolume = volume * 0.8;
    }

    const now = audioContextRef.current.currentTime;
    gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, now + 2);
  }, [currentChapter, volume, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // Oscillator may already be stopped
        }
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current && isPlaying) {
      gainNodeRef.current.gain.linearRampToValueAtTime(
        newVolume,
        audioContextRef.current.currentTime + 0.1
      );
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className="relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main toggle button */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-colors duration-300 shadow-lg
            ${isPlaying
              ? 'bg-[#B58900] text-[#FDF6E3]'
              : 'bg-[#FDF6E3] text-[#586E75] border border-[#B58900]/30'
            }
          `}
          title={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </motion.button>

        {/* Volume slider - shows on hover */}
        <AnimatePresence>
          {showControls && isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-14 bottom-0 bg-[#FDF6E3] rounded-lg shadow-lg p-3 border border-[#B58900]/30"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#586E75]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-[#657B83] rounded-lg appearance-none cursor-pointer accent-[#B58900]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-[10px] text-center mt-1 text-[#657B83]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {isPlaying ? 'ambient' : 'music'}
      </motion.p>
    </div>
  );
}
