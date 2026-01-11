import type { Character } from '../types';

export interface Room {
  id: string;
  name: string;
  spanishName: string;
  description: string;
  // Position in the floor plan (percentage-based)
  position: { x: number; y: number; width: number; height: number };
  // Characters associated with this room
  characterIds: string[];
  // Key objects that can trigger stories
  objects: RoomObject[];
  // When this room exists (some are added/removed over time)
  existsFrom?: number; // chapter
  existsUntil?: number; // chapter
  // Visual mood
  mood: 'warm' | 'mysterious' | 'melancholic' | 'magical' | 'decayed';
}

export interface RoomObject {
  id: string;
  name: string;
  description: string;
  storyPrompt: string; // For Gemini to tell the story of this object
  appearsFrom?: number;
  appearsUntil?: number;
}

export const rooms: Room[] = [
  {
    id: 'courtyard',
    name: 'The Courtyard',
    spanishName: 'El Patio',
    description: 'The heart of the house, where the chestnut tree stands. José Arcadio Buendía spent his final years tied to its trunk, speaking in Latin.',
    position: { x: 35, y: 35, width: 30, height: 30 },
    characterIds: ['jose-arcadio-buendia'],
    objects: [
      {
        id: 'chestnut-tree',
        name: 'The Chestnut Tree',
        description: 'The great tree where the patriarch was bound',
        storyPrompt: 'Tell the story of José Arcadio Buendía and the chestnut tree, how he came to be tied there and what he spoke of in his madness.',
      },
    ],
    mood: 'melancholic',
  },
  {
    id: 'melquiades-room',
    name: "Melquíades' Room",
    spanishName: 'El Cuarto de Melquíades',
    description: 'The mysterious chamber where the gypsy lived, died, and returned. The parchments containing the family prophecy remain here, waiting to be decoded.',
    position: { x: 65, y: 10, width: 25, height: 25 },
    characterIds: ['melquiades'],
    objects: [
      {
        id: 'parchments',
        name: 'The Parchments',
        description: 'Sanskrit writings containing the family destiny',
        storyPrompt: 'Describe the mysterious parchments of Melquíades and the generations of Buendías who tried to decode them.',
      },
      {
        id: 'daguerreotype',
        name: 'The Daguerreotype',
        description: 'The first image ever captured in Macondo',
        storyPrompt: 'Tell the story of when Melquíades brought the daguerreotype to Macondo and the fear it caused.',
      },
    ],
    mood: 'magical',
  },
  {
    id: 'kitchen',
    name: 'The Kitchen',
    spanishName: 'La Cocina',
    description: "Úrsula's domain. For over a century, this was where she commanded the household, made candy animals, and kept the family together through sheer will.",
    position: { x: 10, y: 55, width: 25, height: 25 },
    characterIds: ['ursula'],
    objects: [
      {
        id: 'candy-animals',
        name: 'Candy Animal Molds',
        description: 'The molds for the little animals that funded the family',
        storyPrompt: "Describe Úrsula's candy animal business and how it saved the family during hard times.",
      },
      {
        id: 'buried-gold',
        name: 'The Buried Gold',
        description: 'Hidden beneath the floor',
        storyPrompt: 'Tell the story of the gold coins Úrsula buried under the kitchen floor and what became of them.',
      },
    ],
    mood: 'warm',
  },
  {
    id: 'workshop',
    name: 'The Workshop',
    spanishName: 'El Taller',
    description: "Colonel Aureliano's sanctuary. Here he crafted his golden fish, melting them down and remaking them endlessly—a metaphor for his solitude.",
    position: { x: 65, y: 55, width: 25, height: 25 },
    characterIds: ['colonel-aureliano'],
    objects: [
      {
        id: 'golden-fish',
        name: 'The Golden Fish',
        description: 'Tiny fish made of gold, crafted in endless repetition',
        storyPrompt: "Describe Colonel Aureliano's ritual of making golden fish and what they represented about his withdrawal from the world.",
      },
      {
        id: 'silver-tools',
        name: 'Silversmithing Tools',
        description: 'The instruments of his craft',
        storyPrompt: 'Tell the story of how Colonel Aureliano learned silversmithing and why he returned to it after the wars.',
      },
    ],
    mood: 'melancholic',
  },
  {
    id: 'living-room',
    name: 'The Living Room',
    spanishName: 'La Sala',
    description: 'Where guests were received and the pianola played. The Victrola later filled it with music, and here the family gathered for celebrations and mourning.',
    position: { x: 35, y: 65, width: 30, height: 20 },
    characterIds: ['remedios-moscote'],
    objects: [
      {
        id: 'pianola',
        name: 'The Pianola',
        description: 'The mechanical piano that enchanted and then burdened the house',
        storyPrompt: 'Tell the story of the pianola and Pietro Crespi, and how music came and left the Buendía house.',
      },
    ],
    mood: 'warm',
  },
  {
    id: 'amaranta-room',
    name: "Amaranta's Room",
    spanishName: 'El Cuarto de Amaranta',
    description: 'The room of bitter solitude. Here Amaranta sewed her own shroud, and here she rejected love until death.',
    position: { x: 10, y: 10, width: 25, height: 25 },
    characterIds: ['amaranta', 'rebeca'],
    objects: [
      {
        id: 'shroud',
        name: 'The Black Shroud',
        description: 'The burial garment Amaranta sewed herself',
        storyPrompt: "Tell the story of Amaranta sewing her own shroud, knowing when death would come, and the messages she carried to the dead.",
      },
      {
        id: 'black-bandage',
        name: 'The Black Bandage',
        description: 'Worn over her burned hand',
        storyPrompt: 'Describe how Amaranta burned her hand and wore the black bandage for the rest of her life, and what it symbolized.',
      },
    ],
    mood: 'melancholic',
  },
  {
    id: 'front-bedroom',
    name: 'The Front Bedroom',
    spanishName: 'El Dormitorio Principal',
    description: 'The matrimonial chamber, witness to births, deaths, and the passionate and tragic loves of the Buendía line.',
    position: { x: 10, y: 35, width: 25, height: 20 },
    characterIds: ['aureliano-segundo', 'fernanda'],
    objects: [
      {
        id: 'chamber-pot',
        name: 'The Golden Chamber Pot',
        description: 'Symbol of the family\'s fortune and excess',
        storyPrompt: 'Tell the story of Aureliano Segundo\'s years of abundance and the legendary parties at the Buendía house.',
      },
    ],
    mood: 'warm',
    existsFrom: 8,
  },
  {
    id: 'back-garden',
    name: 'The Back Garden',
    spanishName: 'El Jardín Trasero',
    description: 'Once cultivated by Úrsula, it slowly returned to wilderness. Here the banana company\'s influence crept in, and here the house began its final decay.',
    position: { x: 65, y: 35, width: 25, height: 20 },
    characterIds: ['remedios-la-bella'],
    objects: [
      {
        id: 'roses',
        name: 'The Rose Bushes',
        description: 'Planted by Úrsula, neglected by time',
        storyPrompt: 'Describe the garden through the generations, from Úrsula\'s careful cultivation to the final wilderness.',
      },
    ],
    mood: 'decayed',
    existsFrom: 5,
  },
];

