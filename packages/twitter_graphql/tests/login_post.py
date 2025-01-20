import os
from dotenv import load_dotenv
from twitter_api.client import TwitterAPIClient

# Load environment variables
load_dotenv()

# Twitter API credentials
bearer_token = os.getenv("TWITTER_BEARER_TOKEN")
username = os.getenv("TWITTER_USERNAME")
password = os.getenv("TWITTER_PASSWORD")
email = os.getenv("TWITTER_EMAIL")  # Optional

# Create API client with user authentication
client = TwitterAPIClient(bearer_token, username, password, email, auth_type="user")

# Example: Post a tweet
try:
    tweet_text = "Hello from my Python Twitter API client!"
    response = client.create_tweet(tweet_text)
    print(f"Tweet created: {response}")
except Exception as e:
    print(f"Error creating tweet: {e}")