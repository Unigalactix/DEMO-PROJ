import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatStream } from './useChatStream';

// Mock fetch
global.fetch = vi.fn();

describe('useChatStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock crypto.randomUUID
    let counter = 0;
    global.crypto.randomUUID = vi.fn(() => `test-uuid-${counter++}`);
  });

  it('initializes with empty messages and not loading', () => {
    const { result } = renderHook(() => useChatStream());
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('adds user message when sending', async () => {
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('["Hello"]'),
            })
            .mockResolvedValueOnce({
              done: true,
            }),
        }),
      },
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatStream());
    
    await act(async () => {
      result.current.sendMessage('Test message');
      // Wait for initial messages to be added
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'Test message',
    });
  });

  it('sets loading state during message send', async () => {
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValue({
            done: true,
          }),
        }),
      },
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatStream());
    
    await act(async () => {
      result.current.sendMessage('Test');
      // Wait a tick for the state to update
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check that loading eventually becomes true and then false
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles fetch errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChatStream());
    
    await act(async () => {
      await result.current.sendMessage('Test message');
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    const assistantMessage = result.current.messages.find(m => m.role === 'assistant');
    expect(assistantMessage?.content).toContain('[Error: Connection interrupted]');
  });

  it('handles non-ok response status', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatStream());
    
    await act(async () => {
      await result.current.sendMessage('Test message');
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    const assistantMessage = result.current.messages.find(m => m.role === 'assistant');
    expect(assistantMessage?.content).toContain('[Error: Connection interrupted]');
  });

  it('uses environment variable for API base URL', async () => {
    const originalEnv = import.meta.env.VITE_API_BASE_URL;
    import.meta.env.VITE_API_BASE_URL = 'https://custom-api.com';

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValue({
            done: true,
          }),
        }),
      },
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatStream());
    
    await act(async () => {
      await result.current.sendMessage('Test');
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://custom-api.com/api/chat',
      expect.any(Object)
    );

    // Restore
    import.meta.env.VITE_API_BASE_URL = originalEnv;
  });
});
