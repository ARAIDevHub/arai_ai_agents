/// <reference types="node" />
// Remove the import that's causing issues
// import { jest } from '@jest/globals';

// client/src/tests/setupJest.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';
// Remove the import for Config which isn't needed in a setup file
// import type { Config } from '@jest/types';

// Set environment variables for tests - use Docker service names as fallbacks
process.env.VITE_PYTHON_API_URL = process.env.VITE_PYTHON_API_URL || 'http://python_api:8080';
process.env.VITE_NODE_API_URL = process.env.VITE_NODE_API_URL || 'http://node_server:3001';
process.env.VITE_CLIENT_URL = process.env.VITE_CLIENT_URL || 'http://localhost:5173';

// Add a global fetch timeout to prevent tests from hanging indefinitely
jest.setTimeout(30000);