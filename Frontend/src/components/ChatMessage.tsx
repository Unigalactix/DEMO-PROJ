import { MarkdownRenderer } from './MarkdownRenderer';
import './ChatMessage.css';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
    return (
        <div className={`chat-message ${role}`}>
            <div className="message-header">
                <strong>{role === 'user' ? '👤 You' : '🤖 AI Assistant'}</strong>
            </div>
            <div className="message-content">
                <MarkdownRenderer content={content} />
                {isStreaming && <span className="streaming-indicator">▊</span>}
            </div>
        </div>
    );
}
