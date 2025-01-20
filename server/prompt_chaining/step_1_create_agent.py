#
# Module: step_1
#
# This module implements the step_1 function for creating a new agent.
#
# Title: Step 1
# Summary: Step 1 implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2025-01-02
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-09
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

# standard imports
import yaml
import json
import sys
import os
import time
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# custom ARAI imports
from utils.content_generator import ContentGenerator
import prompt_chaining.step_2_create_content as next_step
from utils.template_types import TemplateType

# -------------------------------------------------------------------
# Step 1: Create a new agent
# -------------------------------------------------------------------
def create_agent(ai_model, concept: str):
    '''
    Description:
        Create a new agent

    Args:
        ai_model: The AI model to use for generating responses
        debug (bool, optional): whether to print debug information. Defaults to False.

    Returns:
        agent_file_path: The path to the agent yaml file

    Raises:
        Exception: If there's an error creating the agent

        Example:
        >>> ai_model = GeminiModel()
        >>> step_1(ai_model, "alien drone pilot who is a sarcastic asshole visiting earth to report back his findings to his home planet")
    '''

    # Step 1.1: Create a new agent
    manager = ContentGenerator()
    # agent_template = manager.create_new_template_yaml(TemplateType.AGENT)
    agent_template = manager.create_new_template_json(TemplateType.AGENT)
    agent_master_template = manager.create_new_template_json(TemplateType.MASTER)

    # Gather a list of agent names based on folder names in config folder
    agent_names_blacklist = manager.get_agent_names_blacklist()
    # remove _ from names
    # print(f"agent_names_blacklist: {agent_names_blacklist}")    
    # agent_names_blacklist = [name.replace("_", " ") for name in agent_names_blacklist]
    print(f"agent_names_blacklist: {agent_names_blacklist}")    

    # step 1.2: Generate a new agent name, topic, personality, and communication style with the prompt_1 template
    # prompt 1 Character Creation:
    print("Crafting prompt for AI to create a new agent")
    prompt_1_vars = {
        # "agent_name": "",
        # "personality": "",
        # "communication_style": "",
        # "topic": "",
        "concept": concept,
        "agent_names_blacklist": agent_names_blacklist,
        "agent_json": json.dumps(agent_template)
    }

     # Constants for retry configuration
    max_retries = 3
    delay = 2  # seconds between retries

    # step 3.11: Run the prompt with retry logic for LLM failures
    success = False
    for attempt in range(max_retries):
        try:
            # step 1.3: Run the prompt
            print("Sending prompt to AI to create a new agent")
            agent_data = manager.run_prompt(
                prompt_key="prompt_1 (Character Sheet Creation)",
                template_vars=prompt_1_vars, 
                ai_model=ai_model,
                debug=False
            )
            
            # Validate that posts_data is valid JSON and has expected structure
            if isinstance(agent_data, dict) and 'agent' in agent_data:
                success = True
                break
            else:
                print(f"Invalid response format. Attempt {attempt + 1}/{max_retries}")
                
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error on attempt {attempt + 1}/{max_retries}: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            continue
    
    if not success:
        print("Max retries reached. Failed to get valid response from LLM.")
        return None

    # step 1.4: Merge agent details into the master template
    print("Merging agent details into the master template")
    agent_master_template = manager.merge_agent_details(
        master_data=agent_master_template,
        agent_data=agent_data
    )

    # step 1.5: store the concept in the agent template
    print("Storing the concept in the agent template")
    agent_master_template["agent"]["concept"] = prompt_1_vars["concept"]

    # step 1.6: create the file path for master file
    print("Creating the file path for the master file")
    agent_master_file_path = manager.create_filepath(
        agent_name=agent_master_template["agent"]["agent_details"]["name"], 
        season_number=0,
        episode_number=0,
        template_type=TemplateType.MASTER
    )

    # step 1.7: Save the agent data to a file
    print("Saving the agent data to a file")
    manager.save_json_file(
        save_path=agent_master_file_path,
        json_data=agent_master_template
    )

    print("Step 1 complete")
    return agent_master_file_path


import models.gemini_model as gemini_model
if __name__ == "__main__":
    ai_model = gemini_model.GeminiModel()
    create_agent(ai_model,  "time-traveling historian documenting the evolution of human technology through the ages")

