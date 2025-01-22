import requests
from requests.cookies import RequestsCookieJar
from http.cookies import SimpleCookie

class TwitterAuthBase:
    def __init__(self, headers=None):
        self.session = requests.Session()
        if headers:
            self.session.headers.update(headers)
        self.cookies = RequestsCookieJar()

    def set_cookies(self, cookies):
        for cookie in cookies:
            self.cookies.set_cookie(cookie)

    def get_cookies(self):
        return self.cookies

    def get_cookie_string(self):
        cookie_string = "; ".join(f"{name}={value}" for name, value in self.cookies.items())
        return cookie_string

class TwitterGuestAuth(TwitterAuthBase):
    def __init__(self, bearer_token, headers=None):
        super().__init__(headers)
        self.bearer_token = bearer_token
        self.guest_token = None
        self.refresh_guest_token()

    def refresh_guest_token(self):
        headers = {
            'Authorization': f'Bearer {self.bearer_token}',
        }
        response = self.session.post('https://api.twitter.com/1.1/guest/activate.json', headers=headers)
        response.raise_for_status()
        self.guest_token = response.json()['guest_token']
        self.cookies.update(response.cookies)

    def get_headers(self):
        headers = {
            'Authorization': f'Bearer {self.bearer_token}',
            'x-guest-token': self.guest_token,
        }
        return headers

class TwitterUserAuth(TwitterAuthBase):
    def __init__(self, bearer_token, username, password, email=None, headers=None):
        super().__init__(headers)
        self.bearer_token = bearer_token
        self.username = username
        self.password = password
        self.email = email
        self.ct0 = None
        self.auth_token = None
        self.login()

    def login(self):
        guest_auth = TwitterGuestAuth(self.bearer_token)
        guest_token = guest_auth.guest_token

        headers = {
            'Authorization': f'Bearer {self.bearer_token}',
            'x-guest-token': guest_token,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'x-twitter-client-language': 'en',
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session',
            'Origin': 'https://twitter.com',
            'Referer': 'https://twitter.com/',
        }

        # Initialize login flow
        data = {
            "flow_name": "login",
            "input_flow_data": {
                "flow_context": {
                    "debug_overrides": {},
                    "start_location": {
                        "location": "splash_screen"
                    }
                }
            }
        }

        response = self.session.post('https://api.twitter.com/1.1/onboarding/task.json', headers=headers, json=data)
        response.raise_for_status()
        flow_token = response.json()['flow_token']

        # Handle subtasks
        while True:
            data = {
                "flow_token": flow_token,
                "subtask_inputs": []
            }

            response_json = response.json()

            if 'subtasks' in response_json:
                for subtask in response_json['subtasks']:
                    subtask_id = subtask['subtask_id']

                    if subtask_id == 'LoginEnterUserIdentifierSSO':
                        data['subtask_inputs'].append({
                            "subtask_id": "LoginEnterUserIdentifierSSO",
                            "settings_list": {
                                "setting_responses": [
                                    {
                                        "key": "user_identifier",
                                        "response_data": {
                                            "text_data": {
                                                "result": self.username
                                            }
                                        }
                                    }
                                ],
                                "link": "next_link"
                            }
                        })
                    elif subtask_id == 'LoginEnterPassword':
                        data['subtask_inputs'].append({
                            "subtask_id": "LoginEnterPassword",
                            "enter_password": {
                                "password": self.password,
                                "link": "next_link"
                            }
                        })
                    elif subtask_id == 'LoginEnterAlternateIdentifierSubtask':
                        data['subtask_inputs'].append({
                            "subtask_id": "LoginEnterAlternateIdentifierSubtask",
                            "enter_text": {
                                "text": self.email,
                                "link": "next_link"
                            }
                        })
                    elif subtask_id == 'AccountDuplicationCheck':
                        data['subtask_inputs'].append({
                            "subtask_id": "AccountDuplicationCheck",
                            "check_logged_in_account": {
                                "link": "AccountDuplicationCheck_false"
                            }
                        })
                    else:
                        print(f"Unhandled subtask: {subtask_id}")

            response = self.session.post('https://api.twitter.com/1.1/onboarding/task.json', headers=headers, json=data)
            response.raise_for_status()

            if response.json().get('status') == 'success':
                break

            flow_token = response.json()['flow_token']

        # Extract cookies
        self.ct0 = self.session.cookies.get('ct0')
        self.auth_token = self.session.cookies.get('auth_token')
        self.cookies.update(self.session.cookies)

    def get_headers(self):
        headers = {
            'Authorization': f'Bearer {self.bearer_token}',
            'x-csrf-token': self.ct0,
            'Cookie': self.get_cookie_string(),
        }
        return headers