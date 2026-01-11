import { useMemo, useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { characters } from '../../data/characters';
import { buildFamilyTree, buildConnections } from './TreeLayout';
import type { TreeNode } from './TreeLayout';
import { CharacterNode } from './CharacterNode';
import { ConnectionLines } from './ConnectionLines';

interface FamilyTreeProps {
  currentChapter: number;
  onCharacterClick: (character: Character) => void;
}

export function FamilyTree({ currentChapter, onCharacterClick }: FamilyTreeProps) {
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
    return buildFamilyTree(characters, currentChapter, dimensions.width, dimensions.height);
  }, [currentChapter, dimensions]);

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
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.3), 2),
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale * 1.2 }))}
          className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-700"
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: prev.scale * 0.8 }))}
          className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-700"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="px-3 h-8 bg-white/80 hover:bg-white rounded-full shadow-md text-sm text-gray-700"
        >
          Reset
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400"></span>
          <span className="text-gray-700">Alive (Young)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-amber-600 ring-2 ring-amber-600 opacity-85"></span>
          <span className="text-gray-700">Alive (Aged)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400 ring-1 ring-gray-400 opacity-50"></span>
          <span className="text-gray-700">Deceased</span>
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
                status={node.status}
                x={node.x}
                y={node.y}
                onClick={onCharacterClick}
              />
            ))}
          </AnimatePresence>
        </g>
      </svg>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <p>Move the chapter slider to see the family tree grow...</p>
        </div>
      )}
    </div>
  );
}
