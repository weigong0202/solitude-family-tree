import { motion } from 'framer-motion';
import type { Connection } from './TreeLayout';
import { generateCurvePath } from './TreeLayout';

interface ConnectionLinesProps {
  connections: Connection[];
  hoveredCharacterId: string | null;
  relatedIds: {
    spouseIds: string[];
    parentIds: string[];
    childIds: string[];
  };
}

export function ConnectionLines({
  connections,
  hoveredCharacterId,
  relatedIds,
}: ConnectionLinesProps) {
  const getConnectionHighlight = (conn: Connection): {
    opacity: number;
    strokeColor: string;
    strokeWidth: number;
    glow: boolean;
  } => {
    // No hover - show all connections normally
    if (!hoveredCharacterId) {
      return {
        opacity: 0.6,
        strokeColor: conn.type === 'spouse' ? '#B58900' : '#4A3728',
        strokeWidth: conn.type === 'spouse' ? 2 : 1.5,
        glow: false,
      };
    }

    // Check if this connection involves the hovered character
    const involvesHovered =
      conn.sourceId === hoveredCharacterId || conn.targetId === hoveredCharacterId;

    if (!involvesHovered) {
      // Dim unrelated connections
      return {
        opacity: 0.1,
        strokeColor: conn.type === 'spouse' ? '#B58900' : '#4A3728',
        strokeWidth: conn.type === 'spouse' ? 1 : 1,
        glow: false,
      };
    }

    // Highlight related connections
    if (conn.type === 'spouse') {
      return {
        opacity: 1,
        strokeColor: '#B58900',
        strokeWidth: 3,
        glow: true,
      };
    }

    // Parent-child connection
    const isParentConnection = relatedIds.parentIds.includes(
      conn.sourceId === hoveredCharacterId ? conn.targetId : conn.sourceId
    );
    const isChildConnection = relatedIds.childIds.includes(
      conn.sourceId === hoveredCharacterId ? conn.targetId : conn.sourceId
    );

    if (isParentConnection) {
      return {
        opacity: 1,
        strokeColor: '#2AA198', // Teal for parents
        strokeWidth: 3,
        glow: true,
      };
    }

    if (isChildConnection) {
      return {
        opacity: 1,
        strokeColor: '#268BD2', // Blue for children
        strokeWidth: 3,
        glow: true,
      };
    }

    // Default highlighted state
    return {
      opacity: 1,
      strokeColor: '#EEE8D5',
      strokeWidth: 2,
      glow: true,
    };
  };

  return (
    <g className="connections">
      {connections.map(conn => {
        const highlight = getConnectionHighlight(conn);
        const filter = highlight.glow
          ? `drop-shadow(0 0 4px ${highlight.strokeColor})`
          : 'none';

        return (
          <motion.path
            key={conn.id}
            d={generateCurvePath(conn)}
            fill="none"
            stroke={highlight.strokeColor}
            strokeWidth={highlight.strokeWidth}
            strokeDasharray={conn.type === 'spouse' ? '6,4' : 'none'}
            strokeLinecap="round"
            style={{ filter }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: highlight.opacity,
              strokeWidth: highlight.strokeWidth,
              stroke: highlight.strokeColor,
            }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </g>
  );
}
