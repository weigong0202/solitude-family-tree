import type { Character } from '../types';
import type { CharacterMemory, CharacterEmotionalState } from './characterMemory';

/**
 * Mood-based atmospheric openings for deceased characters (spirits)
 */
const DECEASED_MOOD_OPENINGS: Record<CharacterEmotionalState['mood'], string> = {
  neutral: '*The air shimmers with golden motes of dust, and a familiar presence materializes from beyond.*',
  warm: '*A gentle warmth fills the space as the spirit emerges, a faint smile playing at ethereal lips.*',
  melancholic: '*The spirit appears slowly, carrying the weight of eternity like autumn leaves.*',
  agitated: '*The air crackles with restless energy as the spirit manifests, movements sharp and impatient.*',
  mysterious: '*Shadows dance and converge, forming the enigmatic outline of a figure from beyond the veil.*',
  joyful: '*Laughter like distant bells precedes the spirit, whose presence brings a lightness to the air.*',
};

/**
 * Mood-based atmospheric openings for living characters
 */
const LIVING_MOOD_OPENINGS: Record<CharacterEmotionalState['mood'], string> = {
  neutral: '*The sound of footsteps on wooden floors, the creak of a chair. A familiar figure turns to greet you.*',
  warm: '*A warm smile spreads across their face as they recognize you, setting aside their work.*',
  melancholic: '*They look up from their thoughts, a hint of sadness in their eyes that lightens at your presence.*',
  agitated: '*Restless energy fills the room. They pace, then notice you and pause.*',
  mysterious: '*They sit in shadows, only their eyes catching the candlelight as they regard you.*',
  joyful: '*Laughter fills the room even before you enter. They wave you over eagerly.*',
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
  character: Character,
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
    const topicsMemory = state.topicsDiscussed.length > 0
      ? `I remember our conversations... about ${state.topicsDiscussed.slice(-2).join(' and ')}. `
      : '';
    const trustResponse = state.trustLevel > 60
      ? 'It brings me comfort to see a familiar soul.'
      : 'What brings you back to disturb my rest?';

    return `${moodOpening}

${timeReference}

Ah, it is you again. I am ${character.name}${character.nickname ? `, "${character.nickname}"` : ''}, speaking to you from beyond.

${topicsMemory}${trustResponse}`;
  } else {
    const moodOpening = LIVING_MOOD_OPENINGS[state.mood];
    const topicsMemory = state.topicsDiscussed.length > 0
      ? `I've been thinking about what we discussed... ${state.topicsDiscussed.slice(-2).join(' and ')}. `
      : '';
    const trustResponse = state.trustLevel > 60
      ? 'Come, sit with me. I enjoy our conversations.'
      : 'What brings you to visit today?';

    return `${moodOpening}

${timeReference}

¡Hola! It's good to see you again. I am ${character.name}${character.nickname ? `, though you may call me "${character.nickname}"` : ''}.

${topicsMemory}${trustResponse}`;
  }
}

/**
 * Generate greeting for first-time visitors
 */
export function generateFirstGreeting(character: Character, isDeceased: boolean): string {
  if (isDeceased) {
    return `*A shimmer appears in the air, like heat rising from sun-baked earth. The faint scent of yellow flowers and old parchment fills the space.*

Ah... you have called me back from the realm of shadows. I am ${character.name}${character.nickname ? `, whom they called "${character.nickname}"` : ''}.

The boundary between worlds grows thin when the living remember us. I sense you are new to these conversations with the dead...

Tell me, what draws you to speak with one who has crossed the great river of time?`;
  } else {
    return `*The warm afternoon light of Macondo filters through the window. You find ${character.name} here, very much alive, turning to regard you with curiosity.*

¡Buenos días, stranger! I am ${character.name}${character.nickname ? `, though most people call me "${character.nickname}"` : ''}.

I don't believe we've met before. Are you a traveler? A friend of the family, perhaps?

*They gesture for you to come closer, genuine interest in their eyes.*

Tell me, what brings you to speak with me today?`;
  }
}
