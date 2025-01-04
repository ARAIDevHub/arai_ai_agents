# standard imports
import os
import yaml

# custom ARIA imports
from utils.content_generator import ContentGenerator
from utils.template_types import TemplateType
import prompt_chaining.step_3 as next_step

def step_2(ai_model, agent_file_path):
    '''
    Description:
        Create a new season for the agent

    Args:
        ai_model: The AI model to use for generating responses
        agent_file_path: The path to the agent yaml file

    Returns:
        None    

    Example:
        ai_model = OpenAI(api_key="your_api_key")
        agent_file_path = "agent_template.yaml"
        step_2(ai_model, agent_file_path)
    '''
    print("Step 2: Create a new season") 

    # step 2.1: load the season template yaml file
    manager = ContentGenerator()
    season_template = manager.create_new_template_yaml(TemplateType.SEASON)

    # step 2.2: load the agent yaml file
    agent_yaml = None    
    with open(agent_file_path, 'r', encoding='utf-8') as file:
        agent_yaml = yaml.safe_load(file)
    
    # step 2.3: find the previous season 
    # get last season file 
    previous_season = None
    # Update the path to include the agent's specific directory
    agent_seasons_dir = os.path.join(manager.agents_config_dir, agent_yaml['name'])
    

    # Check if the agent directory exists
    if os.path.exists(agent_seasons_dir):
        # Look for season folders in the agent's directory
        season_folders = [f for f in os.listdir(agent_seasons_dir) if f.startswith("season_")]
        
        if season_folders:
            # Sort the folders by season number and get the last one
            last_folder = sorted(season_folders, key=lambda x: int(x.split('_')[1]))[-1]
            
            season_file_path = os.path.join(agent_seasons_dir, last_folder, f"{last_folder}.yaml")
            print(f"Looking for previous season at: {season_file_path}")  # Debug print
            
            if os.path.exists(season_file_path):
                with open(season_file_path, 'r', encoding='utf-8') as file:
                    previous_season = yaml.safe_load(file)
                print(f"Found previous season: {last_folder}")
        else:
            print(f"No season folders found in {agent_seasons_dir}")
    else:
        print(f"Agent directory not found at {agent_seasons_dir}")



    # step 2.3: Generate a new season name, topic, and communication style with the prompt_2 template
    # prompt 2 Season Creation:
    # note that emojis will be output as unicode characters due to the yaml dump
    prompt_2_vars = {
        "agent_name": agent_yaml["name"],
        "agent_yaml": yaml.dump(agent_yaml),
        "season_yaml": yaml.dump(season_template),
        "previous_season": yaml.dump(previous_season)
    }

    # step 2.4: Run the prompt 
    season_data = manager.run_prompt(
        # prompt_key="prompt_1 (Character Creation)",
        prompt_key="prompt_2 (Season Creation)",
        template_vars=prompt_2_vars, 
        ai_model=ai_model,
    )

    # step 2.5: Add the season data to the season template
    season_template = manager.add_data_to_template(
        current_data=season_template,
        new_data=season_data, 
    )

    # step 2.6: create the file path
    season_file_path = manager.create_filepath(
        agent_name=agent_yaml["name"],
        season_number=season_template["season"]["season_number"],
        episode_number=0,
        template_type=TemplateType.SEASON
    )

    # step 2.7: Save the season data to a file
    manager.save_yaml_file(
        save_path=season_file_path,
        yaml_data=season_template
    )

    return season_file_path

    # step 2.8: Move onto the next step of creating a new season
    # if chain_step:
    #   next_step.step_3(ai_model, agent_file_path, season_file_path, chain_step)