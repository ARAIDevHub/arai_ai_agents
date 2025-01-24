# standard imports
import os
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import utils.content_generator as content_generator
from utils.template_types import TemplateType

def list_available_seasons(agent_name):
    """List all available seasons for an agent
    
    Args:
        agent_name (str): The name of the agent to list seasons for

    Returns:
        list: List of available season names
    """
    seasons = []
    config_path = os.path.join("configs", agent_name, f"{agent_name}_master.json")
    
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            master_data = json.load(f)
            for season in master_data["agent"]["seasons"]:
                seasons.append(season["season_name"])
    return seasons

def load_season_data(agent_name, season_index):
    """Load detailed information about a season and its episodes
    
    Args:
        agent_name (str): The name of the agent
        season_index (int or str): The index of the season to display
    """
    config_path = os.path.join("configs", agent_name, f"{agent_name}_master.json")
    with open(config_path, 'r', encoding='utf-8') as f:
        # Convert season_index to int if it's a string
        if isinstance(season_index, str):
            season_index = int(season_index)
        return json.load(f)["agent"]["seasons"][season_index]

def display_season_details(agent_name, season_index):
    """Display detailed information about a season and its episodes
    
    Args:
        agent_name (str): The name of the agent
        season_name (str): The name of the season to display
    """
    season_data = load_season_data(agent_name, season_index)
    
    print("\n" + "="*50)
    print("Season Name:")
    print(season_data.get('season_name', 'No season name available'))
    print(f"Season Number:")    
    print(f"{season_data.get('season_number', 'No season number available')}")
    print(f"Season Posted:")
    print(f"{season_data.get('season_posted', 'No season posted available')}")
    print("\nSeason Description:")
    print(season_data.get('season_description', 'No description available'))
    print("\nSeason Highlights:")
    for highlight in season_data.get('season_highlights', []):
        print(f"- {highlight}")
    print("\nSeason Summary:")
    print(season_data.get('season_summary', 'No summary available'))
    
    print("="*50)    
    print("\nEpisodes:")
    
    for episode in season_data.get('episodes', []):
        print("="*50)
        print(f"\nEpisode: {episode['episode_name']}")
        print(f"Episode Number: {episode['episode_number']}")
        print(f"Episode Posted: {episode.get('episode_posted', 'No episode posted available')}")
        print("-"*30)
        print("Description:")
        print(episode.get('episode_description', 'No description available'))
        print("\nHighlights:")
        for highlight in episode.get('episode_highlights', []):
            print(f"- {highlight}")
        print("\nEpisode Summary:")
        print(episode.get('episode_summary', 'No summary available'))

        print("\nPosts:")
        for post in episode.get('posts', []):
            print("-"*20)
            print(f"Post Number: {post.get('post_number', 'No post number available')}")
            print(f"Post Posted: {post.get('post_posted', 'No post posted available')}")
            print(f"Content: {post.get('post_content', 'No content available')}")
            print(f"Highlights: {post.get('post_highlights', 'No highlights available')}")
        print("-"*30)

def list_available_agents():
    """List all available agent configs in the configs folder
    
    Returns:
        list: List of available agent names
    """
    agents = []
    if os.path.exists("configs"):
        for agent_dir in os.listdir("configs"):
            if os.path.isdir(os.path.join("configs", agent_dir)):
                agents.append(agent_dir)
    return agents

def load_agent_master_template(agent_file_path):
    """Load the master template for an agent
    
    Args:
        agent_name (str): The name of the agent to load the master template for

    Returns:
        dict: The master template for the agent
    """
    with open(agent_file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_agent_master_template(agent_master_template, agent_file_path):
    """Save the master template for an agent
    
    Args:
        agent_master_template (dict): The master template for the agent
        agent_file_path (str): The path to the agent's master file
    """
    with open(agent_file_path, 'w', encoding='utf-8') as f:
        json.dump(agent_master_template, f, indent=4)

def load_agent_tracker_config(agent_name):
    """Load configuration for the selected agent
    
    Args:
        agent_name (str): The name of the agent to load configuration for

    Returns:
        dict: The configuration for the selected agent
    """
    config_path = os.path.join("configs", agent_name, f"{agent_name}_master.json")
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)["agent"]["tracker"]

def get_agent_file_path(agent_name):
    """Get the path to an agent's master file
    
    Args:
        agent_name (str): Name of the agent

    Returns:
        str: Path to the agent's master file
    """
    return os.path.join("configs", agent_name, f"{agent_name}_master.json")

def load_chat_history(agent_name):
    """Load chat history for an agent
    
    Args:
        agent_name (str): Name of the agent

    Returns:
        dict: Chat history for the agent
    """

    if not check_if_chat_history_exists(agent_name):
        create_new_chat_history_file(agent_name)
    
    chat_history_path = os.path.join("configs", agent_name, f"{agent_name}_chat_log.json")
    with open(chat_history_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_new_chat_history_file(agent_name):
    """Create a new chat history file for an agent
    
    Args:
        agent_name (str): Name of the agent
    """
    manager = content_generator.ContentGenerator()
    
    chat_history = manager.create_new_template_json(TemplateType.CHAT)

    chat_history["agent_name"] = agent_name

    agent_chat_file_path = manager.create_filepath(
        agent_name=agent_name, 
        season_number=0,
        episode_number=0,
        template_type=TemplateType.CHAT
    )

    manager.save_json_file(
        save_path=agent_chat_file_path,
        json_data=chat_history
    )

def get_chat_history_file_path(agent_name):
    """Get the path to an agent's chat history file
    
    Args:
        agent_name (str): Name of the agent

    Returns:
        str: Path to the agent's chat history file
    """
    return os.path.join("configs", agent_name, f"{agent_name}_chat_log.json")

def check_if_chat_history_exists(agent_name):
    """Check if chat history exists for an agent
    
    Args:
        agent_name (str): Name of the agent

    Returns:
        bool: True if chat history exists, False otherwise
    """
    return os.path.exists(os.path.join("configs", agent_name, f"{agent_name}_chat_log.json"))