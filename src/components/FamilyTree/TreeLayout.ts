import type { Character } from '../../types';

export interface TreeNode {
  character: Character;
  x: number;
  y: number;
  isOutsider?: boolean; // Not a Buendía by blood
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: 'parent-child' | 'spouse';
}

// Manual positions for optimal layout
// Designed to:
// 1. Keep spouses adjacent
// 2. Center children under parents
// 3. Separate branches visually
// 4. Minimize line crossings
const manualPositions: Record<string, { x: number; y: number; isOutsider?: boolean }> = {
  // Generation 1 - Founders (y = 60)
  'jose-arcadio-buendia': { x: 500, y: 60 },
  'ursula': { x: 620, y: 60 },
  'melquiades': { x: 800, y: 60, isOutsider: true },

  // Generation 2 - Children of founders (y = 180)
  'jose-arcadio-son': { x: 200, y: 180 },
  'rebeca': { x: 320, y: 180, isOutsider: true },
  'colonel-aureliano': { x: 560, y: 180 },
  'remedios-moscote': { x: 680, y: 180, isOutsider: true },
  'amaranta': { x: 860, y: 180 },
  'pilar-ternera': { x: 1040, y: 180, isOutsider: true },

  // Generation 3 - Grandchildren (y = 300)
  'arcadio': { x: 280, y: 300 },
  'santa-sofia': { x: 400, y: 300, isOutsider: true },
  'aureliano-jose': { x: 620, y: 300 },

  // Generation 4 - Great-grandchildren (y = 420)
  'remedios-la-bella': { x: 120, y: 420 },
  'jose-arcadio-segundo': { x: 280, y: 420 },
  'aureliano-segundo': { x: 440, y: 420 },
  'fernanda': { x: 560, y: 420, isOutsider: true },
  'petra-cotes': { x: 740, y: 420, isOutsider: true },

  // Generation 5 - Great-great-grandchildren (y = 540)
  'jose-arcadio-iii': { x: 320, y: 540 },
  'renata-remedios': { x: 480, y: 540 },
  'amaranta-ursula': { x: 640, y: 540 },
  'gaston': { x: 760, y: 540, isOutsider: true },
  'mauricio-babilonia': { x: 920, y: 540, isOutsider: true },

  // Generation 6 (y = 660)
  'aureliano-babilonia': { x: 560, y: 660 },

  // Generation 7 - The End (y = 780)
  'aureliano-pig-tail': { x: 560, y: 780 },
};

export function buildFamilyTree(
  characters: Character[],
  _width: number,
  _height: number
): TreeNode[] {
  const nodes: TreeNode[] = [];

  characters.forEach(character => {
    const position = manualPositions[character.id];
    if (position) {
      nodes.push({
        character,
        x: position.x,
        y: position.y,
        isOutsider: position.isOutsider,
      });
    }
  });

  return nodes;
}

export function buildConnections(
  nodes: TreeNode[],
  characters: Character[]
): Connection[] {
  const connections: Connection[] = [];
  const nodeMap = new Map<string, TreeNode>();

  nodes.forEach(node => {
    nodeMap.set(node.character.id, node);
  });

  // Build connections from character relationships
  characters.forEach(character => {
    const node = nodeMap.get(character.id);
    if (!node) return;

    // Parent-child connections
    character.parentIds.forEach(parentId => {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        connections.push({
          id: `parent-${parentId}-${character.id}`,
          sourceId: parentId,
          targetId: character.id,
          sourceX: parentNode.x,
          sourceY: parentNode.y + 35,
          targetX: node.x,
          targetY: node.y - 35,
          type: 'parent-child',
        });
      }
    });

    // Spouse connections (only add once per pair)
    character.spouseIds.forEach(spouseId => {
      const spouseNode = nodeMap.get(spouseId);
      if (spouseNode && character.id < spouseId) {
        connections.push({
          id: `spouse-${character.id}-${spouseId}`,
          sourceId: character.id,
          targetId: spouseId,
          sourceX: node.x + 35,
          sourceY: node.y,
          targetX: spouseNode.x - 35,
          targetY: spouseNode.y,
          type: 'spouse',
        });
      }
    });
  });

  return connections;
}

export function generateCurvePath(conn: Connection): string {
  if (conn.type === 'spouse') {
    // Horizontal line for spouses
    return `M ${conn.sourceX} ${conn.sourceY} L ${conn.targetX} ${conn.targetY}`;
  }

  // Curved line for parent-child
  const midY = (conn.sourceY + conn.targetY) / 2;
  return `M ${conn.sourceX} ${conn.sourceY}
          C ${conn.sourceX} ${midY}, ${conn.targetX} ${midY}, ${conn.targetX} ${conn.targetY}`;
}

// Get all related character IDs for hover highlighting
export function getRelatedCharacterIds(
  characterId: string,
  characters: Character[]
): {
  spouseIds: string[];
  parentIds: string[];
  childIds: string[];
} {
  const character = characters.find(c => c.id === characterId);
  if (!character) {
    return { spouseIds: [], parentIds: [], childIds: [] };
  }

  const childIds = characters
    .filter(c => c.parentIds.includes(characterId))
    .map(c => c.id);

  return {
    spouseIds: character.spouseIds,
    parentIds: character.parentIds,
    childIds,
  };
}
