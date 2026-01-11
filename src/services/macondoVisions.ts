import { isGeminiInitialized } from './gemini';

// Scene types available for generation
export type SceneType =
  | 'character_portrait'
  | 'key_moment'
  | 'location'
  | 'symbolic'
  | 'custom';

// Art styles inspired by Latin American artists
export type ArtStyle =
  | 'botero'      // Fernando Botero - volumetric, rounded figures
  | 'kahlo'       // Frida Kahlo - surreal, symbolic, personal
  | 'tamayo'      // Rufino Tamayo - modernist, vibrant colors
  | 'lam'         // Wifredo Lam - surrealist, Afro-Cuban imagery
  | 'orozco'      // José Clemente Orozco - dramatic, expressive
  | 'magical'     // General magical realism style
  | 'colonial';   // Colonial Latin American painting style

export interface SceneRequest {
  type: SceneType;
  prompt: string;
  chapter?: number;
  characterId?: string;
  artStyle: ArtStyle;
}

export interface GeneratedScene {
  id: string;
  request: SceneRequest;
  imageUrl: string;
  timestamp: Date;
  caption?: string;
}

// Pre-defined key moments from the novel
export const KEY_MOMENTS = [
  {
    id: 'founding',
    chapter: 1,
    title: 'The Founding of Macondo',
    description: 'José Arcadio Buendía and the expedition discovering the site where they will found Macondo',
    prompt: 'A group of pioneers with machetes stand at the edge of a pristine river, discovering a place of white stones like prehistoric eggs, tropical jungle behind them, golden morning light',
  },
  {
    id: 'ice',
    chapter: 1,
    title: 'The Discovery of Ice',
    description: 'José Arcadio Buendía touching ice for the first time at the gypsy fair',
    prompt: 'A weathered man with wild eyes touches a glowing block of ice in a tent, his face illuminated with wonder, gypsy carnival atmosphere with colorful fabrics',
  },
  {
    id: 'melquiades_room',
    chapter: 3,
    title: 'Melquíades\' Room',
    description: 'The mysterious room where Melquíades writes his prophecies',
    prompt: 'A cluttered room filled with ancient manuscripts, alchemical equipment, a skeletal old man writing by candlelight, dust motes floating in amber light, mystical atmosphere',
  },
  {
    id: 'war_departure',
    chapter: 5,
    title: 'Colonel Aureliano Goes to War',
    description: 'Colonel Aureliano Buendía departing for the civil wars',
    prompt: 'A solemn young man in military uniform on horseback at dawn, family watching from a colonial house doorway, yellow butterflies in the air, misty tropical landscape',
  },
  {
    id: 'gold_fish',
    chapter: 7,
    title: 'The Gold Fish Workshop',
    description: 'Colonel Aureliano making his gold fish in solitude',
    prompt: 'An aging soldier at a workbench crafting tiny golden fish, workshop filled with tools, melted gold glowing, solitary figure surrounded by hundreds of identical fish',
  },
  {
    id: 'remedios_ascension',
    chapter: 12,
    title: 'Remedios the Beauty Ascends',
    description: 'Remedios the Beauty ascending to heaven wrapped in white sheets',
    prompt: 'An impossibly beautiful woman rising into the sky wrapped in flowing white sheets, laundry hanging below, astonished onlookers, yellow butterflies, divine light from above',
  },
  {
    id: 'rain',
    chapter: 15,
    title: 'The Four Years of Rain',
    description: 'Macondo during the endless rain that lasted four years',
    prompt: 'A decaying colonial town submerged in eternal rain, moss-covered walls, flooded streets with lily pads, melancholic figures under umbrellas, grey skies',
  },
  {
    id: 'banana_massacre',
    chapter: 15,
    title: 'The Banana Company Massacre',
    description: 'The train station during the tragic events',
    prompt: 'A crowded train station at night, workers gathered, ominous soldiers in shadows, tropical storm approaching, tension and dread in the air',
  },
  {
    id: 'butterflies',
    chapter: 11,
    title: 'Yellow Butterflies',
    description: 'The yellow butterflies that follow Mauricio Babilonia',
    prompt: 'A young mechanic surrounded by a swarm of yellow butterflies in a tropical garden, a beautiful woman watching from a window, romantic golden afternoon light',
  },
  {
    id: 'final_aureliano',
    chapter: 20,
    title: 'The Last Aureliano',
    description: 'Aureliano Babilonia deciphering the manuscripts',
    prompt: 'A young man frantically reading ancient parchments as wind swirls around him, papers flying, walls crumbling, apocalyptic light, mirrors reflecting infinite solitude',
  },
];

