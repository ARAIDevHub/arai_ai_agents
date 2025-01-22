Authentication URLs
Guest Token: https://api.twitter.com/1.1/guest/activate.json
Login Flow: https://api.twitter.com/1.1/onboarding/task.json
Logout: https://api.twitter.com/1.1/account/logout.json

  constructor(private readonly options?: Partial<ScraperOptions>) {
    this.token = bearerToken;
    this.useGuestAuth();
  }

  export const bearerToken =
  'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';

  cookieJar(): CookieJar {
    return this.jar;
  }

 private async executeFlowTask(
    data: TwitterUserAuthFlowRequest,
  ): Promise<FlowTokenResult> {
    const onboardingTaskUrl =
      'https://api.twitter.com/1.1/onboarding/task.json';

    const token = this.guestToken;
    if (token == null) {
      throw new Error('Authentication token is null or undefined.');
    }

    const headers = new Headers({
      authorization: `Bearer ${this.bearerToken}`,
      cookie: await this.getCookieString(),
      'content-type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
      'x-guest-token': token,
      'x-twitter-auth-type': 'OAuth2Client',
      'x-twitter-active-user': 'yes',
      'x-twitter-client-language': 'en',
    });
    await this.installCsrfToken(headers);

    const res = await this.fetch(onboardingTaskUrl, {
      credentials: 'include',
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    await updateCookieJar(this.jar, res.headers);

    if (!res.ok) {
      return { status: 'error', err: new Error(await res.text()) };
    }

    const flow: TwitterUserAuthFlowResponse = await res.json();
    if (flow?.flow_token == null) {
      return { status: 'error', err: new Error('flow_token not found.') };
    }

    if (flow.errors?.length) {
      return {
        status: 'error',
        err: new Error(
          `Authentication error (${flow.errors[0].code}): ${flow.errors[0].message}`,
        ),
      };
    }

    if (typeof flow.flow_token !== 'string') {
      return {
        status: 'error',
        err: new Error('flow_token was not a string.'),
      };
    }

    const subtask = flow.subtasks?.length ? flow.subtasks[0] : undefined;
    Check(TwitterUserAuthSubtask, subtask);

    if (subtask && subtask.subtask_id === 'DenyLoginSubtask') {
      return {
        status: 'error',
        err: new Error('Authentication error: DenyLoginSubtask'),
      };
    }

    return {
      status: 'success',
      subtask,
      flowToken: flow.flow_token,
    };
  }
}

private async initLogin() {
  // Reset certain session-related cookies because Twitter complains sometimes if we don't
  this.removeCookie('twitter_ads_id=');
  this.removeCookie('ads_prefs=');
  this.removeCookie('_twitter_sess=');
  this.removeCookie('zipbox_forms_auth_token=');
  this.removeCookie('lang=');
  this.removeCookie('bouncer_reset_cookie=');
  this.removeCookie('twid=');
  this.removeCookie('twitter_ads_idb=');
  this.removeCookie('email_uid=');
  this.removeCookie('external_referer=');
  this.removeCookie('ct0=');
  this.removeCookie('aa_u=');

  return await this.executeFlowTask({
    flow_name: 'login',
    input_flow_data: {
      flow_context: {
        debug_overrides: {},
        start_location: {
          location: 'splash_screen',
        },
      },
    },
  });
}