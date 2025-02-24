/// <reference types="vite/client" />
import { describe, it, expect } from '@jest/globals';

describe('API Endpoints', () => {
  it('should create a new user via the signup endpoint', async () => {
    // Note: ensure your server is running at VITE_NODE_API_URL
    const signupURL = `${(import.meta as any).env.VITE_NODE_API_URL}/api/auth/signup`;
    const response = await fetch(signupURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    });
    
    // Expect a 201 (Created) status (adjust according to your API)
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('User created successfully');
  });

  it('should login an existing user via the login endpoint', async () => {
    // Ensure the user exists (either via the previous test or a fixture)
    const loginURL = `${(import.meta as any).env.VITE_NODE_API_URL}/api/auth/login`;
    const response = await fetch(loginURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    // Expect a 200 (OK) status on successful login
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
  });
}); 