// Location scenes
export const LOCATIONS = [
  {
    id: 'house_buendia',
    title: 'The House of the Buendías',
    description: 'The ancestral home of the Buendía family',
    prompt: 'A grand colonial house with a courtyard, chestnut tree in center, begonias along corridors, hammocks in shadows, tropical afternoon light filtering through',
  },
  {
    id: 'macondo_early',
    title: 'Early Macondo',
    description: 'The village in its early prosperous days',
    prompt: 'A pristine village of twenty adobe houses by a river with clear water, white stones, tropical vegetation, idyllic peaceful atmosphere, morning mist',
  },
  {
    id: 'macondo_decay',
    title: 'Macondo in Decay',
    description: 'The town in its final days',
    prompt: 'A ruined tropical town being reclaimed by jungle, collapsed buildings, vines growing through windows, empty streets, melancholic twilight, red ants everywhere',
  },
  {
    id: 'laboratory',
    title: 'The Alchemy Laboratory',
    description: 'José Arcadio Buendía\'s laboratory',
    prompt: 'A cramped workshop filled with strange instruments, magnifying glasses, daguerreotypes, magnets, astronomical charts, amber light, sense of obsessive discovery',
  },
];

// Get art style description for prompt enhancement
export function getArtStylePrompt(style: ArtStyle): string {
  const stylePrompts: Record<ArtStyle, string> = {
    botero: 'in the style of Fernando Botero, with volumetric rounded figures, exaggerated proportions, rich saturated colors, Latin American subjects',
    kahlo: 'in the style of Frida Kahlo, surrealist, deeply symbolic, vibrant Mexican colors, intimate and personal, with natural elements',
    tamayo: 'in the style of Rufino Tamayo, modernist, with bold geometric forms, rich earth tones and vibrant reds, mythological undertones',
    lam: 'in the style of Wifredo Lam, surrealist, with African and Caribbean imagery, jungle motifs, elongated figures, mysterious atmosphere',
    orozco: 'in the style of José Clemente Orozco, dramatic expressionist, powerful emotional content, dark and light contrasts, monumental feeling',
    magical: 'magical realism style, where the fantastical feels natural, dreamlike yet grounded, rich tropical colors, mystical atmosphere',
    colonial: 'Latin American colonial painting style, formal composition, rich fabrics and textures, religious undertones, candlelit warmth',
  };
  return stylePrompts[style];
}

// Generate full prompt for scene
export function buildScenePrompt(request: SceneRequest): string {
  const stylePrompt = getArtStylePrompt(request.artStyle);

  const basePrompt = `Create an oil painting illustration for the novel "One Hundred Years of Solitude" by Gabriel García Márquez.

Scene: ${request.prompt}

Style: ${stylePrompt}

Additional requirements:
- Capture the essence of magical realism where extraordinary events feel ordinary
- Use warm earth tones mixed with tropical greens and sunset colors
- Include subtle mystical elements (floating dust motes, ethereal light, yellow butterflies if appropriate)
- Colombian/Caribbean setting, 19th-20th century
- Museum-quality oil painting, rich textures and brushwork
- Cinematic composition with emotional depth`;

  return basePrompt;
}

// Storage for generated scenes
const STORAGE_KEY = 'solitude_macondo_visions';

// Save generated scene to localStorage
export function saveGeneratedScene(scene: GeneratedScene): void {
  try {
    const scenes = getGeneratedScenes();
    scenes.unshift(scene); // Add to beginning
    // Keep only last 20 scenes
    const trimmed = scenes.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving scene:', error);
  }
}

// Get all saved scenes
export function getGeneratedScenes(): GeneratedScene[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const scenes = JSON.parse(stored) as GeneratedScene[];
      return scenes.map(s => ({
        ...s,
        timestamp: new Date(s.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error loading scenes:', error);
  }
  return [];
}

// Clear saved scenes
export function clearGeneratedScenes(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Check if Gemini image generation is available
export function isImageGenerationAvailable(): boolean {
  return isGeminiInitialized();
}
