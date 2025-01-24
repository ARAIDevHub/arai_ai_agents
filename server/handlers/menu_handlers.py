# standard imports
import os
import json

# custom ARAI imports
from utils import config_utils
import prompt_chaining.step_1_create_agent as step_1
import prompt_chaining.step_2_create_content as step_2
import prompt_chaining.step_3_create_posts as step_3
import prompt_chaining.step_4_create_profile_images as step_4
import prompt_chaining.step_5_agent_chat as step_5

def handle_create_agent(ai_model):
    """Handle creating a new agent
    
    Args:
        ai_model: The AI model to use
    """
    agent_concept = input("\nProvide a concept for the new agent: ") 

    print("\nCreating new agent...")
    agent_file_path = step_1.create_agent(ai_model, agent_concept)

    set_tracker_post_every_x_minutes(agent_file_path, 30)

    return agent_file_path

def set_tracker_post_every_x_minutes(agent_file_path, post_every_x_minutes):
    """Set the tracker post every x minutes for an agent
    
    Args:
        agent_file_path (str): Path to the agent's master file
        post_every_x_minutes (int): The number of minutes to post every
    """
    agent_master_template = config_utils.load_agent_master_template(agent_file_path)

    agent_master_template["agent"]["tracker"]["post_every_x_minutes"] = post_every_x_minutes
    
    config_utils.save_agent_master_template(agent_master_template, agent_file_path)

def handle_select_agent():
    """Handle selecting an agent
    
    Returns:
        tuple: (selected agent name, agent file path)
    """
    agents = config_utils.list_available_agents()

    # Filter out the temporary folder
    agents = [agent for agent in agents if agent != "temporary"]

    if not agents:
        print("No agents found. Please create an agent first.")
        return None, None

    print("\nAvailable agents:")
    for i, agent in enumerate(agents, 1):
        print(f"{i}. {agent}")

    while True:
        try:
            choice = int(input("\nSelect an agent (number): "))
            if 1 <= choice <= len(agents):
                selected_agent = agents[choice - 1]
                agent_file_path = config_utils.get_agent_file_path(selected_agent)
                print(f"Selected agent: {selected_agent}")
                return selected_agent, agent_file_path
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

def handle_select_season(current_agent):
    """Handle selecting a season for an agent
    
    Args:
        current_agent (str): The current agent's name
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return

    seasons = config_utils.list_available_seasons(current_agent)
    if not seasons:
        print("No seasons found for this agent.")
        return

    print("\nAvailable seasons:")
    for i, season in enumerate(seasons, 1):
        print(f"{i}. {season}")

    while True:
        try:
            choice = int(input("\nSelect a season (number): "))
            if 1 <= choice <= len(seasons):
                selected_season = seasons[choice - 1]
                print(f"Selected season: {selected_season}")
                config_utils.display_season_details(current_agent, choice-1)               
                break
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")


def handle_create_content(ai_model, current_agent, agent_file_path):
    """Handle creating content for an agent
    
    Args:
        ai_model: The AI model to use
        current_agent (str): The current agent's name
        agent_file_path (str): Path to the agent's master file
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return    

    print(f"\nCreating content for {current_agent}...")
    step_2.create_seasons_and_episodes(ai_model, agent_file_path, 3)

def handle_create_posts(ai_model, current_agent, agent_file_path):
    """Handle creating posts for an agent
    
    Args:
        ai_model: The AI model to use
        current_agent (str): The current agent's name
        agent_file_path (str): Path to the agent's master file
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return

    print(f"\nCreating posts for {current_agent}...")
    step_3.create_episode_posts(ai_model, agent_file_path, 6)

def handle_create_profile_images(ai_model, current_agent, agent_file_path):
    """Handle creating profile images for an agent
    
    Args:
        ai_model: The AI model to use
        current_agent (str): The current agent's name
        agent_file_path (str): Path to the agent's master file
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return

    prompt = input("\nDescribe what you want your agent to look like: ") 

    print(f"\nCreating profile images for {current_agent}...")
    step_4.create_images(ai_model, prompt,agent_file_path, 4)

def handle_chat_with_agent(ai_model, current_agent, agent_file_path):
    """Handle chatting with an agent
    
    Args:
        ai_model: The AI model to use
        current_agent (str): The name of the current agent
        agent_file_path (str): Path to the agent's master file
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return

    print("--------------------------------")    
    print(f"\nStarting chat with {current_agent}...")
    print("--------------------------------")
    print("\n")

    print(f"Current agent: {current_agent}")

    # loop through chat history and print each message
    chat_history = config_utils.load_chat_history(current_agent)

    # print chat history
    if chat_history["chat_history"]:
        for message in chat_history["chat_history"]:
            content = message.get('prompt') if 'prompt' in message else message.get('response')
            print(f"{message['role']}: {content}")            
            print("\n")

    while True:
        prompt = input("\nEnter your message (or 'exit' to end chat): ")
        if prompt.lower() == 'exit':
            break
            
        response, chat_history = step_5.agent_chat(ai_model, agent_file_path, prompt, chat_history)
        if response:
            print(f"\n{current_agent}: {response['response']}")
            

def handle_manage_scheduler(scheduler, current_agent, post_manager):
    """Handle scheduler management options
    
    Args:
        scheduler: The scheduler instance
        current_agent (str): The current agent's name
    """
    if not current_agent:
        print("No agent selected. Please select an agent first.")
        return

    print("\nScheduler Management:")
    print("1. Start scheduler")
    print("2. Stop scheduler")
    print("3. Pause/Resume scheduler")
    print("4. Back to main menu")

    choice = input("\nEnter your choice (1-4): ")

    if choice == "1":
        if not scheduler.is_running():
            scheduler.start()
            scheduler.schedule_posts(
                post_manager=post_manager, 
                tracker_data=config_utils.load_agent_tracker_config(current_agent), 
                )
            print("Scheduler started.")
        else:
            print("Scheduler is already running.")
    elif choice == "2":
        if scheduler.is_running():
            scheduler.stop()
            print("Scheduler stopped.")
        else:
            print("Scheduler is not running.")
    elif choice == "3":
        if scheduler.is_running():
            if scheduler.is_paused():
                scheduler.resume()
                print("Scheduler resumed.")
            else:
                scheduler.pause()
                print("Scheduler paused.")
        else:
            print("Scheduler is not running.")
