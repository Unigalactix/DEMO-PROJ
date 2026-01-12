import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders plain text content', () => {
    render(<MarkdownRenderer content="Hello, World!" />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('renders markdown headings correctly', () => {
    const content = `# Heading 1

## Heading 2

### Heading 3`;
    render(<MarkdownRenderer content={content} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
  });

  it('renders markdown links correctly', () => {
    render(<MarkdownRenderer content="[Click here](https://example.com)" />);
    
    const link = screen.getByRole('link', { name: 'Click here' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders markdown lists correctly', () => {
    const listContent = `
- Item 1
- Item 2
- Item 3
`;
    render(<MarkdownRenderer content={listContent} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders markdown code blocks correctly', () => {
    render(<MarkdownRenderer content="`inline code`" />);
    
    const codeElement = screen.getByText('inline code');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');
  });

  it('renders markdown blockquotes correctly', () => {
    render(<MarkdownRenderer content="> This is a quote" />);
    
    expect(screen.getByText('This is a quote')).toBeInTheDocument();
  });

  it('handles empty content gracefully', () => {
    const { container } = render(<MarkdownRenderer content="" />);
    expect(container.querySelector('.markdown-content')).toBeInTheDocument();
  });
});
