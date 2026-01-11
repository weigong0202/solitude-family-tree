import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatSession } from '@google/generative-ai';
import type { Character, ChatMessage } from '../types';
import type { CharacterMemory } from '../services/characterMemory';
import {
  initializeCharacterMemory,
  addMessageToMemory,
  batchUpdateMemory,
  getMoodEmoji,
  getTrustDescription,
} from '../services/characterMemory';
import {
  createLivingMemorySession,
  sendLivingMemoryMessage,
  isGeminiInitialized,
} from '../services/gemini';
import { getCharacterStatus } from '../data/characters';
import { generateReturningGreeting, generateFirstGreeting } from '../services/greetings';

interface UseLivingMemoryReturn {
  messages: ChatMessage[];
  memory: CharacterMemory | null;
  isLoading: boolean;
  error: string | null;
  moodEmoji: string;
  trustDescription: string;
  isDeceased: boolean;
  sendMessage: (content: string) => Promise<void>;
  startConversation: () => void;
  endConversation: () => void;
}

export function useLivingMemory(
  character: Character,
  currentChapter: number
): UseLivingMemoryReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memory, setMemory] = useState<CharacterMemory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ChatSession | null>(null);

  // Determine if character is deceased at current chapter
  const characterStatus = getCharacterStatus(character, currentChapter);
  const isDeceased = characterStatus === 'deceased';

  // Initialize memory when character changes
  useEffect(() => {
    if (character) {
      const characterMemory = initializeCharacterMemory(character);
      setMemory(characterMemory);
    }
  }, [character]);

  const moodEmoji = memory ? getMoodEmoji(memory.emotionalState.mood) : '😐';
  const trustDescription = memory ? getTrustDescription(memory.emotionalState.trustLevel) : 'Unknown';

  const startConversation = useCallback(() => {
    if (!isGeminiInitialized()) {
      setError('Please enter your Gemini API key to use Living Memory.');
      return;
    }

    if (!memory) {
      setError('Character memory not initialized.');
      return;
    }

    // Create new session with memory context
    sessionRef.current = createLivingMemorySession(character, memory, currentChapter, isDeceased);

    if (!sessionRef.current) {
      setError('Failed to create Living Memory session.');
      return;
    }

    setError(null);

    // Load previous conversation history from memory
    const previousMessages = memory.conversationHistory || [];
    const isReturning = memory.emotionalState.interactionCount > 0;

    // Build messages array: history + separator (if returning) + greeting
    const newMessages: ChatMessage[] = [...previousMessages];

    // Add session separator if there's previous history
    if (previousMessages.length > 0) {
      const separatorMessage: ChatMessage = {
        id: `separator-${Date.now()}`,
        role: 'system',
        content: '── New Session ──',
        timestamp: new Date(),
      };
      newMessages.push(separatorMessage);
    }

    // Add the greeting message
    const greetingMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: isReturning
        ? generateReturningGreeting(character, memory, isDeceased)
        : generateFirstGreeting(character, isDeceased),
      timestamp: new Date(),
    };
    newMessages.push(greetingMessage);

    setMessages(newMessages);
  }, [character, memory, currentChapter, isDeceased]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (!sessionRef.current) {
      // Auto-start conversation if not started
      startConversation();
      if (!sessionRef.current) return;
    }

    if (!memory) {
      setError('Character memory not available.');
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save user message immediately (single save)
    let updatedMemory = addMessageToMemory(memory, userMessage);

    setIsLoading(true);
    setError(null);

    try {
      // Send message and get response with emotional analysis
      const response = await sendLivingMemoryMessage(
        sessionRef.current,
        content,
        character
      );

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Batch update: save assistant message, thought signature, and emotional state in one save
      updatedMemory = batchUpdateMemory(updatedMemory, {
        messages: [assistantMessage],
        thoughtSignature: response.thoughtSignature,
        emotionalAnalysis: response.emotionalAnalysis,
      });

      // Update local state
      setMemory(updatedMemory);
    } catch (err) {
      console.error('Living Memory error:', err);
      setError('Failed to get response. The spirit may be resting...');
    } finally {
      setIsLoading(false);
    }
  }, [character, memory, startConversation]);

  const endConversation = useCallback(() => {
    sessionRef.current = null;
    // Don't clear messages - let them persist for the UI
  }, []);

  return {
    messages,
    memory,
    isLoading,
    error,
    moodEmoji,
    trustDescription,
    isDeceased,
    sendMessage,
    startConversation,
    endConversation,
  };
}
