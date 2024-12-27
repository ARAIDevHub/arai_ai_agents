import yaml
import os

def reset_episode_post_number():
    # Get all files from the season 1 folder
    folder_path = 'configs/ZorpTheAlien/season_1'
    episode_files = [f for f in os.listdir(folder_path) if f.startswith('s1_episode_')]
    
    # Sort the files to ensure they're in order
    episode_files.sort()
    
    # loop through each episode file
    for episode_file in episode_files:
        with open(os.path.join(folder_path, episode_file), 'r', encoding='utf-8') as file:
            # load episode
            episode = yaml.safe_load(file)          

            # reset current post number
            episode['episode']['current_post_number'] = 1

            # save results
            with open(os.path.join(folder_path, episode_file), 'w', encoding='utf-8') as file:
                yaml.dump(episode, file)

def delete_current_post_number():
    # Get all files from the season 1 folder
    folder_path = 'configs/ZorpTheAlien/season_1'
    episode_files = [f for f in os.listdir(folder_path) if f.startswith('s1_episode_')]
    
    # Sort the files to ensure they're in order
    episode_files.sort()
    
    # loop through each episode file
    for episode_file in episode_files:
        with open(os.path.join(folder_path, episode_file), 'r', encoding='utf-8') as file:
            # load episode
            episode = yaml.safe_load(file)          

            # delete current post number
            del episode['current_post_number']

            # save results
            with open(os.path.join(folder_path, episode_file), 'w', encoding='utf-8') as file:
                yaml.dump(episode, file)

if __name__ == "__main__":
    # delete_current_post_number()
    reset_episode_post_number()
