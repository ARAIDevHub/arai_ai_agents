# standard imports
import yaml
import os
import datetime

# custom ARIA code imports
import connectors.twitter_connector as twitter

class PostManager:
    def __init__(self, agent_name: str):
        '''
        Description: Initialize the post manager

        Args:
            agent_name (str): The name of the agent

        Returns:
            None

        Example:
            post_manager = PostManager("ZorpTheAlien")
        '''

        # step 1: get the twitter connector
        self.twitter_connector = twitter.TwitterConnector()

        # step 2: get the agent name
        self.agent_name = agent_name

        # step 3: get the folders
        self.root_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), "configs")
        #self.agent_folder = os.path.join(self.root_folder, "ZorpTheAlien")
        self.agent_folder = os.path.join(self.root_folder, self.agent_name)
        self.season_folder = os.path.join(self.agent_folder, "season_1")
        self.episode_folder = self.season_folder

        print (f"Agent folder: {self.agent_folder}")

        # step 4: get the tracker file
        self.tracker_file = os.path.join(self.agent_folder, "tracker.yaml")

        # Load the YAML file into a dictionary
        with open(self.tracker_file, 'r', encoding='utf-8') as f:
            self.tracker_data = yaml.safe_load(f)

        # step 5: get the season file
        self.season_file = os.path.join(self.season_folder, "season_" + str(self.tracker_data['current_season_number']) + ".yaml")

        # step 6: get the episode file
        self.episode_file = os.path.join(self.episode_folder, "s" + str(self.tracker_data['current_season_number']) + "_episode_" + str(self.tracker_data['current_episode_number']) + ".yaml")
        
        # step 7: load season yaml file
        with open(self.season_file, 'r', encoding='utf-8') as f:
            self.season_data = yaml.safe_load(f)

        # step 8: load episode yaml file
        # load episode yaml file
        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)

        # step 9: setup counters
        # remember that code uses indexes starting at 0
        # even if we have the number for the season, episode, and post starting at 1
        self.season_number = self.tracker_data['current_season_number']
        self.episode_number = self.tracker_data['current_episode_number']
        self.post_number = self.tracker_data['current_post_number']

        # step 10: print the counters
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
        self.season_file = f"configs/{self.agent_name}/season_{season_number}/season_{season_number}.yaml"

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
            self.episode_number = 1

        self.episode_file = f"configs/{self.agent_name}/season_1/s1_episode_{episode_number}.yaml"

        with open(self.episode_file, 'r', encoding='utf-8') as f:
            self.episode_data = yaml.safe_load(f)
        
        # save the tracker data
        self.tracker_data['current_episode_number'] = episode_number
        with open(self.tracker_file, 'w', encoding='utf-8') as f:
            yaml.dump(self.tracker_data, f)

        print(f"Changed episode to {self.episode_file}")

    def next_post_number(self, post_number: int):
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
            self.post_number = 1
        
        # Get the post content and clean it up, remember post numbers vs index starting at 0
        post_content = self.episode_data['episode']['posts'][post_number-1]['post_content']
        post_content = ' '.join(post_content.split()).strip()
        # Convert Unicode escape sequences to emojis
        post_content = post_content.encode().decode('unicode-escape')

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
        # print ("Preparing to post to twitter" + "\n")

        tweet_content = self.next_post_number(self.post_number)
        # print (tweet_content)
        # save to log file
        try:
            # First, read existing log if it exists
            log_file = os.path.join(self.agent_folder, f"{self.agent_name}_post_log.yaml")
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    log_data = yaml.safe_load(f) or {'posts': []}
            except FileNotFoundError:
                log_data = {'posts': []}

            # Add new post to the array
            log_data['posts'].append({
                'post_id': f"s_{self.season_number}_e_{self.episode_number}_p_{self.post_number}",
                'content': tweet_content,
                'timestamp': str(datetime.datetime.now())
            })

            # Write back the updated log
            with open(log_file, 'w', encoding='utf-8') as f:
                yaml.dump(log_data, f, allow_unicode=True)

        except Exception as e:
            print(f"Error writing to log file: {e}")

        '''
        tweet_result = self.twitter_connector.post_tweet(tweet_content)

        print (tweet_result)        

        # reset the post number if the tweet failed so the post can be attempted again
        if tweet_result.startswith("Error"):
            self.post_number -= 1                
        '''