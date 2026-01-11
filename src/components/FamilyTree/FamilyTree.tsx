import { useMemo, useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { characters } from '../../data/characters';
import { buildFamilyTree, buildConnections } from './TreeLayout';
import type { TreeNode } from './TreeLayout';
import { CharacterNode } from './CharacterNode';
import { ConnectionLines } from './ConnectionLines';

interface FamilyTreeProps {
  onCharacterClick: (character: Character) => void;
}

export function FamilyTree({ onCharacterClick }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 600) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const nodes = useMemo<TreeNode[]>(() => {
    return buildFamilyTree(characters, dimensions.width, dimensions.height);
  }, [dimensions]);

  const connections = useMemo(() => {
    return buildConnections(nodes, characters);
  }, [nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Slow scroll to pan
    const scrollSpeed = 0.5;
    setTransform(prev => ({
      ...prev,
      x: prev.x - (e.shiftKey ? e.deltaY * scrollSpeed : e.deltaX * scrollSpeed),
      y: prev.y - (e.shiftKey ? 0 : e.deltaY * scrollSpeed),
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-lg overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ background: 'transparent', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale * 1.2 }))}
          className="w-8 h-8 rounded-full shadow-md flex items-center justify-center"
          style={{ background: 'rgba(42, 161, 152, 0.2)', color: '#2AA198', border: '1px solid #2AA19850' }}
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale * 0.8 }))}
          className="w-8 h-8 rounded-full shadow-md flex items-center justify-center"
          style={{ background: 'rgba(42, 161, 152, 0.2)', color: '#2AA198', border: '1px solid #2AA19850' }}
        >
          -
        </button>
        <button
          onClick={resetView}
          className="px-3 h-8 rounded-full shadow-md text-sm"
          style={{ background: 'rgba(42, 161, 152, 0.2)', color: '#2AA198', border: '1px solid #2AA19850' }}
        >
          Reset
        </button>
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 z-10 p-3 rounded-lg"
        style={{ background: 'rgba(29, 21, 16, 0.9)', border: '1px solid #4A3728' }}
      >
        <p className="text-xs mb-2" style={{ color: '#93A1A1', fontFamily: 'Lora, serif' }}>
          Connections
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg width="24" height="2">
              <line x1="0" y1="1" x2="24" y2="1" stroke="#4A3728" strokeWidth="2" />
            </svg>
            <span className="text-xs" style={{ color: '#EEE8D5' }}>Parent → Child</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="2">
              <line x1="0" y1="1" x2="24" y2="1" stroke="#B58900" strokeWidth="2" strokeDasharray="4,2" />
            </svg>
            <span className="text-xs" style={{ color: '#EEE8D5' }}>Marriage</span>
          </div>
        </div>
      </div>

      {/* SVG Tree */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Connections first (behind nodes) */}
          <ConnectionLines connections={connections} />

          {/* Character nodes */}
          <AnimatePresence>
            {nodes.map(node => (
              <CharacterNode
                key={node.character.id}
                character={node.character}
                x={node.x}
                y={node.y}
                onClick={onCharacterClick}
              />
            ))}
          </AnimatePresence>
        </g>
      </svg>

    </div>
  );
}
