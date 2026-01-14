import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Character } from '../../types';
import { characters } from '../../data/characters';
import { buildFamilyTree, buildConnections, getRelatedCharacterIds } from './TreeLayout';
import { CharacterNode, type HighlightState } from './CharacterNode';
import { ConnectionLines } from './ConnectionLines';
import { colors, fonts } from '../../constants/theme';

interface FamilyTreeProps {
  onCharacterClick: (character: Character) => void;
}

export function FamilyTree({ onCharacterClick }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCharacterId, setHoveredCharacterId] = useState<string | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 900) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const nodes = useMemo(() => {
    return buildFamilyTree(characters);
  }, []);

  const connections = useMemo(() => {
    return buildConnections(nodes, characters);
  }, [nodes]);

  const relatedIds = useMemo(() => {
    if (!hoveredCharacterId) {
      return { spouseIds: [], parentIds: [], childIds: [] };
    }
    return getRelatedCharacterIds(hoveredCharacterId, characters);
  }, [hoveredCharacterId]);

  const getHighlightState = useCallback((characterId: string): HighlightState => {
    if (!hoveredCharacterId) return 'none';
    if (characterId === hoveredCharacterId) return 'hovered';
    if (relatedIds.spouseIds.includes(characterId)) return 'spouse';
    if (relatedIds.parentIds.includes(characterId)) return 'parent';
    if (relatedIds.childIds.includes(characterId)) return 'child';
    return 'dimmed';
  }, [hoveredCharacterId, relatedIds]);

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
    const scrollSpeed = 0.5;
    setTransform(prev => ({
      ...prev,
      x: prev.x - (e.shiftKey ? e.deltaY * scrollSpeed : e.deltaX * scrollSpeed),
      y: prev.y - (e.shiftKey ? 0 : e.deltaY * scrollSpeed),
    }));
  };

  const zoomIn = () => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }));
  const zoomOut = () => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.5) }));
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

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
          onClick={zoomIn}
          aria-label="Zoom in"
          className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: colors.withAlpha(colors.teal, 0.2),
            color: colors.teal,
            border: `1px solid ${colors.withAlpha(colors.teal, 0.3)}`
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          aria-label="Zoom out"
          className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: colors.withAlpha(colors.teal, 0.2),
            color: colors.teal,
            border: `1px solid ${colors.withAlpha(colors.teal, 0.3)}`
          }}
        >
          −
        </button>
        <button
          onClick={resetView}
          aria-label="Reset view"
          className="px-3 h-8 rounded-full shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: colors.withAlpha(colors.teal, 0.2),
            color: colors.teal,
            border: `1px solid ${colors.withAlpha(colors.teal, 0.3)}`
          }}
        >
          Reset
        </button>
      </div>

      {/* Legend - positioned top-right under controls */}
      <div
        className="absolute top-16 right-4 z-10 p-3 rounded-lg"
        style={{ background: colors.withAlpha(colors.backgroundDark, 0.95), border: `1px solid ${colors.backgroundBrown}` }}
      >
        <p className="text-xs mb-2 font-semibold" style={{ color: colors.textLight, fontFamily: fonts.body }}>
          Hover over a character
        </p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.teal }} />
            <span style={{ color: colors.textMuted }}>Parents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.gold }} />
            <span style={{ color: colors.textMuted }}>Spouse</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.blue }} />
            <span style={{ color: colors.textMuted }}>Children</span>
          </div>
        </div>
        <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${colors.backgroundBrown}` }}>
          <div className="flex items-center gap-2 text-xs">
            <span
              className="w-4 h-4 rounded-full"
              style={{ border: `1.5px dashed ${colors.textMuted}`, backgroundColor: 'transparent' }}
            />
            <span style={{ color: colors.textMuted }}>Non-Buendía</span>
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
          <ConnectionLines
            connections={connections}
            hoveredCharacterId={hoveredCharacterId}
            relatedIds={relatedIds}
          />

          {/* Character nodes */}
          <AnimatePresence>
            {nodes.map(node => (
              <CharacterNode
                key={node.character.id}
                character={node.character}
                x={node.x}
                y={node.y}
                isOutsider={node.isOutsider}
                highlightState={getHighlightState(node.character.id)}
                onHover={setHoveredCharacterId}
                onClick={onCharacterClick}
              />
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
}
