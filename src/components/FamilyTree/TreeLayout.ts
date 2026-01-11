import type { Character, CharacterStatus } from '../../types';
import { getCharacterStatus } from '../../data/characters';

export interface TreeNode {
  character: Character;
  status: CharacterStatus;
  x: number;
  y: number;
  children?: TreeNode[];
}

export function buildFamilyTree(
  characters: Character[],
  currentChapter: number,
  width: number,
  height: number
): TreeNode[] {
  // Filter to only include born characters
  const visibleCharacters = characters.filter(
    c => c.birthChapter <= currentChapter
  );

  if (visibleCharacters.length === 0) return [];

  // Build hierarchy based on generations
  const generations: Map<number, Character[]> = new Map();
  visibleCharacters.forEach(c => {
    const gen = generations.get(c.generation) || [];
    gen.push(c);
    generations.set(c.generation, gen);
  });

  // Calculate positions - horizontal layout by generation
  const nodes: TreeNode[] = [];
  const padding = 80;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  const numGenerations = Math.max(...Array.from(generations.keys()));
  const generationHeight = availableHeight / Math.max(numGenerations, 1);

  generations.forEach((chars, generation) => {
    const charWidth = availableWidth / (chars.length + 1);

    chars.forEach((character, index) => {
      nodes.push({
        character,
        status: getCharacterStatus(character, currentChapter),
        x: padding + charWidth * (index + 1),
        y: padding + (generation - 1) * generationHeight,
      });
    });
  });

  return nodes;
}

export interface Connection {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: 'parent-child' | 'spouse';
}

export function buildConnections(
  nodes: TreeNode[],
  _characters: Character[]
): Connection[] {
  const connections: Connection[] = [];
  const nodeMap = new Map<string, TreeNode>();

  nodes.forEach(node => {
    nodeMap.set(node.character.id, node);
  });

  nodes.forEach(node => {
    const { character } = node;

    // Parent-child connections
    character.parentIds.forEach(parentId => {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        connections.push({
          id: `${parentId}-${character.id}`,
          sourceX: parentNode.x,
          sourceY: parentNode.y + 40, // Below parent
          targetX: node.x,
          targetY: node.y - 40, // Above child
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
          sourceX: node.x + 40,
          sourceY: node.y,
          targetX: spouseNode.x - 40,
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
