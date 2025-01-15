#
# Module: main
#
# This module implements the main function for the ARAI Agents application.
#
# Title: ARAI Agents
# Summary: ARAI Agents implementation.
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
import schedule
import shutil
import time
import threading
import argparse

# custom ARAI imports
from models.gemini_model import GeminiModel
import utils.post_manager_json as twitter_manager
import prompt_chaining.step_1_json as step_1
import prompt_chaining.step_2_json as step_2
import prompt_chaining.step_3_json as step_3

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
                seasons.append(season)
    
    return seasons

def list_available_agents():
    """List all available agent configs in the configs folder

    Returns:
        list: List of available agent names
    """
    agents = []
    configs_dir = "configs"
    if os.path.exists(configs_dir):
        for item in os.listdir(configs_dir):
            if os.path.isdir(os.path.join(configs_dir, item)):
                agents.append(item)
    return agents

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

# run the scheduler
def run_scheduler():
    """ Continuously run the scheduler in a loop 
    
    Global:
        scheduler_running (bool): Whether the scheduler is running
    """
    global scheduler_running
    scheduler_running = True
    while scheduler_running:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    """ Main entry point for the ARAI Agents application 

    Global:
        scheduler_running (bool): Whether the scheduler is running
        scheduler_thread (threading.Thread): The thread running the scheduler
        post_manager (PostManager): The post manager for the current agent
        current_agent (str): The name of the current agent
        post_every_x_minutes (int): The frequency of posts in minutes
        ai_model (GeminiModel): The AI model to use for generating posts
        twitter_live (bool): Whether to post to twitter live
        agent_file_path (str): The path to the agent file
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--run-time', type=int, default=0, 
                       help='How many minutes to run (0 for indefinite)')
    args = parser.parse_args()

    # Initialize variables
    scheduler_running = False
    scheduler_thread = None
    post_manager = None
    current_agent = None
    agent_file_path = None
    post_every_x_minutes = None

    # change this to true if you want to post to twitter live
    # remember you need a twitter api
    # authenticate the twitter account
    # and add the necessary keys to the .env at the root of the project
    twitter_live = False

    # Instantiate your AI model
    ai_model = GeminiModel()

    while True:
        print("\n=== Main Menu ===")
        print("Welcome to ARAI Agents.")
        print("Please select an option:\n")

        print("Current Agent: ", current_agent)

        print("\n= Agent Management =")
        print("1. Select an existing Agent")
        print("2. Create a new Agent")                 

        print("\n= Media Management =")
        print("3. Create a new Season")
        print("4. Create Season posts")
        
        print("\n= Scheduler Management =")
        print("5. Start Scheduler")
        print("6. Check posting status")
        print("7. Force post now")
        print("8. Pause/Resume posting")
        
        print("\n= Miscellaneous =")
        print("9. Exit")

        choice = input("\nEnter your choice (1-9): ")
        
        if choice == '1':
            agents = list_available_agents()
            if not agents:
                print("No agents found in configs directory!")
                continue
                
            print("\nAvailable Agents:")
            for idx, agent in enumerate(agents, 1):
                print(f"{idx}. {agent}")
            
            try:
                agent_idx = int(input("\nSelect agent number: ")) - 1
                if 0 <= agent_idx < len(agents):
                    current_agent = agents[agent_idx]
                    tracker_config = load_agent_tracker_config(current_agent)
                    agent_file_path = os.path.join("configs", current_agent, f"{current_agent}_master.json")
                    post_every_x_minutes = tracker_config['post_every_x_minutes']
                    post_manager = twitter_manager.PostManager(current_agent)
                    print(f"\nSelected agent: {current_agent}")
                else:
                    print("Invalid selection!")
            except ValueError:
                print("Please enter a valid number!")

        elif choice == '2':
            print("Creating a new agent...")

            try:                
                agent_concept = input("\nProvide a concept for the new agent: ")                
                
                # Create the new agent using the prompt chaining
                print("Creating the new agent...")
                agent_file_path = step_1.step_1(ai_model, agent_concept)
                print("New agent created at: ", agent_file_path)                
                new_agent_dir = os.path.dirname(agent_file_path)
                print("All agent files will go into: ", new_agent_dir)             
                print("Creating the new season...")
                step_2.step_2(ai_model, agent_file_path, 3)
                print("Creating the new season posts...")
                step_3.step_3(ai_model, agent_file_path, 6)                
                print(f"\nCreated new agent: {agent_file_path}")

            except Exception as e:
                print(f"Error creating agent: {str(e)}")

        elif choice == '3':
            if not current_agent:
                print("Please select an agent first!")
                continue
            else:
                try:
                    print("Creating a new season...")
                    step_2.step_2(ai_model, agent_file_path, 3)
                except Exception as e:
                    print(f"Error creating season: {str(e)}")

        elif choice == '4':
            if not current_agent:
                print("Please select an agent first!")
                continue
            else:
                seasons = list_available_seasons(current_agent)
                if not seasons:
                    print("No seasons found for this agent!")
                    continue
                                    
                try:
                    print("Creating a new season posts...")
                    step_3.step_3(ai_model, agent_file_path, 6)
                except Exception as e:
                    print(f"Error creating season posts: {str(e)}")

        elif choice == '5':
            if not current_agent:
                print("Please select an agent first!")
                continue
                
            if scheduler_thread and scheduler_thread.is_alive():
                print("Scheduler is already running!")
                continue
            
            try:
                # Clear existing schedule
                schedule.clear()
                # Set up new schedule
                if post_manager is None:
                    print("Error: Post manager not initialized!")
                    continue
                    
                if post_every_x_minutes is None:
                    print("Error: Posting interval not set!")
                    continue
                    
                schedule.every(post_every_x_minutes).minutes.do(post_manager.post_to_twitter, twitter_live)
                # schedule.every(5).seconds.do(post_manager.post_to_twitter, twitter_live)
                scheduler_running = True
                scheduler_thread = threading.Thread(target=run_scheduler)
                scheduler_thread.daemon = True  # Make thread daemon so it exits when main program exits
                scheduler_thread.start()
                print(f"Scheduler started for {current_agent}")
                print(f"Will post every {post_every_x_minutes} minutes")
            except Exception as e:
                print(f"Error starting scheduler: {str(e)}")

        elif choice == '6':
            if not current_agent:
                print("No agent selected!")
            else:
                print(f"Current agent: {current_agent}")
                print(f"Posting schedule: Every {post_every_x_minutes} minutes")
                print(f"Scheduler is {'running' if scheduler_running else 'paused'}")

        elif choice == '7':
            if not post_manager:
                print("Please select an agent first!")
            else:
                print("Forcing a post now...")
                post_manager.post_to_twitter()

        elif choice == '8':
            if not scheduler_thread:
                print("Scheduler hasn't been started yet!")
            else:
                scheduler_running = not scheduler_running
                print(f"Posting has been {'paused' if not scheduler_running else 'resumed'}")

        elif choice == '9':
            print("Shutting down...")
            scheduler_running = False
            if scheduler_thread:
                scheduler_thread.join()
            break

        else:
            print("Invalid choice. Please try again.")
        
        time.sleep(1)
