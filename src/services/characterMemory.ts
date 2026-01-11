import type { Character, ChatMessage } from '../types';

// Character emotional state tracked across conversations
export interface CharacterEmotionalState {
  mood: 'neutral' | 'warm' | 'melancholic' | 'agitated' | 'mysterious' | 'joyful';
  trustLevel: number; // 0-100, how much the character trusts the user
  topicsDiscussed: string[]; // Key topics the user has brought up
  lastInteraction: string; // ISO date string
  interactionCount: number;
  memorableExchanges: string[]; // Key moments the character should remember
}

// Full character memory including conversation history and thought signatures
export interface CharacterMemory {
  characterId: string;
  characterName: string;
  emotionalState: CharacterEmotionalState;
  conversationHistory: ChatMessage[];
  thoughtSignature?: string; // Gemini 3 thought signature for reasoning continuity
  createdAt: string;
  updatedAt: string;
}

// Storage key prefix
const STORAGE_KEY_PREFIX = 'solitude_character_memory_';

// Default emotional state for new character interactions
function createDefaultEmotionalState(): CharacterEmotionalState {
  return {
    mood: 'neutral',
    trustLevel: 30, // Start with some baseline trust
    topicsDiscussed: [],
    lastInteraction: new Date().toISOString(),
    interactionCount: 0,
    memorableExchanges: [],
  };
}

// Get character memory from localStorage
export function getCharacterMemory(characterId: string): CharacterMemory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + characterId);
    if (stored) {
      const memory = JSON.parse(stored) as CharacterMemory;
      // Convert timestamp strings back to Date objects in messages
      memory.conversationHistory = memory.conversationHistory.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      return memory;
    }
  } catch (error) {
    console.error('Error loading character memory:', error);
  }
  return null;
}

// Save character memory to localStorage
export function saveCharacterMemory(memory: CharacterMemory): void {
  try {
    memory.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_PREFIX + memory.characterId, JSON.stringify(memory));
  } catch (error) {
    console.error('Error saving character memory:', error);
  }
}

// Initialize or get existing character memory
export function initializeCharacterMemory(character: Character): CharacterMemory {
  const existing = getCharacterMemory(character.id);
  if (existing) {
    return existing;
  }

  const newMemory: CharacterMemory = {
    characterId: character.id,
    characterName: character.name,
    emotionalState: createDefaultEmotionalState(),
    conversationHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveCharacterMemory(newMemory);
  return newMemory;
}

// Apply emotional state changes without saving (internal helper)
function applyEmotionalStateChanges(
  memory: CharacterMemory,
  analysis: {
    moodShift?: CharacterEmotionalState['mood'];
    trustChange?: number;
    newTopics?: string[];
    memorableExchange?: string;
  },
  incrementInteraction: boolean = true
): CharacterMemory {
  const updated = { ...memory };
  const state = { ...updated.emotionalState };

  if (analysis.moodShift) {
    state.mood = analysis.moodShift;
  }

  if (analysis.trustChange) {
    state.trustLevel = Math.max(0, Math.min(100, state.trustLevel + analysis.trustChange));
  }

  if (analysis.newTopics) {
    state.topicsDiscussed = [...new Set([...state.topicsDiscussed, ...analysis.newTopics])];
  }

  if (analysis.memorableExchange) {
    state.memorableExchanges = [
      ...state.memorableExchanges.slice(-9), // Keep last 10
      analysis.memorableExchange,
    ];
  }

  if (incrementInteraction) {
    state.lastInteraction = new Date().toISOString();
    state.interactionCount += 1;
  }

  updated.emotionalState = state;
  return updated;
}

// Update emotional state based on conversation analysis
export function updateEmotionalState(
  memory: CharacterMemory,
  analysis: {
    moodShift?: CharacterEmotionalState['mood'];
    trustChange?: number;
    newTopics?: string[];
    memorableExchange?: string;
  }
): CharacterMemory {
  const updated = applyEmotionalStateChanges(memory, analysis);
  saveCharacterMemory(updated);
  return updated;
}

// Add a message to conversation history
export function addMessageToMemory(
  memory: CharacterMemory,
  message: ChatMessage
): CharacterMemory {
  const updated = {
    ...memory,
    conversationHistory: [...memory.conversationHistory, message],
  };
  saveCharacterMemory(updated);
  return updated;
}

// Update thought signature
export function updateThoughtSignature(
  memory: CharacterMemory,
  signature: string
): CharacterMemory {
  const updated = {
    ...memory,
    thoughtSignature: signature,
  };
  saveCharacterMemory(updated);
  return updated;
}

// Clear character memory (for testing or user request)
export function clearCharacterMemory(characterId: string): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + characterId);
}

