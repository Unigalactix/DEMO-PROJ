# React + TypeScript + Vite Frontend

This is the frontend application built with React, TypeScript, and Vite. It provides a chat UI interface with markdown rendering capabilities.

## Prerequisites

- Node.js 18+ and npm

## Getting Started

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `Frontend` directory:

```
VITE_API_BASE_URL=http://localhost:5222
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the production bundle (runs TypeScript checks and Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally
- `npm test` - Run unit tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI

## Testing

This project uses **Vitest** as the testing framework along with **React Testing Library** for component testing.

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui
```

### Test Structure

Tests are located next to the components they test with a `.test.tsx` extension:

```
src/
  components/
    ChatInput.tsx
    ChatInput.test.tsx
    MarkdownRenderer.tsx
    MarkdownRenderer.test.tsx
```

### Writing Tests

Example test for a component:

```typescript
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
});
```

### Test Coverage

Current test coverage includes:
- ✅ ChatInput component (5 tests)
- ✅ MarkdownRenderer component (7 tests)

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Streaming Chat UI**: Real-time message streaming with markdown support
- **Backend API**: Posts to backend streaming endpoint at `/api/chat`
- **CORS**: Configured in the backend for `http://localhost:5173`

## Build for Production

```bash
npm run build
```

This command:
1. Runs TypeScript type checking (`tsc -b`)
2. Builds the optimized production bundle with Vite
3. Outputs to the `dist` directory

## ESLint Configuration

The project uses ESLint with TypeScript support. For production applications, consider enabling type-aware lint rules. See the ESLint configuration section in `eslint.config.js` for more details.

## License

MIT

