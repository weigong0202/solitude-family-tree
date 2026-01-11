import { useState, useCallback, useRef } from 'react';
import type { ChatSession } from '@google/generative-ai';
import type { Character } from '../types';
import { createCharacterChatSession, sendChatMessage, isGeminiInitialized } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'spirit';
  content: string;
  timestamp: Date;
}

export function useCharacterChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ChatSession | null>(null);
  const characterRef = useRef<Character | null>(null);

  const startSession = useCallback((character: Character, currentChapter: number) => {
    if (!isGeminiInitialized()) {
      setError('Please set your Gemini API key to talk to the dead.');
      return false;
    }

    const session = createCharacterChatSession(character, currentChapter);
    if (!session) {
      setError('Failed to establish connection with the spirit realm.');
      return false;
    }

    sessionRef.current = session;
    characterRef.current = character;
    setError(null);

    // Add initial spirit greeting
    setMessages([{
      id: 'greeting',
      role: 'spirit',
      content: `*A shimmer appears in the air, like heat rising from sun-baked earth. The faint scent of yellow flowers and old parchment fills the space.*

Ah... you have called me back from the realm of shadows. I am ${character.name}${character.nickname ? `, whom they called "${character.nickname}"` : ''}.

The boundary between worlds grows thin when the living remember us. What would you ask of one who has crossed the great river of time? Speak, and I shall answer what I can from beyond the veil...`,
      timestamp: new Date(),
    }]);

    return true;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionRef.current) {
      setError('No connection to the spirit realm.');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(sessionRef.current, content);
      const spiritMessage: Message = {
        id: `spirit-${Date.now()}`,
        role: 'spirit',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, spiritMessage]);
    } catch (err) {
      setError('The spirit fades... the connection has been lost.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endSession = useCallback(() => {
    sessionRef.current = null;
    characterRef.current = null;
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    startSession,
    sendMessage,
    endSession,
    hasActiveSession: sessionRef.current !== null,
  };
}
