/// <reference types="vite/client" />
import { describe, beforeEach, it, expect } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/Account/SignUp';

// Get the environment variables
const VITE_NODE_API_URL = process.env.VITE_NODE_API_URL;

// Mock fetch globally
global.fetch = jest.fn();

describe('Auth Components', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should handle signup form submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'User created successfully' })
      })
    );

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Verify fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${VITE_NODE_API_URL}/api/auth/signup`,
        expect.any(Object)
      );
    });
  });
}); 