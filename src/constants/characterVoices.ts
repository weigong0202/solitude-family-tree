/**
 * Character-to-voice mapping for Gemini TTS
 * Each character has a unique voice matched to their personality, gender, and age
 *
 * Voice characteristics:
 * - Charon: Informative
 * - Kore: Firm
 * - Puck: Upbeat
 * - Aoede: Breezy
 * - Fenrir: Excitable
 * - Leda: Youthful
 * - Orus: Firm
 * - Zephyr: Bright
 * - And many more...
 */

export const CHARACTER_VOICES: Record<string, string> = {
  // First Generation
  'jose-arcadio-buendia': 'Charon',      // Informative - patriarch obsessed with knowledge
  'ursula': 'Kore',                       // Firm - authoritative matriarch

  // Gypsies
  'melquiades': 'Sadaltager',             // Knowledgeable - wise gypsy sage

  // Second Generation
  'jose-arcadio-son': 'Algenib',          // Gravelly - large masculine adventurer
  'colonel-aureliano': 'Alnilam',         // Firm - military commander, stoic
  'amaranta': 'Erinome',                  // Clear - precise, bitter spinster
  'rebeca': 'Achernar',                   // Soft - mysterious, ethereal

  // Extended Family & Lovers
  'pilar-ternera': 'Sulafat',             // Warm - sensual fortune-teller

  // Third Generation
  'arcadio': 'Orus',                      // Firm - brutal, authoritarian
  'aureliano-jose': 'Fenrir',             // Excitable - young, passionate soldier
  'remedios-moscote': 'Leda',             // Youthful - child bride, innocent
  'santa-sofia': 'Vindemiatrix',          // Gentle - quiet, long-suffering

  // Fourth Generation
  'remedios-beauty': 'Aoede',             // Breezy - otherworldly, ethereal
  'aureliano-segundo': 'Puck',            // Upbeat - jovial, hedonistic
  'jose-arcadio-segundo': 'Rasalgethi',   // Informative - intellectual, serious

  // Fernanda's Family
  'fernanda': 'Pulcherrima',              // Forward - aristocratic, imperious

  // Lovers
  'petra-cotes': 'Sadachbia',             // Lively - vivacious mistress

  // Fifth Generation
  'meme': 'Laomedeia',                    // Upbeat - young, spirited
  'jose-arcadio-iii': 'Algieba',          // Smooth - sophisticated, decadent
  'amaranta-ursula': 'Zephyr',            // Bright - energetic, modern

  // Later Additions
  'mauricio-babilonia': 'Zubenelgenubi',  // Casual - working-class mechanic
  'gaston': 'Schedar',                    // Even - composed Belgian husband
  'aureliano-babilonia': 'Iapetus',       // Clear - scholar, last of the line
  'aureliano-pig-tail': 'Enceladus',      // Breathy - ill-fated infant
};

export const DEFAULT_VOICE = 'Charon';

/**
 * Get the voice for a character by ID
 */
export function getCharacterVoice(characterId: string): string {
  return CHARACTER_VOICES[characterId] || DEFAULT_VOICE;
}
