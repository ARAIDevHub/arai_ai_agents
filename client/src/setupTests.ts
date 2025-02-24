import '@testing-library/jest-dom';

// Mock Vite's import.meta.env with actual URLs from .env
global.import = {
  meta: {
    env: {
      VITE_PYTHON_API_URL: 'http://localhost:8080',
      VITE_NODE_API_URL: 'http://localhost:3001',
      VITE_CLIENT_URL: 'http://localhost:5173'
    }
  }
} as any; 