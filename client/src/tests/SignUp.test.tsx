/// <reference types="vite/client" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../pages/Account/SignUp';
import { BrowserRouter } from 'react-router-dom';
import { describe, beforeEach, afterEach, it, expect, jest } from '@jest/globals';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual: any = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('SignUp Component', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    mockedUsedNavigate.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should show an error if passwords do not match', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(signUpButton);

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('should navigate to login on successful signup', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: 'User created successfully' }),
      })
    );

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('should display an error if signup fails', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Sign up failed' }),
      })
    );

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText(/sign up failed/i)).toBeInTheDocument();
    });
  });
}); 