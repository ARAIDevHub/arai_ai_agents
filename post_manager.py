import yaml
import connectors.twitter_connector as twitter

class PostManager:
    def __init__(self):
        '''
        Description: Initialize the post manager

        Args:
            None

        Returns:
            None

        Example:
            post_manager = PostManager()
        '''

        # step 1: get the twitter connector
        self.twitter_connector = twitter.TwitterConnector()

        # step 2: get the folders
        self.agent_folder = 'configs/ZorpTheAlien'
        self.season_folder = 'configs/ZorpTheAlien/season_1'
        self.episode_folder = 'configs/ZorpTheAlien/season_1/s1_episode_1'

        # step 4: get the season file
        self.agent_file = 'configs/ZorpTheAlien/agent.yaml'
        self.tracker_file = 'configs/ZorpTheAlien/tracker.yaml'
        self.season_file = 'configs/ZorpTheAlien/season_1/season_1.yaml'
        self.episode_file = 'configs/ZorpTheAlien/season_1/s1_episode_1/s1_episode_1.yaml'

        # Load the YAML file into a dictionary
        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)

        # step 5: setup counters
        # remember that code uses indexes starting at 0
        # even if we have the number for the season, episode, and post starting at 1
        self.season_number = self.tracker_file.get('season_number', 0)
        self.episode_number = self.tracker_file.get('episode_number', 0)
        self.post_number = self.tracker_file.get('post_number', 0)
        self.post_every_x_minutes = self.tracker_file.get('post_every_x_minutes', 60)

    def change_season(self, season_number: int):
        '''
        Description: Change the season

        Args:
            season_number (int): The season number

        Returns:
            None

        Example:
            post_manager.change_season(1)
        '''

        print(f"Changing season to ({season_number} + 1)")
        self.season_file = f'configs/ZorpTheAlien/season_{season_number}/season_{season_number}.yaml'

        with open(self.season_file, 'r', encoding='utf-8') as f:
            self.season_data = yaml.safe_load(f)

        print(f"Changed season to {self.season_file}")

    def change_episode(self, episode_number: int):  
        '''
        Description: Change the episode

        Args:
            episode_number (int): The episode number

        Returns:
            None

        Example:
            post_manager.change_episode(1)
        '''

        if episode_number > 28:
            self.change_season(self.season_number + 1)            
            self.episode_number = 0

        self.episode_file = f'configs/ZorpTheAlien/season_1/s1_episode_{episode_number}.yaml'

        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)
        
        print(f"Changed episode to {self.episode_file}")

    def change_post_number(self, post_number: int):
        '''
        Description: Change the post number

        Args:
            post_number (int): The post number

        Returns:
            post_content (str): The post content

        Example:
            post_content = post_manager.change_post_number(1)
        '''

        if post_number > 12:
            self.change_episode(self.episode_number + 1)
            self.post_number = 0
        
        # The first post (index 0) content
        post_content = self.episode_data['episode']['posts'][post_number]['post_content']
        
        return post_content

    def post_to_twitter(self):
        '''
        Description: Post to twitter

        Args:
            None

        Returns:
            None
        
        Example:
            post_manager.post_to_twitter()
        '''

        tweet_content = self.change_post_number(self.post_number)
        self.twitter_connector.post_tweet(tweet_content)
        print(f"Posted tweet: {tweet_content}")
