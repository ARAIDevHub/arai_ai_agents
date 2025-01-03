"""
Module: twitter_connector
=========================

This module implements the TwitterConnector class for interacting with Twitter APIs.

Title: Twitter Connector
Summary: Twitter connector implementation.
Authors:
    - @TheBlockRhino
Date: 2024-12-31
Last Updated: 2024-12-31
URLs:
    - https://aria-ai.io
    - https://github.com/ARIA-DevHub/aria-ai-agents
    - https://x.com/TheBlockRhino
"""

import os
import time
import tweepy
from dotenv import load_dotenv

load_dotenv()

class TwitterConnector:
    """A connector for interacting with the Twitter API via Tweepy.

    This class handles OAuth 1.0a and OAuth 2.0 authentication for
    posting tweets and retrieving data from Twitter.
    """

    def __init__(self):
        """Initializes the Twitter connector.

        Raises:
            ValueError: If Twitter API credentials are not present in the environment variables.
        """

        self.api_key = os.getenv("TWITTER_API_KEY") 
        # Part of the OAuth 1.0a credentials identifying the application (required for user-based authentication).

        self.api_secret_key = os.getenv("TWITTER_API_KEY_SECRET") 
        # Secret counterpart to the API key, used in signing OAuth 1.0a requests.

        self.access_token = os.getenv("TWITTER_ACCESS_TOKEN") 
        # Represents the user’s OAuth 1.0a credentials, required for user-level actions (e.g., posting tweets).

        self.access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET") 
        # Secret counterpart to the access token, used in signing user-level requests under OAuth 1.0a.

        self.bearer_token = os.getenv("TWITTER_BEARER_TOKEN") 
        # Used for OAuth 2.0 app-only authentication in Twitter API v2, often for read-only access to public data.

        if not all([self.api_key, self.api_secret_key, self.access_token, self.access_token_secret]):
            raise ValueError("Twitter API credentials are not set in .env file")
        
        try:
            # Initialize v2 client only
            self.client = tweepy.Client(
                bearer_token=self.bearer_token,
                consumer_key=self.api_key,
                consumer_secret=self.api_secret_key,
                access_token=self.access_token,
                access_token_secret=self.access_token_secret,
                wait_on_rate_limit=True
            )

            # Get the bot's info using v2 API
            me = self.client.get_me()
            self.bot_username = me.data.username.lower()
            self.bot_id = me.data.id
            print(f"Successfully authenticated as @{self.bot_username}")
            
            self.last_mention_id = None
        except Exception as e:
            print(f"Twitter authentication failed: {str(e)}")
            raise

    def post_tweet(self, message: str) -> str:
        """Posts a tweet to the bot's Twitter account.

        Args:
            message (str): The message to be posted as a tweet. Must be shorter than 280 characters.

        Returns:
            str: A string message indicating success or failure.

        Raises:
            Exception: If there's an error posting the tweet.

        Example:
            >>> twitter_connector.post_tweet("Hello, world!")
        """
        try:
            if not message:                
                return "Error: Tweet message is empty"
            
            # Truncate if too long
            if len(message) > 280:
                message = message[:277] + "..."
            
            self.client.create_tweet(text=message)            
            return "Tweeted: " + message
        except Exception as e:            
            return "Error posting tweet: " + str(e)