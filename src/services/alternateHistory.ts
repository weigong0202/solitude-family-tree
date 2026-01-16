/**
 * Alternate History Service
 * Handles preset scenarios, prompt building, and localStorage for Melquíades' Prophecy
 */

import type {
  PresetScenario,
  AlternateTimeline,
  ButterflyEffect,
  DivergencePoint,
} from '../types/alternateHistory';
import { characters } from '../data/characters';
import { generateUniqueId } from '../constants';

/**
 * Type guard to check if a DivergencePoint is a PresetScenario
 */
export function isPresetScenario(point: DivergencePoint): point is PresetScenario {
  return 'suggestedQuestion' in point && 'mood' in point && 'icon' in point;
}

// LocalStorage key for saved prophecies
const STORAGE_KEY = 'solitude_alternate_timelines';

/**
 * Preset scenarios for "what if" questions
 */
export const PRESET_SCENARIOS: PresetScenario[] = [
  // Deaths & Fates
  {
    id: 'prudencio-lives',
    title: 'Prudencio Aguilar Lives',
    description: 'What if José Arcadio Buendía never killed Prudencio Aguilar in that fateful cockfight dispute?',
    chapter: 1,
    characterIds: ['jose-arcadio-buendia', 'ursula'],
    originalOutcome: 'José Arcadio Buendía killed Prudencio Aguilar and was haunted by his ghost, leading to the founding of Macondo.',
    category: 'death',
    suggestedQuestion: 'What if José Arcadio Buendía never killed Prudencio Aguilar?',
    mood: 'mysterious',
    icon: '👻',
  },
  {
    id: 'ursula-dies-young',
    title: 'Úrsula Dies Young',
    description: 'What if Úrsula, the indestructible matriarch, had died before her husband lost his mind?',
    chapter: 6,
    characterIds: ['ursula', 'jose-arcadio-buendia'],
    originalOutcome: 'Úrsula lived over 120 years, holding the family together through wars, plagues, and decay.',
    category: 'death',
    suggestedQuestion: 'What if Úrsula had died young, before her hundredth year?',
    mood: 'tragic',
    icon: '💀',
  },

  // Decisions
  {
    id: 'colonel-wins',
    title: 'The Colonel Wins a War',
    description: 'Colonel Aureliano organized 32 armed uprisings and lost them all. What if he had won even one?',
    chapter: 8,
    characterIds: ['colonel-aureliano'],
    originalOutcome: 'The Colonel lost all 32 wars and retreated into solitary goldfish-making.',
    category: 'decision',
    suggestedQuestion: 'What if Colonel Aureliano had won even one of his 32 wars?',
    mood: 'dramatic',
    icon: '⚔️',
  },
  {
    id: 'jose-stays',
    title: 'José Arcadio Never Leaves',
    description: 'What if the eldest son had never run away with the gypsies?',
    chapter: 3,
    characterIds: ['jose-arcadio-son', 'rebeca'],
    originalOutcome: 'José Arcadio left with the gypsies, circled the world 65 times, and returned tattooed and enormous.',
    category: 'decision',
    suggestedQuestion: 'What if José Arcadio had never left with the gypsies?',
    mood: 'bittersweet',
    icon: '🎪',
  },

  // Relationships
  {
    id: 'amaranta-accepts',
    title: 'Amaranta Accepts Pietro',
    description: 'What if Amaranta had accepted Pietro Crespi\'s love instead of rejecting him unto death?',
    chapter: 5,
    characterIds: ['amaranta'],
    originalOutcome: 'Amaranta rejected Pietro Crespi, who killed himself. She wore a black bandage and died a virgin.',
    category: 'relationship',
    suggestedQuestion: 'What if Amaranta had married Pietro Crespi?',
    mood: 'bittersweet',
    icon: '💔',
  },
  {
    id: 'aureliano-chooses-petra',
    title: 'Aureliano Chooses Petra',
    description: 'What if Aureliano Segundo had chosen wild Petra Cotes over rigid Fernanda?',
    chapter: 11,
    characterIds: ['aureliano-segundo', 'fernanda'],
    originalOutcome: 'Aureliano Segundo married Fernanda but spent his life with Petra Cotes. His children grew up in suffocating piety.',
    category: 'relationship',
    suggestedQuestion: 'What if Aureliano Segundo had married Petra Cotes instead of Fernanda?',
    mood: 'hopeful',
    icon: '❤️',
  },

  // Events
  {
    id: 'remedios-stays',
    title: 'Remedios Stays Earthbound',
    description: 'What if Remedios the Beauty had not ascended to heaven?',
    chapter: 12,
    characterIds: ['remedios-the-beauty'],
    originalOutcome: 'Remedios the Beauty ascended to heaven while folding sheets, leaving behind only the bewildered witnesses.',
    category: 'event',
    suggestedQuestion: 'What if Remedios the Beauty had stayed on earth?',
    mood: 'mysterious',
    icon: '🦋',
  },
  {
    id: 'no-banana-company',
    title: 'The Banana Company Never Arrives',
    description: 'What if the American fruit company had never come to Macondo?',
    chapter: 14,
    characterIds: [],
    originalOutcome: 'The banana company brought prosperity, then the strike, the massacre, and the deluge that drowned memory itself.',
    category: 'event',
    suggestedQuestion: 'What if the banana company had never come to Macondo?',
    mood: 'dramatic',
    icon: '🍌',
  },
];

