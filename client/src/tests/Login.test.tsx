/// <reference types="vite/client" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Account/Login';
import { BrowserRouter } from 'react-router-dom';
import { describe, beforeEach, afterEach, it, expect, jest } from '@jest/globals';

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual: any = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should login successfully, store the token, and navigate to home', async () => {
    const fakeToken = 'fake-token';
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: fakeToken }),
      })
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display an error message on failed login', async () => {
    (global as any).fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
}); 