// Helper to get rooms visible at a certain chapter
export function getRoomsAtChapter(chapter: number): Room[] {
  return rooms.filter(room => {
    const existsFrom = room.existsFrom ?? 1;
    const existsUntil = room.existsUntil ?? 20;
    return chapter >= existsFrom && chapter <= existsUntil;
  });
}

// Helper to get characters in a room at a certain chapter
export function getCharactersInRoom(
  room: Room,
  allCharacters: Character[],
  chapter: number
): Character[] {
  return allCharacters.filter(char => {
    if (!room.characterIds.includes(char.id)) return false;
    // Check if character is "alive" in this chapter (born and not yet dead)
    const isAlive = chapter >= char.birthChapter &&
      (char.deathChapter === undefined || chapter <= char.deathChapter);
    // Or show as ghost if they died
    const isGhost = char.deathChapter !== undefined && chapter > char.deathChapter;
    return isAlive || isGhost;
  });
}

// Get decay level of house based on chapter
export function getHouseDecayLevel(chapter: number): number {
  // House starts pristine, decays over time
  // Major decay after chapter 15 (the rain), accelerates in final chapters
  if (chapter <= 5) return 0;
  if (chapter <= 10) return 0.1;
  if (chapter <= 15) return 0.3;
  if (chapter <= 18) return 0.6;
  return 0.9; // Final chapters - near total decay
}