/**
 * Get scenarios grouped by category
 */
export function getScenariosByCategory(): Record<string, PresetScenario[]> {
  const categories: Record<string, PresetScenario[]> = {
    death: [],
    decision: [],
    relationship: [],
    event: [],
  };

  for (const scenario of PRESET_SCENARIOS) {
    categories[scenario.category].push(scenario);
  }

  return categories;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    death: 'Deaths & Fates',
    decision: 'Decisions',
    relationship: 'Relationships',
    event: 'Events',
  };
  return names[category] || category;
}

/**
 * Build the prompt for Gemini to generate an alternate timeline
 */
export function buildProphecyPrompt(
  scenario: DivergencePoint | null,
  question: string
): string {
  // Get relevant characters for context
  const relevantCharacters = scenario?.characterIds.length
    ? characters.filter(c => scenario.characterIds.includes(c.id))
    : characters.slice(0, 10); // Use first 10 characters for custom questions

  const characterContext = relevantCharacters.map(c => ({
    id: c.id,
    name: c.name,
    generation: c.generation,
    birthChapter: c.birthChapter,
    deathChapter: c.deathChapter,
    description: c.description,
  }));

  const divergenceContext = scenario
    ? `
DIVERGENCE POINT:
Title: ${scenario.title}
Chapter: ${scenario.chapter}
Original Outcome: ${scenario.originalOutcome}
Category: ${scenario.category}
`
    : `
DIVERGENCE POINT:
This is a custom question about the Buendía family timeline.
`;

  return `You are Melquíades, the gypsy prophet who transcribed the Buendía family's destiny onto parchments in Sanskrit. You have returned from death itself because the afterlife was too lonely, and now a traveler has asked you to reveal what might have been if history had unfolded differently.

You possess complete knowledge of the Buendía family across seven generations in Macondo, from the founding by José Arcadio Buendía to the final Aureliano who deciphers your prophecy as the hurricane destroys everything.

${divergenceContext}

THE QUESTION:
"${question}"

CHARACTER CONTEXT:
${JSON.stringify(characterContext, null, 2)}

Respond in this EXACT format with these three sections separated by the markers shown:

---REASONING---
Write 2-3 paragraphs as Melquíades contemplating this alternate fate. Explain your prophetic reasoning about how this single change would cascade through the generations. Reference the cyclical nature of the family's doom, the repetition of names and fates, and the inescapable solitude that defines them. Write in a mystical, contemplative voice.

---EFFECTS---
Provide a JSON array of 3-6 affected characters. Each object must have these exact fields:
[
  {
    "characterId": "the-character-id",
    "characterName": "Full Name",
    "originalFate": "What happened in the original timeline (1-2 sentences)",
    "alternateFate": "What would happen in this alternate timeline (1-2 sentences)",
    "cascadeLevel": 1
  }
]
Use cascadeLevel 1 for directly affected characters, 2 for secondary effects, 3 for distant ripples.
Only output valid JSON in this section, no additional text.

---NARRATIVE---
Write 3-4 paragraphs of alternate history in Gabriel García Márquez's magical realism style. Include:
- Specific character names and how their lives change
- Sensory details and the passage of time
- The dreamlike quality where the extraordinary is treated as ordinary
- References to solitude, memory, and fate
- A sense of both what was gained and what was lost

Remember: In Macondo, time moves in circles, and every choice merely redirects the river of fate toward a different manifestation of the same essential solitude.`;
}

/**
 * Parse Gemini's response into structured data
 */
export function parseGeminiResponse(text: string): {
  reasoning: string;
  effects: ButterflyEffect[];
  narrative: string;
} {
  const result = {
    reasoning: '',
    effects: [] as ButterflyEffect[],
    narrative: '',
  };

  // Extract reasoning section
  const reasoningMatch = text.match(/---REASONING---\s*([\s\S]*?)(?=---EFFECTS---|$)/i);
  if (reasoningMatch) {
    result.reasoning = reasoningMatch[1].trim();
  }

  // Extract effects section (JSON)
  const effectsMatch = text.match(/---EFFECTS---\s*([\s\S]*?)(?=---NARRATIVE---|$)/i);
  if (effectsMatch) {
    try {
      // Find the JSON array in the section
      const jsonStr = effectsMatch[1].trim();
      const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        result.effects = JSON.parse(arrayMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse effects JSON:', e);
      result.effects = [];
    }
  }

  // Extract narrative section
  const narrativeMatch = text.match(/---NARRATIVE---\s*([\s\S]*?)$/i);
  if (narrativeMatch) {
    result.narrative = narrativeMatch[1].trim();
  }

  return result;
}

/**
 * Save a generated timeline to localStorage
 */
export function saveAlternateTimeline(timeline: AlternateTimeline): void {
  const existing = getAlternateTimelines();
  existing.unshift(timeline);
  // Keep only last 20 timelines
  const toSave = existing.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

/**
 * Get all saved timelines from localStorage
 */
export function getAlternateTimelines(): AlternateTimeline[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((t: AlternateTimeline) => ({
      ...t,
      timestamp: new Date(t.timestamp),
    }));
  } catch {
    return [];
  }
}

/**
 * Delete a timeline from localStorage
 */
export function deleteAlternateTimeline(id: string): void {
  const existing = getAlternateTimelines();
  const filtered = existing.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Generate a unique ID for a new timeline
 */
export function generateTimelineId(): string {
  return generateUniqueId('timeline');
}
