#
# Module: post_manager
#
# This module implements the PostManager class for managing the posts for an agent.
#
# Title: Post Manager
# Summary: Post manager implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

# standard imports
import os
import json
import datetime

# custom ARAI code imports
import connectors.twitter_connector as twitter
from packages.twitter_playwright import twitter_api_free_connector as twitter_api_free

class PostManager:
    """Manages posts for an agent using JSON configuration files.

    Attributes:
        agent_name (str): The name of the agent
        master_file (str): Path to the agent's master JSON file
        twitter_connector: Twitter API connector instance
    """
    def __init__(self, agent_name: str):
        """Initialize the post manager

        Args:
            agent_name (str): The name of the agent

        Raises:
            FileNotFoundError: If master JSON file doesn't exist
        """
        self.agent_name = agent_name
        self.master_file = os.path.join("configs", agent_name, f"{agent_name}_master.json")
        self.twitter_connector = twitter.TwitterConnector()

        # Load master configuration
        with open(self.master_file, 'r', encoding='utf-8') as f:
            self.master_data = json.load(f)

        # Get current tracking info
        self.tracker = self.master_data["agent"]["tracker"]
        self.current_season = self.tracker["current_season_number"]
        self.current_episode = self.tracker["current_episode_number"]
        self.current_post = self.tracker["current_post_number"]

    def _save_master_file(self):
        """Save the master JSON file with updated tracking information"""
        # Update master data from local variables
        self.master_data["agent"]["tracker"]["current_season_number"] = self.current_season
        self.master_data["agent"]["tracker"]["current_episode_number"] = self.current_episode
        self.master_data["agent"]["tracker"]["current_post_number"] = self.current_post

        # Save to file
        with open(self.master_file, 'w', encoding='utf-8') as f:
            json.dump(self.master_data, f, indent=2)

    def change_season(self, season_number: int):
        """Change the current season
        
        Args:
            season_number (int): The season number (1-based, will be converted to 0-based for array access)
        """
        # Convert from 1-based season number to 0-based array index
        season_index = season_number
        
        # Check if season exists and is not posted yet
        if 0 <= season_index < len(self.master_data["agent"]["seasons"]):
            print(f"Checking season: {season_index}")
            season = self.master_data["agent"]["seasons"][season_index]
            if not season.get("season_posted", False):
                self.current_season = season_index  # Store as 0-based index
                self.current_episode = 0
                self.current_post = 0
                self._save_master_file()
                print(f"Changed to season {season_number}")  # Display as 1-based number
            else:
                print(f"Season {season_number} has already been posted")
                raise ValueError(f"Season {season_number} has already been posted")
        else:
            print("No more unposted seasons available")
            # Reset to beginning
            self.current_season = 0
            self.current_episode = 0
            self.current_post = 0
            self._save_master_file()
            raise ValueError(f"No more content available to post")

    def change_episode(self, episode_number: int):
        """Change the current episode
        
        Args:
            episode_number (int): The episode number (1-based, will be converted to 0-based for array access)
        """
        # Convert from 1-based episode number to 0-based array index
        episode_index = episode_number
        
        current_season = self.master_data["agent"]["seasons"][self.current_season]
        if episode_index >= len(current_season["episodes"]):
            print(f"Moving to next season: {self.current_season + 1}")
            self.change_season(self.current_season + 1)  # Move to next season
            return

        self.current_episode = episode_index
        self.current_post = 0
        self._save_master_file()
        print(f"Changed to episode {episode_number}")  # Display as 1-based number

    def next_post_number(self, post_number: int) -> str:
        """Get the next post content and update tracking
        
        Args:
            post_number (int): The post number (1-based, will be converted to 0-based for array access)
        """
        # Convert from 1-based post number to 0-based array index
        post_index = post_number
        
        current_season = self.master_data["agent"]["seasons"][self.current_season]
        current_episode = current_season["episodes"][self.current_episode]

        if post_index >= len(current_episode["posts"]):
            print(f"Moving to next episode: {self.current_episode + 1}")
            self.change_episode(self.current_episode + 1)  # Move to next episode
            post_index = 0

        print(f"Getting post: {post_index}")
        post = current_episode["posts"][post_index]
        post_content = post["post_content"]
        
        self.current_post = post_index + 1  # Store as 1-based for consistency with display
        self._save_master_file()
        
        return post_content

    def post_to_twitter(self, live_post: bool = False):
        """Post content to Twitter

        Args:
            live_post (bool): Whether to actually post to Twitter (False for testing)
        """
        tweet_content = self.next_post_number(self.current_post)

        if live_post:

            if (os.getenv("X_API_OFFICIAL") == "True"):
                tweet_result = self.twitter_connector.post_tweet(tweet_content)
            else:
                tweet_result = twitter_api_free.main(tweet_content)

            print(tweet_result)

            if tweet_result.startswith("Error"):
                self.current_post -= 1
                self.tracker["current_post_number"] = self.current_post
                self._save_master_file()
        else:
            print(f"\nWould have posted: \n{tweet_content}")

        # Log the post
        log_file = os.path.join("configs", self.agent_name, f"{self.agent_name}_post_log.json")
        try:
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    log_data = json.load(f)
            except FileNotFoundError:
                log_data = {"posts": []}

            log_data["posts"].append({
                "post_id": f"s_{self.current_season + 1}_e_{self.current_episode + 1}_p_{self.current_post}",
                "content": tweet_content,
                "timestamp": datetime.datetime.now().isoformat()
            })

            with open(log_file, 'w', encoding='utf-8') as f:
                json.dump(log_data, f, indent=2)

        except Exception as e:
            print(f"Error writing to log file: {e}")