'''
We have two main ways to interact with Twitter:

    Polling Mentions (Simpler):
    Periodically check the bot’s mentions and respond to any new ones.

    Streaming (More Real-Time):
    Use Twitter’s streaming API (v2) to listen for tweets mentioning the bot in real-time.
'''

import os
import time
import tweepy
from dotenv import load_dotenv

load_dotenv()

class TwitterConnector:
    def __init__(self, agent_manager, agent_name: str, poll_interval = 30):
        '''
        Initialize the Twitter connector.

        Args:
            agent_manager: The agent manager instance
            agent_name (str): Name of the agent to handle responses
            poll_interval (int): Time in seconds between checking for new mentions (default: 30)
        '''
        self.agent_manager = agent_manager
        self.agent_name = agent_name
        self.poll_interval = poll_interval

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

    def fetch_mentions(self):
        try:
            # Use v2 API to fetch mentions
            mentions = self.client.get_users_mentions(
                id=self.bot_id,
                since_id=self.last_mention_id,
                tweet_fields=['author_id', 'text', 'referenced_tweets'],
                expansions=['author_id']
            )
            if mentions.data:
                return mentions.data
            return []
        except Exception as e:
            print(f"Error fetching mentions: {str(e)}")
            print(f"Error details: {type(e).__name__}")
            return []

    def respond_to_mentions(self, mention):
        try:
            user_msg = mention.text
            author_id = mention.author_id

            # Get username from author_id
            author = self.client.get_user(id=author_id)
            user_name = author.data.username

            # Remove the mention text
            usr_msg = user_msg.replace(f"@{self.bot_username}", "").strip()

            # Get response from agent
            response = self.agent_manager.send_message(self.agent_name, usr_msg)
            reply_text = f"@{user_name} {response}"

            # Create reply tweet
            self.client.create_tweet(
                text=reply_text,
                in_reply_to_tweet_id=mention.id
            )

            print(f"Replied to @{user_name}: {reply_text}")
        except Exception as e:
            print(f"Error responding to mention: {str(e)}")
            print(f"Mention data: {mention}")

    def create_tweet(self, topic: str) -> str:
        try:
            # Generate response from agent
            response = self.agent_manager.send_message(self.agent_name, f"Craft a tweet about: {topic}")
            return response
        except Exception as e:
            print(f"Error creating tweet: {str(e)}")
            return None

    def post_tweet(self, message: str):
        try:
            if not message:
                print("Error: Tweet message is empty")
                return
            
            # Truncate if too long
            if len(message) > 280:
                message = message[:277] + "..."
            
            self.client.create_tweet(text=message)
            print(f"Tweeted: {message}")
        except Exception as e:
            print(f"Error posting tweet: {str(e)}")

    def start(self):
        print("Starting Twitter Bot polling...")
        while True:
            try:
                # handle mentions
                '''
                mentions = self.fetch_mentions()
                for mention in mentions:
                    self.respond_to_mentions(mention)
                    self.last_mention_id = mention.id
                '''

                # handle tweets
                topic = self.agent_manager.agents[self.agent_name].example_prompt
                
                tweet_text = self.create_tweet(topic)
                if tweet_text:
                    self.post_tweet(tweet_text)

                time.sleep(self.poll_interval)
            except Exception as e:
                print(f"Error in polling loop: {str(e)}")
                time.sleep(self.poll_interval)  # Keep trying even if there's an error