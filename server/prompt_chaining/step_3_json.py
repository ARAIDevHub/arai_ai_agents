#
# Module: step_3
#
# This module implements the step_3 function for creating a new episode posts for an agent.
#
# Title: Step 3
# Summary: Step 3 implementation.
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
import yaml
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# custom ARAI imports
from utils.content_generator_json import ContentGenerator
from utils.template_types import TemplateType

def step_3(ai_model, master_file_path, number_of_posts):
    '''
    Description:
        Create a new episode posts for the agent

    Args:
        ai_model: The AI model to use for generating responses
        master_file_path: The path to the agent master json file

    Raises:
        Exception: If there's an error creating the episode posts        

    Example:
        >>> ai_model = GeminiModel()
        >>> master_file_path = "configs/Zorp/Zorp_master.json"
        >>> step_3(ai_model, master_file_path)
    '''
    print("Step 3: Create a batch of posts for episode") 

    # step 3.1: load the season template yaml file
    manager = ContentGenerator()

    episode_template = manager.create_new_template_json(TemplateType.EPISODE)

    # step 2.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # extract agent details from master json
    agent_details = agent_master_json['agent']['agent_details']

    # get last season file 
    current_season = None    
    # Get the last season from the seasons array if it exists
    seasons = agent_master_json['agent']['seasons']
    current_season = seasons[-1] if seasons else None

    # Extract season details
    season_details = {
        'season_name': current_season['season_name'],
        'season_number': current_season['season_number'],
        'season_description': current_season['season_description'],
        'season_highlights': current_season['season_highlights'],
        'season_summary': current_season['season_summary'],
    }

    previous_episode = None

    # Iterate over episodes while maintaining season context
    for episode in current_season['episodes']:
    # Now you have access to both season_details and the current episode
        print(f"Processing Episode {episode['episode_number']} of Season {season_details['season_number']}")
        # Work with episode data
        episode_data = {
            'episode_name': episode['episode_name'],
            'episode_number': episode['episode_number'],
            'episode_description': episode['episode_description'],
            'episode_highlights': episode['episode_highlights'],
            'episode_summary': episode['episode_summary'],
        }      

        # step 3.10: Generate a new season name, topic, and communication style with the prompt_2 template
        # prompt 2 Season Creation:
        # note that emojis will be output as unicode characters due to the yaml dump

        prompt_3_vars = {
            "agent_name": agent_details["name"],
            "agent_json": json.dumps(agent_details),
            "season_json": json.dumps(season_details),
            "episode_json": json.dumps(episode_data),
            "previous_episode": json.dumps(previous_episode),
            "number_of_posts": number_of_posts,
            "post_length": 277
        }

        # step 3.11: Run the prompt 
        posts_data = manager.run_prompt(
            # prompt_key="prompt_1 (Character Creation)",
            prompt_key="prompt_3 (Episode Posts Creation)",
            template_vars=prompt_3_vars, 
            ai_model=ai_model,
        )

        # # step 3.12: Add the season data to the season template
        # episode_template = manager.add_data_to_template(
        #     current_data=episode_data,
        #     new_data=episode_data, 
        # )

        # # step 3.13: create the file path
        # episode_file_path = manager.create_filepath(
        #     agent_name=agent_json["name"],
        #     season_number=season_details["season_number"],
        #     episode_number=episode_data["episode_number"],
        #     template_type=TemplateType.EPISODE
        # )

        # # step 3.14: Save the season data to a file
        # manager.save_yaml_file(
        #     save_path=episode_file_path,
        #     yaml_data=episode_template
        # )

        print("Appending the episode data to the master data")
        agent_master_json = manager.append_episodes(
            master_data=agent_master_json,
            posts_data=posts_data,
            season_index=season_details["season_number"]-1,
            episode_index= episode_data["episode_number"]-1
        )

        # step 2.9: save the master data to a file
        print("Saving the master data to a file")
        #print(f"saving agent json to: {master_file_path}")
        #print(f"agent data is: {agent_json}")
        manager.save_json_file(
            save_path=master_file_path,
            json_data=agent_master_json
        )

        # step 3.15: Move onto the next step of creating a new season
        previous_episode = episode_data

import models.gemini_model as gemini_model
if __name__ == "__main__":
    ai_model = gemini_model.GeminiModel()
    step_3(ai_model, "configs/CipherCat/CipherCat_master.json", 6)

