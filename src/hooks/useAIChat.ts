import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useRateLimiting } from './useRateLimiting';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useAIChat = (coachId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Rate limiting: 10 requests per minute
  const { checkRateLimit } = useRateLimiting({
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  });

  // Load chat history when component mounts
  useEffect(() => {
    const loadHistory = async () => {
      if (!user || !coachId) return;
      
      setIsLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from('ai_chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('coach_id', coachId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setSessionId(data.id);
          const loadedMessages = (data.messages as any[] || []).map(m => ({
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp || Date.now())
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user, coachId]);

  const createSession = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          coach_id: coachId,
          messages: [],
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }, [user, coachId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Check rate limit before sending
    if (!checkRateLimit()) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";

    try {
      // Create session if not exists
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createSession();
      }

      const messagesPayload = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Get user session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Необходима авторизация');
      }

      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: messagesPayload,
          coachId,
          sessionId: currentSessionId
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Слишком много запросов",
            description: "Пожалуйста, подождите немного перед следующим сообщением",
            variant: "destructive",
          });
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Требуется пополнение",
            description: "Пожалуйста, пополните баланс для продолжения",
            variant: "destructive",
          });
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        throw new Error('Failed to start stream');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      // Streaming with message splitting
      let fullResponse = "";
      const messageChunks: string[] = [];
      let currentChunkIndex = 0;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
            }
          } catch (e) {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (const raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
            }
          } catch { /* ignore */ }
        }
      }

      // Split response into short messages
      if (fullResponse) {
        const sentences = fullResponse.match(/[^.!?\n]+[.!?\n]+/g) || [fullResponse];
        let currentChunk = "";
        
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > 150 && currentChunk) {
            messageChunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
        
        if (currentChunk.trim()) {
          messageChunks.push(currentChunk.trim());
        }

        // Display messages one by one with delay
        const displayNextChunk = () => {
          if (currentChunkIndex >= messageChunks.length) {
            assistantContent = messageChunks.join('\n\n');
            return;
          }

          const chunk = messageChunks[currentChunkIndex];
          setMessages(prev => [...prev, {
            role: "assistant",
            content: chunk,
            timestamp: new Date()
          }]);

          currentChunkIndex++;
          
          if (currentChunkIndex < messageChunks.length) {
            setTimeout(displayNextChunk, 1200);
          } else {
            assistantContent = messageChunks.join('\n\n');
          }
        };

        displayNextChunk();
      }

      // Save chat to database after completion
      if (currentSessionId && fullResponse) {
        const allNewMessages = messageChunks.map((chunk, idx) => ({
          role: "assistant" as const,
          content: chunk,
          timestamp: new Date(Date.now() + idx * 1200).toISOString()
        }));

        const updatedMessages = [
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString()
          })),
          {
            role: "user" as const,
            content: userMessage.content,
            timestamp: userMessage.timestamp.toISOString()
          },
          ...allNewMessages
        ];
        
        try {
          await supabase
            .from("ai_chat_sessions")
            .update({
              messages: updatedMessages,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentSessionId);
        } catch (error) {
          console.error("Error saving session:", error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Ошибка отправки сообщения",
        description: "Пожалуйста, попробуйте еще раз",
        variant: "destructive",
      });
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, sessionId, coachId, user, toast, createSession]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    sendMessage,
    clearMessages,
  };
};
