#
# Module: step_1
#
# This module implements the step_1 function for creating a new agent.
#
# Title: Step 1
# Summary: Step 1 implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2025-01-15
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-15
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

# standard imports
import yaml
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import utils.content_generator_json as content_generator
from utils.content_generator_json import TemplateType
# -------------------------------------------------------------------
# Step 5: Chat with the agent
# -------------------------------------------------------------------
def agent_chat(ai_model, master_file_path: str, prompt: str, chat_history):
    # Step 5.1: Create a new content manager that will send off the prompt to the AI model
    manager = content_generator.ContentGenerator()

    # step 5.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # step 5.3: extract agent from master json
    agent_details = agent_master_json['agent']['agent_details']

    # Initialize chat history if None
    if chat_history is None:
        chat_history = manager.create_new_template_json(TemplateType.CHAT)
        
    # step 5.4: Set up chat variables
    agent_response = None

    # prompt 5 Chat with the agent:
    print("Crafting prompt for AI to chat with the agent")
    prompt_5_vars = {
        "agent_name": agent_details["name"],
        "agent_json": json.dumps(agent_details),
        "chat_history": json.dumps(chat_history),
        "user_prompt": prompt,  # Use the prompt parameter instead of user_prompt
        "agent_json": json.dumps(agent_details)
    }

    # get the agent's response
    print("Sending prompt to AI to chat with the agent")
    agent_response = manager.run_prompt(
        prompt_key="prompt_5 (Chat with the agent)",
        template_vars=prompt_5_vars, 
        ai_model=ai_model,
    )
    
    if agent_response:  # Add error checking
        # add the user's prompt to the history log with label
        chat_history['chat_history'].append({
            "role": "user",
            "message": prompt,
            "message_id": len(chat_history['chat_history'])
        })
        
        # add the agent's response to the history log with label
        chat_history['chat_history'].append({
            "role": agent_details["name"],
            "response": agent_response['response'],
            "message_id": len(chat_history['chat_history'])
        })

        # Need to save the chat history to a file
        # Need to check is there is an existing chat history file
        # If there is, append to the file
        # If there is not, create a new file
        # or chat a new file, for users to have new chats
        # later can allow the user to select which chat history to use

        # step 5.5: create the file path for chat file
        print("Creating the file path for the chat file")
        agent_chat_file_path = manager.create_filepath(
            agent_name=agent_details["name"], 
            season_number=0,
            episode_number=0,
            template_type=TemplateType.CHAT
        )

        # step 5.6: Save the chat history to a file
        print("Saving the chat history to a file")
        manager.save_json_file(
            save_path=agent_chat_file_path,
            json_data=chat_history
        )

    return agent_response, chat_history


import models.gemini_model as gemini_model
if __name__ == "__main__":
    ai_model = gemini_model.GeminiModel()
    manager = content_generator.ContentGenerator()
    master_file_path = "configs/LamboLara/LamboLara_master.json"
    chat_history = manager.create_new_template_json(TemplateType.CHAT)

    user_prompt = "What is your name?"
    agent_response, chat_history = agent_chat(ai_model, master_file_path, user_prompt, chat_history)
    print(f"Response: {agent_response['response']}")
    # print(f"Chat history: {chat_history}")
    user_prompt = "What is your favorite color?"
    agent_response, chat_history = agent_chat(ai_model, master_file_path, user_prompt, chat_history)
    print(f"Response: {agent_response['response']}")
    # print(f"Chat history: {chat_history}")
    user_prompt = "What is your favorite food?"
    agent_response, chat_history = agent_chat(ai_model, master_file_path, user_prompt, chat_history)
    print(f"Response: {agent_response['response']}")
    # print(f"Chat history: {chat_history}")
    user_prompt = "What was the first question I asked you?"
    agent_response, chat_history = agent_chat(ai_model, master_file_path, user_prompt, chat_history)
    print(f"Response: {agent_response['response']}")
    # print(f"Chat history: {chat_history}")
