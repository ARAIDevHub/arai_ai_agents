/// <reference types="vite/client" />
import { describe, beforeEach, afterEach, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../pages/Account/ForgotPassword';
import { BrowserRouter } from 'react-router-dom';

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should display a success message on successful submission', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      })
    );

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password reset instructions have been sent to your email/i)
      ).toBeInTheDocument();
    });
  });

  it('should display an error message on failed submission', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Failed to process request' }),
      })
    );

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(emailInput, { target: { value: 'fail@example.com' } });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to process request/i)).toBeInTheDocument();
    });
  });

  it('should display an error message on network failure', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const resetButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(emailInput, { target: { value: 'error@example.com' } });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to process request. please try again./i)
      ).toBeInTheDocument();
    });
  });
}); 