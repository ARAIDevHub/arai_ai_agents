#
# Module: step_2
#
# This module implements the step_2 function for creating a new season for an agent.
#
# Title: Step 2
# Summary: Step 2 implementation.
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
import os
import json
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# custom ARAI imports
from utils.content_generator_json import ContentGenerator
from utils.template_types import TemplateType
import prompt_chaining.step_3_json as next_step

def step_2(ai_model, master_file_path, number_of_episodes):
    '''
    Description:
        Create a new season for the agent

    Args:
        ai_model: The AI model to use for generating responses
        master_file_path: The path to the agent master json file

    Returns:
        season_file_path: The path to the season json file

    Raises:
        Exception: If there's an error creating the season

    Example:
        >>> ai_model = GeminiModel()
        >>> master_file_path = "agent_template.json"
        >>> step_2(ai_model, master_file_path)
    '''
    print("Step 2: Create a new season") 

    # step 2.1: load the season template json file
    manager = ContentGenerator()
    #season_template = manager.create_new_template_yaml(TemplateType.SEASON)
    season_template = manager.create_new_template_json(TemplateType.SEASON)

    # step 2.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # extract agent from master json
    agent_details = agent_master_json['agent']['agent_details']

    # step 2.3: find the previous season 
    # get last season file 
    previous_season = None    
    # Get the last season from the seasons array if it exists
    seasons = agent_master_json['agent']['seasons']
    previous_season = seasons[-1] if seasons else None
    
    if previous_season:
        print(f"Found previous season: {previous_season['season_number']}")
    else:
        print("No previous seasons found")

    # step 2.3: Generate a new season name, topic, and communication style with the prompt_2 template
    # prompt 2 Season Creation:
    # note that emojis will be output as unicode characters due to the json dump
    print("Crafting prompt for AI to create a new season")
    prompt_2_vars = {
        "agent_name": agent_details["name"],
        "agent_json": json.dumps(agent_details),
        "season_json": json.dumps(season_template),
        "previous_season": json.dumps(previous_season),
        "number_of_episodes": number_of_episodes
    }

    # step 2.4: Run the prompt 
    print("Sending prompt to AI to create a new season")
    season_data = manager.run_prompt(
        # prompt_key="prompt_1 (Character Creation)",
        prompt_key="prompt_2 (Season Creation)",
        template_vars=prompt_2_vars, 
        ai_model=ai_model,
    )

    print(f"season data is: {season_data}")

    # step 2.8: append the season data to the master data
    if len(seasons) <= 1 and seasons[0]["season_number"] == 0:
        print("First season, so we need to initialize the seasons array")
        agent_master_json = manager.initialize_seasons(
            master_data=agent_master_json,
            seasons_data=season_data
        )
    else:
        print("Appending the season data to the master data")
        agent_master_json = manager.append_seasons(
            master_data=agent_master_json,
            seasons_data=season_template,
        )

    # step 2.9: save the master data to a file
    print("Saving the master data to a file")
    manager.save_json_file(
        save_path=master_file_path,
        json_data=agent_master_json
    )

    print("Step 2 complete")
    #return season_file_path

import models.gemini_model as gemini_model
if __name__ == "__main__":
    ai_model = gemini_model.GeminiModel()
    step_2(ai_model, "configs/Zorp/Zorp_master.json", 3)