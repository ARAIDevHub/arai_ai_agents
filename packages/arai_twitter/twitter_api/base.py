from ..logger import eliza_logger
from ..environment import TwitterConfig
from ..twitter_playwright.twitter_api_free_connector import post_tweet_with_saved_state

class ClientBase:
    """Base Twitter client that handles core functionality"""
    
    def __init__(self, runtime, twitter_config: TwitterConfig):
        self.runtime = runtime
        self.config = twitter_config
        self.state_file_path = None  # Will be set during init
        
    async def init(self):
        """Initialize the client connection"""
        try:
            self.state_file_path = get_state_file_path()
            eliza_logger.info("Twitter client base initialized successfully")
        except Exception as e:
            eliza_logger.error(f"Failed to initialize Twitter client: {e}")
            raise

    async def post_tweet(self, text: str):
        """Post a tweet using the free connector"""
        try:
            post_tweet_with_saved_state(
                tweet_text=text,
                storage_path=self.state_file_path
            )
            eliza_logger.info(f"Successfully posted tweet: {text[:50]}...")
        except Exception as e:
            eliza_logger.error(f"Failed to post tweet: {e}")
            raise 