// Get all character memories (for displaying relationship overview)
export function getAllCharacterMemories(): CharacterMemory[] {
  const memories: CharacterMemory[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      const memory = getCharacterMemory(key.replace(STORAGE_KEY_PREFIX, ''));
      if (memory) {
        memories.push(memory);
      }
    }
  }
  return memories.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

// Generate a summary of past interactions for the AI prompt
export function generateMemorySummary(memory: CharacterMemory): string {
  const state = memory.emotionalState;
  const daysSinceLastInteraction = Math.floor(
    (Date.now() - new Date(state.lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
  );

  let summary = '';

  // Interaction history
  if (state.interactionCount > 0) {
    summary += `You have spoken with this visitor ${state.interactionCount} time${state.interactionCount > 1 ? 's' : ''} before. `;

    if (daysSinceLastInteraction === 0) {
      summary += 'They visited you earlier today. ';
    } else if (daysSinceLastInteraction === 1) {
      summary += 'They visited you yesterday. ';
    } else if (daysSinceLastInteraction < 7) {
      summary += `They visited you ${daysSinceLastInteraction} days ago. `;
    } else {
      summary += 'It has been a while since their last visit. ';
    }
  }

  // Topics discussed
  if (state.topicsDiscussed.length > 0) {
    summary += `In past conversations, you have discussed: ${state.topicsDiscussed.join(', ')}. `;
  }

  // Memorable exchanges
  if (state.memorableExchanges.length > 0) {
    summary += `Key moments you remember: ${state.memorableExchanges.slice(-3).join('; ')}. `;
  }

  // Current emotional state
  summary += `Your current mood toward this visitor is ${state.mood}. `;

  if (state.trustLevel < 30) {
    summary += 'You are still wary of them. ';
  } else if (state.trustLevel < 60) {
    summary += 'You are beginning to trust them. ';
  } else if (state.trustLevel < 85) {
    summary += 'You trust them and speak more openly. ';
  } else {
    summary += 'You trust them deeply and share your innermost thoughts. ';
  }

  return summary;
}

// Get mood emoji for UI
export function getMoodEmoji(mood: CharacterEmotionalState['mood']): string {
  const moodEmojis: Record<CharacterEmotionalState['mood'], string> = {
    neutral: '😐',
    warm: '😊',
    melancholic: '😢',
    agitated: '😠',
    mysterious: '🌙',
    joyful: '😄',
  };
  return moodEmojis[mood];
}

// Get trust level description for UI
export function getTrustDescription(trustLevel: number): string {
  if (trustLevel < 20) return 'Distant';
  if (trustLevel < 40) return 'Cautious';
  if (trustLevel < 60) return 'Warming';
  if (trustLevel < 80) return 'Trusting';
  return 'Intimate';
}

// Batch update memory with multiple changes in a single save
// This reduces localStorage writes from 3-4 per message to 1
export function batchUpdateMemory(
  memory: CharacterMemory,
  updates: {
    messages?: ChatMessage[];
    thoughtSignature?: string;
    emotionalAnalysis?: {
      moodShift?: CharacterEmotionalState['mood'];
      trustChange?: number;
      newTopics?: string[];
      memorableExchange?: string;
    };
  }
): CharacterMemory {
  let updated = { ...memory };

  // Add messages to history
  if (updates.messages && updates.messages.length > 0) {
    updated = {
      ...updated,
      conversationHistory: [...updated.conversationHistory, ...updates.messages],
    };
  }

  // Update thought signature
  if (updates.thoughtSignature) {
    updated = {
      ...updated,
      thoughtSignature: updates.thoughtSignature,
    };
  }

  // Apply emotional state changes
  if (updates.emotionalAnalysis) {
    updated = applyEmotionalStateChanges(updated, updates.emotionalAnalysis);
  }

  // Single save for all updates
  saveCharacterMemory(updated);
  return updated;
}
