import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    const mockOnSend = vi.fn();
    render(<ChatInput onSend={mockOnSend} />);
    
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('calls onSend with trimmed message when form is submitted', () => {
    const mockOnSend = vi.fn();
    render(<ChatInput onSend={mockOnSend} />);
    
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'Send' });
    
    fireEvent.change(input, { target: { value: '  Hello World  ' } });
    fireEvent.click(button);
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello World');
    expect(input.value).toBe('');
  });

  it('does not call onSend when message is empty or only whitespace', () => {
    const mockOnSend = vi.fn();
    render(<ChatInput onSend={mockOnSend} />);
    
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'Send' });
    
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled prop is true', () => {
    const mockOnSend = vi.fn();
    render(<ChatInput onSend={mockOnSend} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'Send' });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('clears input after successful submission', () => {
    const mockOnSend = vi.fn();
    render(<ChatInput onSend={mockOnSend} />);
    
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(input.value).toBe('');
  });
});
