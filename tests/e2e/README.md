# E2E Tests

This directory will contain end-to-end tests for Writigo applications.

## Structure

```
e2e/
├── editor/          # Electron editor E2E tests
├── web-ui/          # Web interface E2E tests
└── integration/     # Cross-component integration tests
```

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suite
npx playwright test tests/e2e/editor
```

## Getting Started

When implementing E2E tests:

1. Follow the patterns in `docs/testing.md`
2. Use Page Object Model for maintainability
3. Test critical user journeys
4. Include accessibility tests

Example test structure:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Writigo Editor', () => {
  test('should create and save a document', async ({ page }) => {
    // Test implementation here
  })
})
```
