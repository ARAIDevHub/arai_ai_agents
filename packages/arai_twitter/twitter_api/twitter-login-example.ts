import { CookieJar, Cookie } from 'tough-cookie';
import { Headers } from 'headers-polyfill';
import * as OTPAuth from 'otpauth';

// Core interfaces
interface TwitterAuthOptions {
  fetch: typeof fetch;
  transform: Partial<FetchTransformOptions>;
}

interface TwitterAuth {
  fetch: typeof fetch;
  cookieJar(): CookieJar;
  isLoggedIn(): Promise<boolean>;
}

interface FetchTransformOptions {
  headers?: HeadersInit;
  queryParams?: Record<string, string>;
}

// Auth Flow Types
interface TwitterUserAuthFlowInitRequest {
  flow_name: string;
  input_flow_data: Record<string, unknown>;
}

interface TwitterUserAuthFlowSubtaskRequest {
  flow_token: string;
  subtask_inputs: ({
    subtask_id: string;
  } & Record<string, unknown>)[];
}

interface TwitterUserAuthFlowResponse {
  flow_token?: string;
  status?: string;
  subtasks?: TwitterUserAuthSubtask[];
}

interface TwitterUserAuthSubtask {
  subtask_id: string;
  enter_text?: Record<string, never>;
}

// Main Login Class
export class TwitterLogin {
  private cookieJar: CookieJar;
  private fetch: typeof fetch;
  
  constructor() {
    this.cookieJar = new CookieJar();
    this.fetch = fetch; // You might want to use a custom fetch implementation
  }

  // Main login method
  async login(
    username: string,
    password: string,
    email?: string,
    twoFactorSecret?: string
  ): Promise<void> {
    // Step 1: Initialize login flow
    const flowToken = await this.initializeLoginFlow();
    
    // Step 2: Handle JS check
    await this.handleJsInstrumentation(flowToken);
    
    // Step 3: Submit username
    const usernameToken = await this.submitUsername(username, flowToken);
    
    // Step 4: Submit password
    const passwordToken = await this.submitPassword(password, usernameToken);
    
    // Step 5: Handle 2FA if needed
    if (twoFactorSecret) {
      await this.handle2FA(twoFactorSecret, passwordToken);
    }

    // Step 6: Handle email verification if needed
    if (email) {
      await this.handleEmailVerification(email, passwordToken);
    }

    // Verify successful login
    if (!await this.isLoggedIn()) {
      throw new Error('Login failed');
    }
  }

  // Helper Methods
  private async initializeLoginFlow(): Promise<string> {
    const url = 'https://api.twitter.com/1.1/onboarding/task.json';
    
    const payload: TwitterUserAuthFlowInitRequest = {
      flow_name: 'login',
      input_flow_data: {
        flow_context: {
          debug_overrides: {},
          start_location: {
            location: 'splash_screen'
          }
        }
      }
    };

    const headers = new Headers({
      'Authorization': `Bearer ${this.getBearerToken()}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-twitter-client-language': 'en',
      'x-twitter-active-user': 'yes',
      'x-csrf-token': await this.getCsrfToken()
    });

    const response = await this.fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data: TwitterUserAuthFlowResponse = await response.json();
    return data.flow_token!;
  }

  private async handleJsInstrumentation(flowToken: string): Promise<string> {
    const url = 'https://api.twitter.com/1.1/onboarding/task.json';
    
    const payload: TwitterUserAuthFlowSubtaskRequest = {
      flow_token: flowToken,
      subtask_inputs: [{
        subtask_id: 'LoginJsInstrumentationSubtask',
        js_instrumentation: {
          response: JSON.stringify({
            rf: { af: true, bl: true },
            s: 'https://twitter.com'
          }),
        }
      }]
    };

    const response = await this.fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    const data: TwitterUserAuthFlowResponse = await response.json();
    return data.flow_token!;
  }

  private async submitUsername(username: string, flowToken: string): Promise<string> {
    const url = 'https://api.twitter.com/1.1/onboarding/task.json';
    
    const payload: TwitterUserAuthFlowSubtaskRequest = {
      flow_token: flowToken,
      subtask_inputs: [{
        subtask_id: 'LoginEnterUserIdentifierSSO',
        settings_list: {
          setting_responses: [{
            key: 'user_identifier',
            response_data: { text_data: { result: username } }
          }]
        }
      }]
    };

    const response = await this.fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    const data: TwitterUserAuthFlowResponse = await response.json();
    return data.flow_token!;
  }

  private async submitPassword(password: string, flowToken: string): Promise<string> {
    const url = 'https://api.twitter.com/1.1/onboarding/task.json';
    
    const payload: TwitterUserAuthFlowSubtaskRequest = {
      flow_token: flowToken,
      subtask_inputs: [{
        subtask_id: 'LoginEnterPassword',
        enter_password: {
          password,
          link: 'current_password'
        }
      }]
    };

    const response = await this.fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    const data: TwitterUserAuthFlowResponse = await response.json();
    return data.flow_token!;
  }

  private async handle2FA(secret: string, flowToken: string): Promise<string> {
    const totp = new OTPAuth.TOTP({
      secret: secret,
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    });

    const code = totp.generate();

    const url = 'https://api.twitter.com/1.1/onboarding/task.json';
    
    const payload: TwitterUserAuthFlowSubtaskRequest = {
      flow_token: flowToken,
      subtask_inputs: [{
        subtask_id: 'LoginTwoFactorAuthChallenge',
        enter_text: {
          text: code,
          link: 'login_verification_code'
        }
      }]
    };

    const response = await this.fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    const data: TwitterUserAuthFlowResponse = await response.json();
    return data.flow_token!;
  }

  // Utility methods
  private getBearerToken(): string {
    return 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
  }

  private async getCsrfToken(): Promise<string> {
    const cookies = await this.cookieJar.getCookies('https://twitter.com');
    const csrfCookie = cookies.find(cookie => cookie.key === 'ct0');
    return csrfCookie?.value ?? '';
  }

  private getHeaders(): Headers {
    return new Headers({
      'Authorization': `Bearer ${this.getBearerToken()}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-twitter-client-language': 'en',
      'x-twitter-active-user': 'yes',
      'x-csrf-token': this.getCsrfToken()
    });
  }

  public async isLoggedIn(): Promise<boolean> {
    try {
      const response = await this.fetch('https://api.twitter.com/1.1/account/verify_credentials.json', {
        headers: this.getHeaders()
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Cookie management
  public async getCookies(): Promise<Cookie[]> {
    return this.cookieJar.getCookies('https://twitter.com');
  }

  public async setCookies(cookies: Cookie[]): Promise<void> {
    for (const cookie of cookies) {
      await this.cookieJar.setCookie(cookie, 'https://twitter.com');
    }
  }

  public async clearCookies(): Promise<void> {
    await this.cookieJar.removeAllCookies();
  }
}

// Usage example
async function main() {
  const twitter = new TwitterLogin();
  
  try {
    await twitter.login(
      'username',
      'password',
      'email@example.com', // optional
      'TOTP_SECRET' // optional
    );
    
    console.log('Login successful!');
    
    // Get cookies for later use
    const cookies = await twitter.getCookies();
    console.log('Cookies:', cookies);
    
  } catch (error) {
    console.error('Login failed:', error);
  }
} 