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