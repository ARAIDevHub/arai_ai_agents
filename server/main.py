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

# custom ARAI imports
from models.gemini_model import GeminiModel
from models.openai_model import OpenAIModel
from models.claude_model import ClaudeModel
from models.deepseek_model import DeepSeekModel
from utils.scheduler import AgentScheduler
from handlers import menu_handlers
from utils.post_manager import PostManager

def main():
    """Main function for the ARAI Agents application"""
    # Initialize the AI model and scheduler
    # ai_model = GeminiModel()
    # ai_model = OpenAIModel()
    ai_model = ClaudeModel()
    # ai_model = DeepSeekModel()

    scheduler = AgentScheduler()
    post_manager = None
    
    # Initialize variables
    current_agent = None
    agent_file_path = None
    
    while True:
        print("\nARAI Agents Menu:")
        print("\n= Agent Management =")
        print("1. Create New Agent")
        print("2. Select Agent")
        print("3. Social Feed")
        
        print("\n= Content Creation =")
        print("4. Create Content")
        print("5. Create Posts")
        print("6. Create Profile Images")
        
        print("\n= Scheduler =")
        print("7. Manage Scheduler")
        
        print("\n= Chat =")
        print("8. Chat with Agent")
        
        print("\n= Exit =")
        print("9. Exit")
        
        choice = input("\nEnter your choice (1-9): ")
        
        if choice == "1":
            agent_file_path = menu_handlers.handle_create_agent(ai_model)
        elif choice == "2":
            current_agent, agent_file_path = menu_handlers.handle_select_agent()
            post_manager = PostManager(current_agent)
        elif choice == "3":
            # update this to social media feed - prints off all the posts for the season
            menu_handlers.handle_select_season(current_agent)
        elif choice == "4":
            menu_handlers.handle_create_content(ai_model, current_agent, agent_file_path)
        elif choice == "5":
            menu_handlers.handle_create_posts(ai_model, current_agent, agent_file_path)
        elif choice == "6":
            menu_handlers.handle_create_profile_images(ai_model, current_agent, agent_file_path)
        elif choice == "7":
            menu_handlers.handle_manage_scheduler(scheduler, current_agent, post_manager)
        elif choice == "8":
            menu_handlers.handle_chat_with_agent(ai_model, current_agent, agent_file_path)
        elif choice == "9":
            if scheduler.is_running():
                scheduler.stop()
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
