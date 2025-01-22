import json
from typing import Optional
import httpx
from http.cookies import SimpleCookie
import pyotp

class TwitterLogin:
    API_BASE = "https://api.twitter.com/1.1"
    BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"

    def __init__(self):
        self.client = httpx.Client()
        self.cookies = SimpleCookie()

    async def login(
        self,
        username: str,
        password: str,
        two_factor_secret: Optional[str] = None
    ) -> None:
        """Handle Twitter login flow including 2FA if needed."""
        flow_token = await self._execute_flow_step(
            "login",
            {"flow_context": {"start_location": {"location": "splash_screen"}}}
        )

        # Handle JS check and username/password submission
        flow_token = await self._execute_flow_step(
            "LoginJsInstrumentationSubtask",
            {"js_instrumentation": {"response": json.dumps({"rf": {"af": True, "bl": True}, "s": "https://twitter.com"})}}
        )

        flow_token = await self._execute_flow_step(
            "LoginEnterUserIdentifierSSO",
            {"settings_list": {"setting_responses": [{"key": "user_identifier", "response_data": {"text_data": {"result": username}}}]}}
        )

        flow_token = await self._execute_flow_step(
            "LoginEnterPassword",
            {"enter_password": {"password": password, "link": "current_password"}}
        )

        # Handle 2FA if provided
        if two_factor_secret:
            totp = pyotp.TOTP(two_factor_secret)
            await self._execute_flow_step(
                "LoginTwoFactorAuthChallenge",
                {"enter_text": {"text": totp.now(), "link": "login_verification_code"}}
            )

        if not await self.is_logged_in():
            raise Exception("Login failed")

    async def _execute_flow_step(self, subtask_id: str, subtask_data: dict) -> str:
        """Execute a single step in the login flow."""
        url = f"{self.API_BASE}/onboarding/task.json"
        
        payload = {
            "flow_token": getattr(self, '_flow_token', None),
            "subtask_inputs": [{
                "subtask_id": subtask_id,
                **subtask_data
            }]
        }

        response = await self._make_request("POST", url, json=payload)
        self._flow_token = response.get("flow_token")
        return self._flow_token

    async def _make_request(self, method: str, url: str, **kwargs) -> dict:
        """Make an authenticated request to Twitter API."""
        headers = {
            "Authorization": f"Bearer {self.BEARER_TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "x-twitter-client-language": "en",
            "x-twitter-active-user": "yes",
            "x-csrf-token": self._get_csrf_token()
        }
        
        kwargs["headers"] = headers
        response = await self.client.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

    def _get_csrf_token(self) -> str:
        """Get CSRF token from cookies."""
        csrf_cookie = self.cookies.get("ct0")
        return csrf_cookie.value if csrf_cookie else ""

    async def is_logged_in(self) -> bool:
        """Verify login status."""
        try:
            await self._make_request("GET", f"{self.API_BASE}/account/verify_credentials.json")
            return True
        except:
            return False

    def get_cookies(self) -> SimpleCookie:
        """Get current cookies."""
        return self.cookies

    def set_cookies(self, cookies: SimpleCookie) -> None:
        """Set session cookies."""
        self.cookies = cookies

# Usage example
async def main():
    twitter = TwitterLogin()
    try:
        await twitter.login(
            username="your_username",
            password="your_password",
            two_factor_secret="YOUR_2FA_SECRET"  # optional
        )
        print("Login successful!")
        print("Cookies:", twitter.get_cookies())
    except Exception as error:
        print("Login failed:", error)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())