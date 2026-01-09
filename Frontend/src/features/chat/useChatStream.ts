import { useState, useRef, useCallback } from 'react';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

export function useChatStream() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        setIsLoading(true);
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
        };

        const assistantMessageId = crypto.randomUUID();
        const initialAssistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        };

        setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);

        abortControllerRef.current = new AbortController();

        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5222';
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: content }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status} ${response.statusText}`);
            }
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Try to parse the accumulated buffer as JSON array
                try {
                    const tokens = JSON.parse(buffer);
                    if (Array.isArray(tokens)) {
                        // If successfully parsed as array, join all tokens
                        const fullContent = tokens.join('');
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: fullContent }
                                    : msg
                            )
                        );
                    }
                } catch {
                    // Not yet a complete JSON array, continue accumulating
                }
            }
        } catch (error) {
            console.error("Streaming error", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + "\n\n[Error: Connection interrupted]", isStreaming: false }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId
                        ? { ...msg, isStreaming: false }
                        : msg
                )
            );
        }
    }, []);

    return { messages, isLoading, sendMessage };
}
