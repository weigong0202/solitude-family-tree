export interface Character {
  id: string;
  name: string;
  nickname?: string;
  generation: number;
  birthChapter: number;
  deathChapter?: number;
  parentIds: string[];
  spouseIds: string[];
  description: string;
  physicalDescription: string;
  biography: string; // Detailed literary biography of the character
  imageUrl?: string;
  isGhost?: boolean; // Characters who appear as ghosts (like Melquíades)
  quote?: string; // A memorable quote from or about this character
}

export type CharacterStatus = 'not_born' | 'alive_young' | 'alive_aged' | 'deceased';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  thoughtSignature?: string; // Gemini 3 reasoning trace - character's inner thoughts
}

export interface ChapterInfo {
  number: number;
  title: string;
  yearRange: string;
}

/** Application view modes */
export type ViewMode = 'intro' | 'magicalBook' | 'book' | 'familyTree' | 'visions' | 'prophecies';
