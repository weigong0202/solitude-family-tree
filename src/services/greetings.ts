import type { Character } from '../types';
import type { CharacterMemory, CharacterEmotionalState } from './characterMemory';

/**
 * Mood-based atmospheric openings for deceased characters (spirits)
 */
const DECEASED_MOOD_OPENINGS: Record<CharacterEmotionalState['mood'], string> = {
  neutral: '*The air shimmers. A presence materializes.*',
  warm: '*A gentle warmth fills the space as the spirit emerges.*',
  melancholic: '*The spirit appears slowly, carrying the weight of eternity.*',
  agitated: '*The air crackles. The spirit manifests, restless.*',
  mysterious: '*Shadows converge into a familiar form.*',
  joyful: '*Distant laughter precedes the spirit.*',
};

/**
 * Mood-based atmospheric openings for living characters
 */
const LIVING_MOOD_OPENINGS: Record<CharacterEmotionalState['mood'], string> = {
  neutral: '*A familiar figure turns to greet you.*',
  warm: '*A warm smile spreads across their face.*',
  melancholic: '*They look up, a hint of sadness in their eyes.*',
  agitated: '*They pace restlessly, then notice you.*',
  mysterious: '*They sit in shadows, regarding you.*',
  joyful: '*They wave you over eagerly.*',
};

/**
 * Calculate time reference text based on days since last interaction
 */
function getTimeReference(daysSince: number, isDeceased: boolean): string {
  if (daysSince === 0) {
    return 'You return so soon...';
  } else if (daysSince === 1) {
    return isDeceased
      ? 'A day has passed in your world since we last spoke...'
      : 'Just yesterday we spoke, no?';
  } else if (daysSince < 7) {
    return isDeceased
      ? `${daysSince} days have passed, yet time means little to those of us beyond the veil...`
      : `${daysSince} days since we last spoke. Much has happened in Macondo...`;
  } else {
    return isDeceased
      ? 'Much time has flowed past like the river, since last we spoke...'
      : 'It has been a while since you visited. I was beginning to wonder if you had forgotten me.';
  }
}

/**
 * Generate greeting for returning visitors who have spoken with this character before
 */
export function generateReturningGreeting(
  _character: Character,
  memory: CharacterMemory,
  isDeceased: boolean
): string {
  const state = memory.emotionalState;
  const daysSince = Math.floor(
    (Date.now() - new Date(state.lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeReference = getTimeReference(daysSince, isDeceased);

  if (isDeceased) {
    const moodOpening = DECEASED_MOOD_OPENINGS[state.mood];
    const trustResponse = state.trustLevel > 60
      ? 'It comforts me to see you again.'
      : 'You return to disturb my rest?';

    return `${moodOpening}

${timeReference} ${trustResponse}`;
  } else {
    const moodOpening = LIVING_MOOD_OPENINGS[state.mood];
    const trustResponse = state.trustLevel > 60
      ? 'Come, sit with me.'
      : 'What brings you today?';

    return `${moodOpening}

${timeReference} ${trustResponse}`;
  }
}

/**
 * Generate greeting for first-time visitors
 */
export function generateFirstGreeting(character: Character, isDeceased: boolean): string {
  if (isDeceased) {
    return `*A shimmer in the air. The scent of yellow flowers.*

You have called me back. I am ${character.name}${character.nickname ? `, "${character.nickname}"` : ''}.

What draws you to speak with the dead?`;
  } else {
    return `*Afternoon light filters through the window.*

¡Buenos días! I am ${character.name}${character.nickname ? `, though they call me "${character.nickname}"` : ''}.

I don't believe we've met. What brings you here?`;
  }
}
