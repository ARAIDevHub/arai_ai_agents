#
# Module: twitter_app_auth
#
# This module implements the TwitterAppAuth class for authenticating with the Twitter API using OAuth 1.0a.
#
# Title: Twitter App Auth
# Summary: Twitter app authentication implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino
import os
from dotenv import load_dotenv
import tweepy
import webbrowser
import yaml

load_dotenv()

class TwitterAppAuth:
    """
    A class for authenticating with the Twitter API using OAuth 1.0a.

    Attributes:
        api_key (str): The API key for the Twitter API.
        api_secret_key (str): The API secret key for the Twitter API.
        bearer_token (str): The bearer token for the Twitter API.
    """
    def __init__(self):
        """Initializes the TwitterAppAuth class.

        Example:
            >>> twitter_auth = TwitterAppAuth()
        """
        self.api_key = os.getenv("TWITTER_API_KEY") 
        self.api_secret_key = os.getenv("TWITTER_API_KEY_SECRET") 
        self.bearer_token = os.getenv("TWITTER_BEARER_TOKEN") 

    def setup_twitter_auth(self):
        """Sets up the Twitter authentication.

        Raises:
            ValueError: If Twitter API credentials are not present in the environment variables.

        Example:
            >>> twitter_auth.setup_twitter_auth()
        """
        try:
            # Initialize OAuth 1.0a handler
            self.auth = tweepy.OAuth1UserHandler(
                consumer_key=self.api_key,
                consumer_secret=self.api_secret_key,
                callback="oob"  # Use out-of-band OAuth
            )

            # Get the authorization URL
            try:
                auth_url = self.auth.get_authorization_url()
                print("\n1. Visit this URL to authorize your app:")
                print(auth_url)

                # Open the URL in default browser
                webbrowser.open(auth_url)
                
                # Get the verifier code from user
                print("\n2. Enter the PIN shown on the website:")
                verifier = input("> ").strip()
                
                # Get the access tokens
                try:
                    access_token, access_token_secret = self.auth.get_access_token(verifier)
                    
                    print("\nSuccess! Add these tokens to your .env file:")
                    print(f"\nTWITTER_ACCESS_TOKEN={access_token}")
                    print(f"TWITTER_ACCESS_TOKEN_SECRET={access_token_secret}")
                    
                    # Test the credentials
                    self.client = tweepy.Client(
                        bearer_token=self.bearer_token,
                        consumer_key=self.api_key,
                        consumer_secret=self.api_secret_key,
                        access_token=access_token,
                        access_token_secret=access_token_secret
                    )
                    
                    me = self.client.get_me()
                    print(f"\nSuccessfully authenticated as @{me.data.username}")

                    self.save_credentials(access_token, access_token_secret)
                    
                except Exception as e:
                    print(f"\nError getting access tokens: {str(e)}")
                    
            except Exception as e:
                print(f"\nError getting authorization URL: {str(e)}")
                print("\nMake sure your app has OAuth 1.0a enabled in the Twitter Developer Portal:")
                print("1. Go to https://developer.twitter.com/en/portal/projects")
                print("2. Select your project and app")
                print("3. Go to 'User authentication settings'")
                print("4. Enable 'OAuth 1.0a'")
                print("5. Set App permissions to 'Read and Write'")
                print("6. Add 'http://127.0.0.1' to callback URLs")
            
        except Exception as e:
            print(f"\nSetup error: {str(e)}")
            print("\nCheck that your API credentials are correct in .env file:")
            print("TWITTER_API_KEY")
            print("TWITTER_API_KEY_SECRET")


    def save_credentials(self, access_token, access_token_secret):
        """Saves the Twitter access tokens to a YAML file.

        Args:
            access_token (str): The access token for the Twitter API.
            access_token_secret (str): The access token secret for the Twitter API.

        Example:
            >>> twitter_auth.save_credentials(access_token, access_token_secret)
        """
        try:                  
            tokens = {
                'TWITTER_ACCESS_TOKEN': access_token,
                'TWITTER_ACCESS_TOKEN_SECRET': access_token_secret
            }
            
            with open('twitter_tokens.yaml', 'w') as f:
                yaml.dump(tokens, f)
            
            print("\nSuccess! Tokens have been saved to twitter_tokens.yaml")
            
        except Exception as e:
            print(f"\nError saving tokens: {str(e)}")


if __name__ == "__main__":
    """Main function to run the TwitterAppAuth class.

    Example:
        >>> python twitter_app_auth.py
    """
    auth = TwitterAppAuth()
    auth.setup_twitter_auth()
