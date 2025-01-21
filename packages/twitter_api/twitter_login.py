import json
from typing import Optional, List, Dict, Any
import httpx
from http.cookies import SimpleCookie
import pyotp

class TwitterLogin:
    def __init__(self):
        self.client = httpx.Client()
        self.cookies = SimpleCookie()
        
    async def login(
        self,
        username: str,
        password: str,
        email: Optional[str] = None,
        two_factor_secret: Optional[str] = None
    ) -> None:
        """Main login method that handles the Twitter authentication flow."""
        # Step 1: Initialize login flow
        flow_token = await self.initialize_login_flow()
        
        # Step 2: Handle JS check
        flow_token = await self.handle_js_instrumentation(flow_token)
        
        # Step 3: Submit username
        flow_token = await self.submit_username(username, flow_token)
        
        # Step 4: Submit password
        flow_token = await self.submit_password(password, flow_token)
        
        # Step 5: Handle 2FA if needed
        if two_factor_secret:
            flow_token = await self.handle_2fa(two_factor_secret, flow_token)
            
        # Step 6: Handle email verification if needed
        if email:
            flow_token = await self.handle_email_verification(email, flow_token)
            
        # Verify successful login
        if not await self.is_logged_in():
            raise Exception("Login failed")

    async def initialize_login_flow(self) -> str:
        """Initialize the login flow and return the flow token."""
        url = "https://api.twitter.com/1.1/onboarding/task.json"
        
        payload = {
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
        
        response = await self.make_request("POST", url, json=payload)
        return response["flow_token"]

    async def handle_js_instrumentation(self, flow_token: str) -> str:
        """Handle the JavaScript instrumentation check."""
        url = "https://api.twitter.com/1.1/onboarding/task.json"
        
        payload = {
            "flow_token": flow_token,
            "subtask_inputs": [{
                "subtask_id": "LoginJsInstrumentationSubtask",
                "js_instrumentation": {
                    "response": json.dumps({
                        "rf": {"af": True, "bl": True},
                        "s": "https://twitter.com"
                    }),
                }
            }]
        }
        
        response = await self.make_request("POST", url, json=payload)
        return response["flow_token"]

    async def submit_username(self, username: str, flow_token: str) -> str:
        """Submit the username in the login flow."""
        url = "https://api.twitter.com/1.1/onboarding/task.json"
        
        payload = {
            "flow_token": flow_token,
            "subtask_inputs": [{
                "subtask_id": "LoginEnterUserIdentifierSSO",
                "settings_list": {
                    "setting_responses": [{
                        "key": "user_identifier",
                        "response_data": {"text_data": {"result": username}}
                    }]
                }
            }]
        }
        
        response = await self.make_request("POST", url, json=payload)
        return response["flow_token"]

    async def submit_password(self, password: str, flow_token: str) -> str:
        """Submit the password in the login flow."""
        url = "https://api.twitter.com/1.1/onboarding/task.json"
        
        payload = {
            "flow_token": flow_token,
            "subtask_inputs": [{
                "subtask_id": "LoginEnterPassword",
                "enter_password": {
                    "password": password,
                    "link": "current_password"
                }
            }]
        }
        
        response = await self.make_request("POST", url, json=payload)
        return response["flow_token"]

    async def handle_2fa(self, secret: str, flow_token: str) -> str:
        """Handle two-factor authentication."""
        totp = pyotp.TOTP(secret)
        code = totp.now()
        
        url = "https://api.twitter.com/1.1/onboarding/task.json"
        
        payload = {
            "flow_token": flow_token,
            "subtask_inputs": [{
                "subtask_id": "LoginTwoFactorAuthChallenge",
                "enter_text": {
                    "text": code,
                    "link": "login_verification_code"
                }
            }]
        }
        
        response = await self.make_request("POST", url, json=payload)
        return response["flow_token"]

    async def handle_email_verification(self, email: str, flow_token: str) -> str:
        """Handle email verification if required."""
        # Implementation would depend on Twitter's email verification flow
        raise NotImplementedError("Email verification not implemented")

    async def make_request(self, method: str, url: str, **kwargs) -> Dict[str, Any]:
        """Make an HTTP request with proper headers and handle response."""
        headers = {
            "Authorization": f"Bearer {self.get_bearer_token()}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "x-twitter-client-language": "en",
            "x-twitter-active-user": "yes",
            "x-csrf-token": await self.get_csrf_token()
        }
        
        kwargs["headers"] = headers
        response = await self.client.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

    def get_bearer_token(self) -> str:
        """Get the Twitter API bearer token."""
        return "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"

    async def get_csrf_token(self) -> str:
        """Get the CSRF token from cookies."""
        csrf_cookie = self.cookies.get("ct0")
        return csrf_cookie.value if csrf_cookie else ""

    async def is_logged_in(self) -> bool:
        """Check if the user is logged in."""
        try:
            response = await self.make_request(
                "GET",
                "https://api.twitter.com/1.1/account/verify_credentials.json"
            )
            return True
        except:
            return False

    def get_cookies(self) -> SimpleCookie:
        """Get all cookies."""
        return self.cookies

    def set_cookies(self, cookies: SimpleCookie) -> None:
        """Set cookies for the session."""
        self.cookies = cookies

    def clear_cookies(self) -> None:
        """Clear all cookies."""
        self.cookies = SimpleCookie()

# Usage example
async def main():
    twitter = TwitterLogin()
    
    try:
        await twitter.login(
            username="username",
            password="password",
            email="email@example.com",  # optional
            two_factor_secret="TOTP_SECRET"  # optional
        )
        
        print("Login successful!")
        
        # Get cookies for later use
        cookies = twitter.get_cookies()
        print("Cookies:", cookies)
        
    except Exception as error:
        print("Login failed:", error)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main()) 