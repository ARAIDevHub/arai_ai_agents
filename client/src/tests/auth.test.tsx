import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/Account/SignUp';
import Login from '../pages/Account/Login';

// Mock fetch globally
global.fetch = jest.fn();

describe('Auth Components', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('SignUp Component', () => {
    it('should handle successful signup', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() =>
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
          `${import.meta.env.VITE_NODE_API_URL}/api/auth/signup`,
          expect.any(Object)
        );
      });
    });
  });
}); 