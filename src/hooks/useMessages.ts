import { useState, useEffect } from "react";
import { Message } from "@/types/MessagesProps";

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/messages");

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: Message[] = await response.json();

      // If is necessary, filter deleted messages
      const activeMessages = data.filter((message) => !message.is_deleted);

      // Sort by dates (recentlier first)
      const sortedMessages = activeMessages.sort(
        (a, b) =>
          new Date(b.message_date).getTime() -
          new Date(a.message_date).getTime()
      );

      setMessages(sortedMessages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manual Refetch function
  const refetch = async () => {
    await fetchMessages();
  };

  // Load data mounting a component
  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    refetch,
  };
}
