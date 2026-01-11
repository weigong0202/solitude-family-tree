// The prophecy of Melquíades - fragments to be decoded
// Each fragment corresponds to a chapter and reveals story elements

export interface ProphecyFragment {
  id: string;
  chapter: number;
  encodedSymbols: string; // Sanskrit-like display
  decodedText: string;
  characterIds: string[]; // Characters revealed by this fragment
  theme: string;
  isKeyProphecy: boolean; // Major plot points
}

// Sanskrit-inspired symbols for encoding
const SYMBOLS = [
  'ॐ', 'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ',
  'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र',
  'ल', 'व', 'श', 'ष', 'स', 'ह', '्', 'ा', 'ि', 'ी', 'ु', 'ू',
  '॥', '।', '᳘', '᳙', '᳚', '᳛', 'ं', 'ः', '॰', '॓', '॔',
];

// Generate encoded symbols from text length
function generateEncodedSymbols(text: string): string {
  const words = text.split(' ').length;
  let symbols = '';
  for (let i = 0; i < words; i++) {
    const numSymbols = 2 + Math.floor(Math.random() * 4);
    for (let j = 0; j < numSymbols; j++) {
      symbols += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    if (i < words - 1) symbols += ' ';
  }
  return symbols;
}

export const prophecyFragments: ProphecyFragment[] = [
  {
    id: 'founding',
    chapter: 1,
    encodedSymbols: generateEncodedSymbols('The first of the line is tied to a tree and the last is being eaten by the ants'),
    decodedText: 'The first of the line is tied to a tree and the last is being eaten by the ants.',
    characterIds: ['jose-arcadio-buendia'],
    theme: 'Origins',
    isKeyProphecy: true,
  },
  {
    id: 'macondo-birth',
    chapter: 1,
    encodedSymbols: generateEncodedSymbols('A city of mirrors that would reflect the world'),
    decodedText: 'They would found a city of mirrors that would reflect the world.',
    characterIds: ['jose-arcadio-buendia', 'ursula'],
    theme: 'Foundation',
    isKeyProphecy: false,
  },
  {
    id: 'ice-discovery',
    chapter: 1,
    encodedSymbols: generateEncodedSymbols('The world was so recent that many things lacked names'),
    decodedText: 'The world was so recent that many things lacked names, and to mention them one had to point.',
    characterIds: ['jose-arcadio-buendia'],
    theme: 'Wonder',
    isKeyProphecy: false,
  },
  {
    id: 'aurelianos-fate',
    chapter: 2,
    encodedSymbols: generateEncodedSymbols('Colonel Aureliano Buendia was to face the firing squad'),
    decodedText: 'Colonel Aureliano Buendía was to face the firing squad, he would remember that distant afternoon when his father took him to discover ice.',
    characterIds: ['aureliano-buendia'],
    theme: 'War',
    isKeyProphecy: true,
  },
  {
    id: 'solitude-curse',
    chapter: 3,
    encodedSymbols: generateEncodedSymbols('The Buendias were condemned to one hundred years of solitude'),
    decodedText: 'The Buendías were not destined to love, but condemned to one hundred years of solitude.',
    characterIds: ['amaranta', 'rebeca'],
    theme: 'Solitude',
    isKeyProphecy: true,
  },
  {
    id: 'insomnia-plague',
    chapter: 3,
    encodedSymbols: generateEncodedSymbols('The insomnia plague would steal their memories'),
    decodedText: 'The insomnia was spreading, and with it came the terrible danger of forgetting.',
    characterIds: ['ursula'],
    theme: 'Memory',
    isKeyProphecy: false,
  },
  {
    id: 'jose-arcadio-death',
    chapter: 5,
    encodedSymbols: generateEncodedSymbols('A trickle of blood traveled through the house'),
    decodedText: 'A trickle of blood came from under the door, crossed the living room, went out into the street.',
    characterIds: ['jose-arcadio'],
    theme: 'Death',
    isKeyProphecy: false,
  },
  {
    id: 'patriarch-madness',
    chapter: 6,
    encodedSymbols: generateEncodedSymbols('He was tied to the chestnut tree speaking in Latin'),
    decodedText: 'They found him speaking in an unknown tongue, which later proved to be Latin.',
    characterIds: ['jose-arcadio-buendia'],
    theme: 'Madness',
    isKeyProphecy: false,
  },
  {
    id: 'seventeen-sons',
    chapter: 7,
    encodedSymbols: generateEncodedSymbols('Seventeen sons scattered across the land all bearing the cross of ash'),
    decodedText: 'He fathered seventeen sons by seventeen different women, all bearing the cross of ash on their foreheads.',
    characterIds: ['aureliano-buendia'],
    theme: 'Legacy',
    isKeyProphecy: false,
  },
  {
    id: 'war-cycle',
    chapter: 8,
    encodedSymbols: generateEncodedSymbols('He organized thirty-two armed uprisings and lost them all'),
    decodedText: 'He organized thirty-two armed uprisings and he lost them all.',
    characterIds: ['aureliano-buendia'],
    theme: 'War',
    isKeyProphecy: false,
  },
  {
    id: 'remedios-ascension',
    chapter: 12,
    encodedSymbols: generateEncodedSymbols('She rose to heaven body and soul'),
    decodedText: 'She went up with the sheets, waving goodbye, and rose to heaven body and soul.',
    characterIds: ['remedios-the-beauty'],
    theme: 'Magic',
    isKeyProphecy: true,
  },
  {
    id: 'yellow-butterflies',
    chapter: 14,
    encodedSymbols: generateEncodedSymbols('Yellow butterflies preceded his every appearance'),
    decodedText: 'Whenever he appeared, clouds of yellow butterflies would precede him.',
    characterIds: ['mauricio-babilonia'],
    theme: 'Love',
    isKeyProphecy: false,
  },
  {
    id: 'endless-rain',
    chapter: 15,
    encodedSymbols: generateEncodedSymbols('It rained for four years eleven months and two days'),
    decodedText: 'It rained for four years, eleven months, and two days.',
    characterIds: [],
    theme: 'Decay',
    isKeyProphecy: true,
  },
  {
    id: 'massacre',
    chapter: 15,
    encodedSymbols: generateEncodedSymbols('Three thousand dead workers thrown into the sea'),
    decodedText: 'Three thousand of them were thrown into the sea, and everyone denied it happened.',
    characterIds: ['jose-arcadio-segundo'],
    theme: 'Violence',
    isKeyProphecy: true,
  },
  {
    id: 'ursula-vision',
    chapter: 17,
    encodedSymbols: generateEncodedSymbols('She had lived long enough to see the repeating names'),
    decodedText: 'She had lived long enough to recognize that the repeating names were not coincidence but destiny.',
    characterIds: ['ursula'],
    theme: 'Cycles',
    isKeyProphecy: false,
  },
  {
    id: 'amaranta-shroud',
    chapter: 15,
    encodedSymbols: generateEncodedSymbols('She sewed her own shroud knowing the day of her death'),
    decodedText: 'She began sewing her own shroud, knowing she would die when it was finished.',
    characterIds: ['amaranta'],
    theme: 'Death',
    isKeyProphecy: false,
  },
  {
    id: 'pigs-tail',
    chapter: 20,
    encodedSymbols: generateEncodedSymbols('The child was born with a pigs tail as foretold'),
    decodedText: 'The child was born with the tail of a pig, as had been foretold.',
    characterIds: ['aureliano-babilonia'],
    theme: 'Prophecy',
    isKeyProphecy: true,
  },
  {
    id: 'final-revelation',
    chapter: 20,
    encodedSymbols: generateEncodedSymbols('Before reaching the final line he understood that he would never leave that room'),
    decodedText: 'Before reaching the final line, he had already understood that he would never leave that room.',
    characterIds: ['aureliano-babilonia'],
    theme: 'Ending',
    isKeyProphecy: true,
  },
  {
    id: 'wind-destruction',
    chapter: 20,
    encodedSymbols: generateEncodedSymbols('The first of the line is tied to a tree and the last is being eaten by ants'),
    decodedText: 'Races condemned to one hundred years of solitude did not have a second opportunity on earth.',
    characterIds: [],
    theme: 'Ending',
    isKeyProphecy: true,
  },
];

// Get fragments available up to a certain chapter
export function getFragmentsUpToChapter(chapter: number): ProphecyFragment[] {
  return prophecyFragments.filter(f => f.chapter <= chapter);
}

// Get key prophecies only
export function getKeyProphecies(chapter: number): ProphecyFragment[] {
  return prophecyFragments.filter(f => f.isKeyProphecy && f.chapter <= chapter);
}

// Calculate decode progress
export function getDecodeProgress(
  decodedIds: string[],
  maxChapter: number
): { total: number; decoded: number; percentage: number } {
  const available = getFragmentsUpToChapter(maxChapter);
  return {
    total: available.length,
    decoded: decodedIds.filter(id => available.some(f => f.id === id)).length,
    percentage: available.length > 0
      ? Math.round((decodedIds.filter(id => available.some(f => f.id === id)).length / available.length) * 100)
      : 0,
  };
}
