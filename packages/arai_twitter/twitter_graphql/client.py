import requests
from .auth import TwitterAuthBase, TwitterGuestAuth, TwitterUserAuth
from .endpoints import endpoints, Endpoint
from . import models
from typing import Optional, List, Dict, Any, Union, Tuple
from .utils import parse_tweet, parse_tweets, parse_user, parse_users, parse_dm_conversations, parse_trends, parse_audio_space, parse_article
import json
from .exceptions import *

class TwitterAPIClient:
    def __init__(self, bearer_token: str, username: Optional[str] = None, password: Optional[str] = None, email: Optional[str] = None, auth_type: str = "guest"):
        if auth_type == "user":
            if not username or not password:
                raise ValueError("Username and password are required for user authentication")
            self.auth = TwitterUserAuth(bearer_token, username, password, email)
        else:
            self.auth = TwitterGuestAuth(bearer_token)
        self.session = requests.Session()

    def _request(self, endpoint_name: str, endpoint_params: Optional[Dict[str, Any]] = None, additional_params: Optional[Dict[str, Any]] = None) -> Any:
        endpoint = endpoints.get(endpoint_name)
        if not endpoint:
            raise ValueError(f"Invalid endpoint name: {endpoint_name}")

        # Create a copy of the endpoint's variables, features, and field_toggles to modify
        variables = endpoint.variables.copy() if endpoint.variables else {}
        features = endpoint.features.copy() if endpoint.features else {}
        field_toggles = endpoint.field_toggles.copy() if endpoint.field_toggles else {}

        if endpoint_params:
            for key, value in endpoint_params.items():
                if key in variables:
                    variables[key] = value
                elif key in features:
                    features[key] = value
                elif key in field_toggles:
                    field_toggles[key] = value
                else:
                    raise ValueError(f"Invalid endpoint parameter: {key}")

        headers = self.auth.get_headers()
        headers["Content-Type"] = "application/json"
        headers["Referer"] = "https://twitter.com/"
        headers["Origin"] = "https://twitter.com"
        headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

        url = endpoint.get_url()

        if additional_params or variables or features or field_toggles:
            params = []
            if variables:
                params.append(f"variables={json.dumps(variables, separators=(',', ':'))}")
            if features:
                params.append(f"features={json.dumps(features, separators=(',', ':'))}")
            if field_toggles:
                params.append(f"fieldToggles={json.dumps(field_toggles, separators=(',', ':'))}")
            if additional_params:
                params.append(f"{additional_params}")
            url = f"{endpoint.url}?{'&'.join(params)}"

        if endpoint.method == "GET":
            response = self.session.get(url, headers=headers, cookies=self.auth.get_cookies())
        elif endpoint.method == "POST":
            response = self.session.post(url, headers=headers, json=variables, cookies=self.auth.get_cookies())
        else:
            raise ValueError(f"Unsupported HTTP method: {endpoint.method}")

        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as e:
            if response.status_code == 429:
                raise RateLimitedError(response=response, message="Rate limit exceeded") from e
            elif response.status_code == 404:
                raise NotFoundError(response=response, message="Resource not found") from e
            elif response.status_code == 403:
                raise UnauthorizedError(response=response, message="Unauthorized access") from e
            elif response.status_code == 401:
                raise AuthenticationError(response=response, message="Authentication failed") from e
            elif response.status_code == 400:
                raise BadRequestError(response=response, message="Bad request") from e
            else:
                raise APIError(response=response, message=f"API request failed with status code {response.status_code}") from e

        try:
            return response.json()
        except json.JSONDecodeError:
            raise ResponseParseError(response=response, message="Failed to parse JSON response")

    def get_user_tweets(self, user_id: str, count: int = 40, cursor: Optional[str] = None) -> Tuple[List[models.Tweet], Optional[str]]:
        variables = {
            "userId": user_id,
            "count": count,
            "includePromotedContent": False,
            "withQuickPromoteEligibilityTweetFields": False,
            "withVoice": True,
            "withV2Timeline": True,
        }
        if cursor:
            variables["cursor"] = cursor

        params = {
            "variables": json.dumps(variables, separators=(',', ':')),
            "features": json.dumps({"withBirdwatchNotes": False}, separators=(',', ':')),
            "fieldToggles": json.dumps({"withBirdwatchNotes": False}, separators=(',', ':')),
            "additional_params": json.dumps({"count": count, "cursor": cursor})
        }

        response = self._request("get_user_tweets", params)
        tweets = [models.Tweet(**tweet) for tweet in response["data"]["user"]["tweets"]["edges"]]
        next_cursor = response["data"]["user"]["tweets"]["pageInfo"]["endCursor"]
        return tweets, next_cursor 