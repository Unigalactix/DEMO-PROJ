import { useEffect, useRef } from 'react';
import { useChatStream } from '../features/chat/useChatStream';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import './ChatUI.css';

export function ChatUI() {
    const { messages, isLoading, sendMessage } = useChatStream();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Enterprise AI Copilot</h1>
                <p>Ask questions about contracts, policies, or general topics</p>
            </div>
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <h2>👋 Welcome to the Enterprise AI Copilot!</h2>
                        <p>Try asking:</p>
                        <ul>
                            <li>"What is the termination policy?"</li>
                            <li>"Help me write an email"</li>
                            <li>"Hello"</li>
                        </ul>
                    </div>
                )}
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        isStreaming={message.isStreaming}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
    );
}
