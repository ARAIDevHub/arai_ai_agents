/// <reference types="vite/client" />
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/Account/SignUp';

// Mock fetch globally
(global as any).fetch = jest.fn();

describe('Auth Components', () => {
  beforeEach(() => {
    (global.fetch as any).mockClear();
  });

  describe('SignUp Component', () => {
    it('should handle successful signup', async () => {
      (global.fetch as any).mockImplementationOnce(() =>
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

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByText('Sign Up'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${(import.meta as any).env.VITE_NODE_API_URL}/api/auth/signup`,
          expect.any(Object)
        );
      });
    });
  });
}); 