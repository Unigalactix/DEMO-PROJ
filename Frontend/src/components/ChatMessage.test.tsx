import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
  it('renders user message with correct styling', () => {
    render(<ChatMessage role="user" content="Hello, world!" />);
    
    expect(screen.getByText('👤 You')).toBeInTheDocument();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('renders assistant message with correct styling', () => {
    render(<ChatMessage role="assistant" content="Hi there!" />);
    
    expect(screen.getByText('🤖 AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('displays streaming indicator when isStreaming is true', () => {
    const { container } = render(
      <ChatMessage role="assistant" content="Typing..." isStreaming={true} />
    );
    
    const indicator = container.querySelector('.streaming-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator?.textContent).toBe('▊');
  });

  it('does not display streaming indicator when isStreaming is false', () => {
    const { container } = render(
      <ChatMessage role="assistant" content="Done typing" isStreaming={false} />
    );
    
    const indicator = container.querySelector('.streaming-indicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('does not display streaming indicator by default', () => {
    const { container } = render(
      <ChatMessage role="assistant" content="Default message" />
    );
    
    const indicator = container.querySelector('.streaming-indicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    render(<ChatMessage role="assistant" content="**Bold text**" />);
    
    const boldElement = screen.getByText('Bold text');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });
});
