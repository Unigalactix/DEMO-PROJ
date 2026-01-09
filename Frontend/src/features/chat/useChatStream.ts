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
            const response = await fetch('http://localhost:5222/api/chat', { // Updated to match launchSettings.json
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: content }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
            }

            // Parse the complete JSON array response
            try {
                const tokens = JSON.parse(buffer);
                if (Array.isArray(tokens)) {
                    // Simulate streaming by displaying tokens one by one
                    for (const token of tokens) {
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: msg.content + token }
                                    : msg
                            )
                        );
                        // Small delay to show streaming effect
                        await new Promise(resolve => setTimeout(resolve, 30));
                    }
                }
            } catch (e) {
                console.error("Failed to parse response", e);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: buffer }
                            : msg
                    )
                );
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
