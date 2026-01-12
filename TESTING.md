# Testing Guide

This document provides instructions for running tests locally in the DEMO-PROJ repository.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Frontend Testing

The frontend uses **[Vitest](https://vitest.dev/)** as the testing framework along with **[React Testing Library](https://testing-library.com/react)** for component testing.

### Running Tests

Navigate to the Frontend directory:

```bash
cd Frontend
```

#### Run all tests once

```bash
npm test
```

or

```bash
npm run test
```

#### Run tests in watch mode

This will re-run tests automatically when files change:

```bash
npm run test:watch
```

#### Run tests with UI

Vitest provides a visual UI for exploring and debugging tests:

```bash
npm run test:ui
```

This will open a browser window with an interactive test explorer.

### Test Structure

Tests are co-located with the components they test:

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── ChatInput.test.tsx        # Tests for ChatInput
│   │   ├── ChatMessage.tsx
│   │   ├── ChatMessage.test.tsx      # Tests for ChatMessage
│   │   ├── MarkdownRenderer.tsx
│   │   └── MarkdownRenderer.test.tsx # Tests for MarkdownRenderer
│   ├── features/
│   │   └── chat/
│   │       ├── useChatStream.ts
│   │       └── useChatStream.test.ts # Tests for useChatStream hook
│   └── test/
│       └── setup.ts                   # Test setup and configuration
```

### Test Coverage

Current test coverage includes:

- **ChatInput Component**: Form input handling, validation, and submission
- **ChatMessage Component**: Message rendering, styling, and streaming indicators
- **MarkdownRenderer Component**: Markdown parsing and rendering
- **useChatStream Hook**: Message state management, API communication, and error handling

### Writing New Tests

When adding new features or components, please include tests that cover:

1. **Component Rendering**: Verify the component renders correctly
2. **User Interactions**: Test clicks, input changes, form submissions
3. **Edge Cases**: Empty states, error conditions, loading states
4. **Props**: Verify component behavior with different prop combinations

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    // Test implementation
  });
});
```

## Continuous Integration

Tests are automatically run on every push and pull request via GitHub Actions. The CI pipeline:

1. Installs dependencies (`npm ci`)
2. Runs linting (`npm run lint`)
3. Builds the application (`npm run build`)
4. Runs all tests (`npm test`)

View the CI configuration in `.github/workflows/ci.yml`.

## Test Configuration

The test environment is configured in:

- `vite.config.ts`: Vitest configuration
- `src/test/setup.ts`: Global test setup (includes jest-dom matchers)

### Key Configuration Settings

```typescript
{
  test: {
    globals: true,              // Enable global test APIs
    environment: 'happy-dom',   // DOM environment for component tests
    setupFiles: './src/test/setup.ts'
  }
}
```

## Troubleshooting

### Tests failing locally but passing in CI

1. Ensure you're using the correct Node.js version (v18+)
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for uncommitted changes

### "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### Timeout errors

Some tests involving async operations may need increased timeout:

```typescript
it('async test', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
