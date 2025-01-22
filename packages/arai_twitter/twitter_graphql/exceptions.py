"""
Custom exception classes for the Twitter API client.
"""

import requests

class APIError(Exception):
    """Base class for all API errors."""

    def __init__(self, response: requests.Response, message: str = ""):
        self.response = response
        self.status_code = response.status_code
        self.message = message
        try:
            self.data = response.json()
        except ValueError:
            self.data = response.text
        super().__init__(self.message)

class RateLimitedError(APIError):
    """Raised when the API rate limit is exceeded."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Rate limit exceeded")

class NotFoundError(APIError):
    """Raised when a resource is not found (404 error)."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Resource not found")

class UnauthorizedError(APIError):
    """Raised when the request is unauthorized (403 error)."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Unauthorized access")

class AuthenticationError(APIError):
    """Raised when authentication fails (401 error)."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Authentication failed")

class BadRequestError(APIError):
    """Raised when the request is malformed (400 error)."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Bad request")

class ResponseParseError(APIError):
    """Raised when the API response cannot be parsed as JSON."""

    def __init__(self, response: requests.Response):
        super().__init__(response, "Failed to parse JSON response")