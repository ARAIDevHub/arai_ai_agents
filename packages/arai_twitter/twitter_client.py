import os
from dotenv import load_dotenv
from twitter_api_free_connector import (login_and_save_state, post_tweet_with_saved_state)


class TwitterClient:
    def __init__(self):
        print("[TwitterClient] - Initializing TwitterClient...")
        load_dotenv()
        
        # Get credentials from environment variables
        self.username = os.getenv("X_USERNAME")
        self.password = os.getenv("X_PASSWORD")
        self.phone_or_username = os.getenv("X_PHONE_OR_USERNAME")
        
        # Setup state file path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.states_dir = os.path.join(current_dir, 'states')
        
        # Create states directory if it doesn't exist
        os.makedirs(self.states_dir, exist_ok=True)
        
        # Define state file path
        self.state_path = os.path.join(self.states_dir, './states/login_state.json')
        print(f"[TwitterClient] - State path: {self.state_path}")

    def login(self):
        """Perform login and save state"""
        try:
            return login_and_save_state(
                username=self.username,
                password=self.password,
                phone_or_username=self.phone_or_username,
                storage_path=self.state_path
            )
        except Exception as e:
            print(f"[TwitterClient] - Login failed: {e}")
            return False

    def post_tweet(self, tweet_text: str):
        """Post a tweet using saved state"""
        try:
            post_tweet_with_saved_state(
                tweet_text=tweet_text,
                storage_path=self.state_path
            )
            return True
        except Exception as e:
            print(f"[TwitterClient] - Failed to post tweet: {e}")
            return False

    def run(self):
        """Run the Twitter client to login and post a tweet."""
        # Test post
        X_POST_TEXT = "Hello from TwitterClient!"

        # check if state file exists
        if os.path.exists(self.state_path):
            print(f"[INFO] State file exists at {self.state_path}. Using existing state.")
        else:
            print(f"[INFO] State file does not exist at {self.state_path}. Logging in and saving state.")
            self.login()

        self.post_tweet(X_POST_TEXT)


def run_twitter_client():
    client = TwitterClient()
    client.run()


if __name__ == "__main__":
    run_twitter_client()