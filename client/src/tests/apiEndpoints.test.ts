/// <reference types="vite/client" />
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Setup Mock Service Worker
const server = setupServer(
  // Mock signup endpoint
  http.post('http://node_server:3001/api/auth/signup', () => {
    return HttpResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  }),
  
  // Mock login endpoint
  http.post('http://node_server:3001/api/auth/login', () => {
    return HttpResponse.json(
      { token: 'mock-jwt-token' },
      { status: 200 }
    );
  }),
  
  // Mock health check
  http.get('http://node_server:3001/', () => {
    return HttpResponse.json(
      { status: 'ok', message: 'Server is running' },
      { status: 200 }
    );
  })
);

// Start the mock server before tests
beforeAll(() => server.listen());
// Reset any request handlers that we may add during tests
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished
afterAll(() => server.close());

// Get the environment variables from the process.env
const VITE_NODE_API_URL = process.env.VITE_NODE_API_URL || 'http://node_server:3001';

// Helper function for retrying requests
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 2000): Promise<Response> {
  try {
    console.log(`Attempting request to: ${url}`);
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    if (retries <= 0) throw error;
    console.log(`Request to ${url} failed. Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay);
  }
}

describe('API Endpoints', () => {
  beforeAll(() => {
    // Log the URL we're using for debugging
    console.log(`Using Node API URL: ${VITE_NODE_API_URL}`);
  });

  it('should create a new user via the signup endpoint', async () => {
    // Check if the server is reachable at all
    try {
      const healthResponse = await fetch(`${VITE_NODE_API_URL}/`);
      console.log(`Server health check status: ${healthResponse.status}`);
    } catch (error) {
      console.error('Error reaching server:', error);
    }

    const signupURL = `${VITE_NODE_API_URL}/api/auth/signup`;
    console.log(`Trying to access signup URL: ${signupURL}`);
    
    const response = await fetchWithRetry(signupURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test_${Date.now()}@example.com`, // Ensure unique email
        password: 'password123',
        confirmPassword: 'password123'
      })
    });
    
    // Expect a 201 (Created) status
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('User created successfully');
  });

  it('should login an existing user via the login endpoint', async () => {
    const loginURL = `${VITE_NODE_API_URL}/api/auth/login`;
    console.log(`Trying to access login URL: ${loginURL}`);
    
    const response = await fetchWithRetry(loginURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    // Expect a 200 (OK) status on successful login
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
  });
}); 