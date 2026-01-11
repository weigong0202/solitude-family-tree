import { motion } from 'framer-motion';
import type { Connection } from './TreeLayout';
import { generateCurvePath } from './TreeLayout';

interface ConnectionLinesProps {
  connections: Connection[];
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  return (
    <g className="connections">
      {connections.map(conn => (
        <motion.path
          key={conn.id}
          d={generateCurvePath(conn)}
          fill="none"
          stroke={conn.type === 'spouse' ? '#B58900' : '#4A3728'}
          strokeWidth={conn.type === 'spouse' ? 2 : 1.5}
          strokeDasharray={conn.type === 'spouse' ? '5,5' : 'none'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}
