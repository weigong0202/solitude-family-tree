import type { Character, ChatMessage } from '../types';
import { type Mood, MOOD_DISPLAY, getTrustLevelDescription, ERROR_MESSAGES } from '../constants';

// Character emotional state tracked across conversations
export interface CharacterEmotionalState {
  mood: Mood;
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

// Maximum conversation history length to prevent quota issues
const MAX_CONVERSATION_HISTORY = 50;

// Storage result type for better error handling
export type StorageResult =
  | { success: true }
  | { success: false; error: 'QUOTA_EXCEEDED' | 'STORAGE_ERROR'; message: string };

// Get all character memory keys sorted by last update (oldest first)
function getMemoryKeysByAge(): string[] {
  const result: { key: string; updatedAt: string }[] = [];

  // Snapshot keys first to avoid race conditions during iteration
  const allKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) allKeys.push(key);
  }

  // Now iterate over the snapshot
  for (const key of allKeys) {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const memory = JSON.parse(value) as CharacterMemory;
          result.push({ key, updatedAt: memory.updatedAt });
        }
      } catch (error) {
        // Log corrupted entries for debugging but continue
        console.warn(`Corrupted memory entry for key ${key}, skipping:`, error);
      }
    }
  }

  // Sort by updatedAt (oldest first)
  result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  return result.map(k => k.key);
}

// Trim conversation history to prevent memory bloat
function trimConversationHistory(memory: CharacterMemory): CharacterMemory {
  if (memory.conversationHistory.length <= MAX_CONVERSATION_HISTORY) {
    return memory;
  }

  return {
    ...memory,
    conversationHistory: memory.conversationHistory.slice(-MAX_CONVERSATION_HISTORY),
  };
}

// Cleanup oldest memories when quota is exceeded
function cleanupOldestMemories(): boolean {
  const keys = getMemoryKeysByAge();

  // Try removing oldest entries until we have space
  for (const key of keys.slice(0, Math.max(1, Math.floor(keys.length / 3)))) {
    try {
      localStorage.removeItem(key);
    } catch {
      return false;
    }
  }

  return true;
}

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

// Save character memory to localStorage with quota handling
export function saveCharacterMemory(memory: CharacterMemory): StorageResult {
  // Trim conversation history before saving
  const trimmedMemory = trimConversationHistory(memory);
  trimmedMemory.updatedAt = new Date().toISOString();

  const key = STORAGE_KEY_PREFIX + trimmedMemory.characterId;
  const serialized = JSON.stringify(trimmedMemory);

  try {
    localStorage.setItem(key, serialized);
    return { success: true };
  } catch (error) {
    // Check if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, attempting cleanup...');

      // Try cleanup and retry
      if (cleanupOldestMemories()) {
        try {
          localStorage.setItem(key, serialized);
          return { success: true };
        } catch {
          // Still failed after cleanup
        }
      }

      return {
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: ERROR_MESSAGES.storageQuotaExceeded,
      };
    }

    console.error('Error saving character memory:', error);
    return {
      success: false,
      error: 'STORAGE_ERROR',
      message: ERROR_MESSAGES.storageSaveFailed,
    };
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

// Get mood emoji for UI (using centralized MOOD_DISPLAY)
export function getMoodEmoji(mood: CharacterEmotionalState['mood']): string {
  return MOOD_DISPLAY[mood].emoji;
}

// Get trust level description for UI (using centralized getTrustLevelDescription)
export function getTrustDescription(trustLevel: number): string {
  return getTrustLevelDescription(trustLevel);
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
