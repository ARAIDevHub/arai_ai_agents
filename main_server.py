from models.gemini_model import GeminiModel
import step_1 as next_step
import yaml
import schedule
import time
import threading
import argparse
import post_manager as twitter_manager
from term_image.image import ImageSource
import os
import ascii_magic

def list_available_agents():
    """List all available agent configs in the configs folder"""
    agents = []
    configs_dir = "configs"
    if os.path.exists(configs_dir):
        for item in os.listdir(configs_dir):
            if os.path.isdir(os.path.join(configs_dir, item)):
                agents.append(item)
    return agents

def load_agent_config(agent_name):
    """Load configuration for the selected agent"""
    config_path = os.path.join("configs", agent_name, "tracker.yaml")
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

# run the scheduler
def run_scheduler():
    """ Continuously run the scheduler in a loop """
    global scheduler_running
    scheduler_running = True
    while scheduler_running:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--run-time', type=int, default=0, 
                       help='How many minutes to run (0 for indefinite)')
    args = parser.parse_args()

    # Initialize variables
    scheduler_running = False
    scheduler_thread = None
    post_manager = None
    current_agent = None
    post_every_x_minutes = None

    # Instantiate your AI model
    ai_model = GeminiModel()

    while True:
        print("\n=== Main Menu ===")
        print("1. Select Agent")
        print("2. Start Scheduler")
        print("3. Check posting status")
        print("4. Force post now")
        print("5. Pause/Resume posting")
        print("6. Show last image")
        print("7. Exit")
        
        choice = input("\nEnter your choice (1-7): ")
        
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
                    config = load_agent_config(current_agent)
                    post_every_x_minutes = config['post_every_x_minutes']
                    post_manager = twitter_manager.PostManager(current_agent)
                    print(f"\nSelected agent: {current_agent}")
                else:
                    print("Invalid selection!")
            except ValueError:
                print("Please enter a valid number!")

        elif choice == '2':
            if not current_agent:
                print("Please select an agent first!")
                continue
                
            if scheduler_thread and scheduler_thread.is_alive():
                print("Scheduler is already running!")
                continue
                
            # Clear existing schedule
            schedule.clear()
            # Set up new schedule
            schedule.every(post_every_x_minutes).minutes.do(post_manager.post_to_twitter)
            scheduler_running = True
            scheduler_thread = threading.Thread(target=run_scheduler)
            scheduler_thread.start()
            print(f"Scheduler started for {current_agent}")

        elif choice == '3':
            if not current_agent:
                print("No agent selected!")
            else:
                print(f"Current agent: {current_agent}")
                print(f"Posting schedule: Every {post_every_x_minutes} minutes")
                print(f"Scheduler is {'running' if scheduler_running else 'paused'}")

        elif choice == '4':
            if not post_manager:
                print("Please select an agent first!")
            else:
                print("Forcing a post now...")
                post_manager.post_to_twitter()

        elif choice == '5':
            if not scheduler_thread:
                print("Scheduler hasn't been started yet!")
            else:
                scheduler_running = not scheduler_running
                print(f"Posting has been {'paused' if not scheduler_running else 'resumed'}")

        elif choice == '6':
            if not current_agent:
                print("Please select an agent first!")
            else:
                image_path = os.path.join("logo", "ava_boot.png")
                try:
                    if os.path.exists(image_path):
                        output = ascii_magic.from_image(image_path)
                        ascii_magic.to_terminal(output)
                    else:
                        print(f"Image not found at: {image_path}")
                except Exception as e:
                    print(f"Error displaying image: {e}")
                    print(f"Attempted to load: {image_path}")

        elif choice == '7':
            print("Shutting down...")
            scheduler_running = False
            if scheduler_thread:
                scheduler_thread.join()
            break

        else:
            print("Invalid choice. Please try again.")
        
        time.sleep(1)
