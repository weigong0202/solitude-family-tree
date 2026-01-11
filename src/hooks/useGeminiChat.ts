import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatSession } from '@google/generative-ai';
import type { ChatMessage } from '../types';
import { createChatSession, sendChatMessage, isGeminiInitialized } from '../services/gemini';

export function useGeminiChat(currentChapter: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<ChatSession | null>(null);
  const lastChapterRef = useRef<number>(currentChapter);

  // Reset session when chapter changes significantly
  useEffect(() => {
    if (Math.abs(currentChapter - lastChapterRef.current) > 0) {
      sessionRef.current = null;
      lastChapterRef.current = currentChapter;
      // Don't clear messages - let user keep their conversation history
    }
  }, [currentChapter]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (!isGeminiInitialized()) {
      setError('Please enter your Gemini API key to use the chat feature.');
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

    // Initialize session if needed
    if (!sessionRef.current) {
      sessionRef.current = createChatSession(currentChapter);
    }

    if (!sessionRef.current) {
      setError('Failed to create chat session.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(sessionRef.current, content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentChapter]);

  const clearChat = useCallback(() => {
    setMessages([]);
    sessionRef.current = null;
    setError(null);
  }, []);

  const addMessage = useCallback((message: { role: 'user' | 'assistant'; content: string }) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role: message.role,
      content: message.content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    addMessage,
  };
}
