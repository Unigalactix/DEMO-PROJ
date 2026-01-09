import { useState, useRef, useEffect } from 'react';
import { useChatStream } from './useChatStream';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';

export function Chat() {
    const { messages, isLoading, sendMessage } = useChatStream();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const message = input;
        setInput('');
        await sendMessage(message);
    };

    return (
        <div className="chat-container">
            <div className="messages-list">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <h1>Enterprise Copilot</h1>
                        <p>Ask me about your contracts, termination policies, or general questions.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.role}`}>
                        <div className="message-content">
                            <div className="role-label">{msg.role === 'user' ? 'You' : 'Copilot'}</div>
                            <MarkdownRenderer content={msg.content} />
                        </div>
                    </div>
                ))}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        autoFocus
                    />
                    <button type="submit" disabled={isLoading || !input.trim()}>
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </form>

            <style>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    max-width: 900px;
                    margin: 0 auto;
                    background-color: #0f172a; /* Slate 900 */
                    color: #e2e8f0; /* Slate 200 */
                }

                .messages-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .empty-state {
                    text-align: center;
                    margin-top: 4rem;
                    color: #94a3b8;
                }

                .message {
                    display: flex;
                    flex-direction: column;
                }

                .message.user {
                    align-items: flex-end;
                }

                .message.assistant {
                    align-items: flex-start;
                }

                .message-content {
                    max-width: 85%;
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    position: relative;
                }

                .message.user .message-content {
                    background-color: #3b82f6; /* Blue 500 */
                    color: white;
                    border-bottom-right-radius: 0.25rem;
                }

                .message.assistant .message-content {
                    background-color: #1e293b; /* Slate 800 */
                    border: 1px solid #334155;
                    border-bottom-left-radius: 0.25rem;
                }

                .role-label {
                    font-size: 0.75rem;
                    opacity: 0.7;
                    margin-bottom: 0.25rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .input-area {
                    padding: 1.5rem;
                    background-color: #0f172a;
                    border-top: 1px solid #1e293b;
                    position: sticky;
                    bottom: 0;
                }

                .input-wrapper {
                    display: flex;
                    gap: 1rem;
                    background-color: #1e293b;
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                    border: 1px solid #334155;
                }

                input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 0.75rem;
                    font-size: 1rem;
                    outline: none;
                }

                button {
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                button:disabled {
                    background-color: #475569;
                    cursor: not-allowed;
                }

                button:hover:not(:disabled) {
                    background-color: #2563eb;
                }
            `}</style>
        </div>
    );
}
