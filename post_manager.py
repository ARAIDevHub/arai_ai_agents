import yaml
import os
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
        self.root_folder = os.path.join(os.path.dirname(__file__), "configs")
        self.agent_folder = os.path.join(self.root_folder, "ZorpTheAlien")
        self.season_folder = os.path.join(self.agent_folder, "season_1")
        self.episode_folder = self.season_folder

        # step 4: get the season file
        self.agent_file = os.path.join(self.agent_folder, "ZorpTheAlien.yaml")
        self.tracker_file = os.path.join(self.agent_folder, "tracker.yaml")

        # load agent yaml file
        with open(self.agent_file, 'r', encoding='utf-8') as f:
            self.agent_data = yaml.safe_load(f)

        # Load the YAML file into a dictionary
        with open(self.tracker_file, 'r', encoding='utf-8') as f:
            self.tracker_data = yaml.safe_load(f)

        self.season_file = os.path.join(self.season_folder, "season_" + str(self.tracker_data['current_season_number']) + ".yaml")
        self.episode_file = os.path.join(self.episode_folder, "s" + str(self.tracker_data['current_season_number']) + "_episode_" + str(self.tracker_data['current_episode_number']) + ".yaml")

        # load season yaml file
        with open(self.season_file, 'r', encoding='utf-8') as f:
            self.season_data = yaml.safe_load(f)

        # load episode yaml file
        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)

        # step 5: setup counters
        # remember that code uses indexes starting at 0
        # even if we have the number for the season, episode, and post starting at 1
        self.season_number = self.tracker_data['current_season_number']
        self.episode_number = self.tracker_data['current_episode_number']
        self.post_number = self.tracker_data['current_post_number']

        print ("post_number: ", self.post_number)
        print ("episode_number: ", self.episode_number)
        print ("season_number: ", self.season_number)


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

        # save the tracker data
        self.tracker_data['current_season_number'] = season_number
        with open(self.tracker_file, 'w', encoding='utf-8') as f:
            yaml.dump(self.tracker_data, f)

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

        if episode_number >= 28-1:
            self.change_season(self.season_number + 1)            
            self.episode_number = 0

        self.episode_file = f'configs/ZorpTheAlien/season_1/s1_episode_{episode_number}.yaml'

        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)
        
        # save the tracker data
        self.tracker_data['current_episode_number'] = episode_number
        with open(self.tracker_file, 'w', encoding='utf-8') as f:
            yaml.dump(self.tracker_data, f)

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

        if post_number >= 12-1:
            self.change_episode(self.episode_number + 1)
            self.post_number = 0
        
        # Get the post content and clean it up
        post_content = self.episode_data['episode']['posts'][post_number]['post_content']
        post_content = ' '.join(post_content.split()).strip()

        # save the tracker data
        self.tracker_data['current_post_number'] = self.post_number
        with open(self.tracker_file, 'w', encoding='utf-8') as f:
            yaml.dump(self.tracker_data, f)

        # increase post number
        self.post_number += 1        

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
        print ("Preparing to post to twitter")

        tweet_content = self.change_post_number(self.post_number)
        print (tweet_content)

        '''
        tweet_result = self.twitter_connector.post_tweet(tweet_content)

        print (tweet_result)        

        # reset the post number if the tweet failed so the post can be attempted again
        if tweet_result.startswith("Error"):
            self.post_number -= 1                
        '''
        
        '''
        zeros can bring down their whole economy. Fascinating. /s #CryptoChaos #EarthIsWeird #ZorpTheAlien

        Error posting tweet: ('Connection aborted.', RemoteDisconnected('Remote end zeros can bring down their whole economy. Fascinating. /s #CryptoChaos #EarthIsWeird #ZorpTheAlien

        Error posting tweet: ('Connection aborted.', RemoteDisconnected('Remote end closed connection without response'))
        Posted tweet: Seven suggests I should "notify" the humans about the glitch. As if I'd waste
        my time saving them from their own incompetence. 🙄 #SarcasmBot #XylosianFiles #ZorpTheAlien

        Tweeted: Tempted to just... let it happen. It's like watching a "train wreck" as the humans say,
        except the train is made of digital currency and the wreck is global economic collapse. #AgentZorp #DroneDiaries #ZorpTheAlien

        Posted tweet: Tempted to just... let it happen. It's like watching a "train wreck" as the humans say,
        except the train is made of digital currency and the wreck is global economic collapse. #AgentZorp #DroneDiaries #ZorpTheAlien
        '''
