import requests
import os
import dotenv

dotenv.load_dotenv()

class TwitterScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.auth_token = None

    def login(self, username, password):
        """
        Basic Twitter login using username and password
        """
        try:
            # Step 1: Get the initial auth token
            auth_url = "https://x.com/i/flow/login"
            response = self.session.get(auth_url)
            
            # Step 2: Submit login credentials
            login_url = "https://api.twitter.com/1.1/account/login_verification.json"
            login_data = {
                "username": username,
                "password": password
            }
            response = self.session.post(login_url, json=login_data)
            
            if response.status_code == 200:
                self.auth_token = response.cookies.get("auth_token")
                print("Login successful!")
                return True
            else:
                print(f"Login failed: {response.status_code}")
                return False

        except Exception as e:
            print(f"Login error: {str(e)}")
            return False

    def get_tweet(self, tweet_id):
        """
        Example method to fetch a tweet using the authenticated session
        """
        if not self.auth_token:
            raise Exception("Not logged in")
            
        tweet_url = f"https://api.twitter.com/2/tweets/{tweet_id}"
        response = self.session.get(tweet_url)
        return response.json()

# Usage example
if __name__ == "__main__":
    scraper = TwitterScraper()
    
    # Login
    username = os.getenv("X_USERNAME")
    password = os.getenv("X_PASSWORD")
    scraper.login(username, password)
    
    # Get a tweet
    # tweet = scraper.get_tweet("1880762913386004619")
    # print(tweet)