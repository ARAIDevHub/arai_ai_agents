// client/src/tests/setupTests.ts
import '@testing-library/jest-dom';

// Mock Vite's import.meta.env with URLs from your .env (or hard-coded for tests)
(global as any).import = {
  meta: {
    env: {
      VITE_PYTHON_API_URL: 'http://localhost:8080',
      VITE_NODE_API_URL: 'http://localhost:3001',
      VITE_CLIENT_URL: 'http://localhost:5173'
    }
  }
};