import yaml
from content_generator import ContentGenerator
from template_types import TemplateType

def step_3(ai_model, agent_file_path, season_file_path):
    '''
    Description:
        Create a new episode posts for the agent

    Args:
        ai_model: The AI model to use for generating responses
        season_file_path: The path to the season yaml file

    Returns:
        None    

    Example:
        ai_model = OpenAI(api_key="your_api_key")
        agent_file_path = "agent_template.yaml"
        step_2(ai_model, agent_file_path)
    '''
    print("Step 3: Create a batch of posts for episode") 

    # step 3.1: load the season template yaml file
    manager = ContentGenerator()

    # step 3.2: load the agent yaml file
    agent_yaml = None    
    with open(agent_file_path, 'r', encoding='utf-8') as file:
        agent_yaml = yaml.safe_load(file)

    # step 3.3: load the season yaml file
    season_data = None    
    with open(season_file_path, "r", encoding="utf-8") as file:
        season_data = yaml.safe_load(file)

    # step 3.4: Generate a new season name, topic, and communication style with the prompt_2 template
    season_template = manager.create_new_template_yaml(TemplateType.SEASON)

    # step 3.5: we only want to send the details about the season and not all the episodes
    season_template["season"]["season_number"] = season_data["season"]["season_number"]
    season_template["season"]["season_name"] = season_data["season"]["season_name"]
    season_template["season"]["season_description"] = season_data["season"]["season_description"]
    season_template["season"]["season_highlights"] = season_data["season"]["season_highlights"]
    season_template["season"]["season_summary"] = season_data["season"]["season_summary"]   

    # step 3.6: Access the 'episodes' key under 'season'
    episodes = season_data["season"]["episodes"]
    previous_episode = None
    # step 3.7: Loop through each episode in the list
    for episode in episodes:
        # step 3.8: create a new episode template
        episode_template = manager.create_new_template_yaml(TemplateType.EPISODE)
    
        # step 3.9: file in template
        episode_template["episode"]["season_number"] = season_data["season"]["season_number"]
        episode_template["episode"]["episode_number"] = episode["episode_number"]
        episode_template["episode"]["episode_name"] = episode["episode_name"]
        episode_template["episode"]["episode_description"] = episode["episode_description"]
        episode_template["episode"]["episode_summary"] = episode["episode_summary"]
        episode_template["episode"]["episode_highlights"] = episode["episode_highlights"]
        episode_template["episode"]["episode_posted"] = episode["episode_posted"]     

        # step 3.10: Generate a new season name, topic, and communication style with the prompt_2 template
        # prompt 2 Season Creation:
        # note that emojis will be output as unicode characters due to the yaml dump
        prompt_3_vars = {
            "agent_name": agent_yaml["name"],
            "agent_yaml": yaml.dump(agent_yaml),
            "season_yaml": yaml.dump(season_template),
            "episode_yaml": yaml.dump(episode_template),
            "previous_episode": yaml.dump(previous_episode),
            "number_of_posts": 12,
            "post_length": 277
        }

        # step 3.11: Run the prompt 
        episode_data = manager.run_prompt(
            # prompt_key="prompt_1 (Character Creation)",
            prompt_key="promot_3 (Episode Posts Creation)",
            template_vars=prompt_3_vars, 
            ai_model=ai_model,
        )

        # step 3.12: Add the season data to the season template
        episode_template = manager.add_data_to_template(
            current_data=episode_template,
            new_data=episode_data, 
        )

        # step 3.13: create the file path
        episode_file_path = manager.create_filepath(
            agent_name=agent_yaml["name"],
            season_number=season_template["season"]["season_number"],
            episode_number=episode_template["episode"]["episode_number"],
            template_type=TemplateType.EPISODE
        )

        # step 3.14: Save the season data to a file
        manager.save_yaml_file(
            save_path=episode_file_path,
            yaml_data=episode_template
        )

        # step 3.15: Move onto the next step of creating a new season
        previous_episode = episode_template
