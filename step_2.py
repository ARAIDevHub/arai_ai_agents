import yaml
from content_generator import ContentGenerator
from template_types import TemplateType
import step_3 as next_step

def step_2(ai_model, agent_file_path, debug=False):
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

    # 2.1 load the season template yaml file
    manager = ContentGenerator()
    season_template = manager.create_new_template_yaml(TemplateType.SEASON)

    # 2.2: load the agent yaml file
    agent_yaml = None    
    with open(agent_file_path, 'r', encoding='utf-8') as file:
        agent_yaml = yaml.safe_load(file)
    
    # step 2.3: Generate a new season name, topic, and communication style with the prompt_2 template
    # prompt 2 Season Creation:
    # note that emojis will be output as unicode characters due to the yaml dump
    prompt_2_vars = {
        "agent_name": agent_yaml["name"],
        "agent_yaml": yaml.dump(agent_yaml),
        "season_yaml": yaml.dump(season_template)
    }

    # step 2.4: Run the prompt 
    season_data = manager.run_prompt(
        # prompt_key="prompt_1 (Character Creation)",
        prompt_key="promot_2 (Season Creation)",
        template_vars=prompt_2_vars, 
        ai_model=ai_model,
        debug=debug        
    )

    # step 2.5: Add the season data to the season template
    season_template = manager.add_data_to_template(
        current_data=season_template,
        new_data=season_data, 
    )

    # step 2.6: create the file path
    season_file_path = manager.create_filepath(
        agent_name=agent_yaml["name"],
        number=season_template["season"]["season_number"],
        template_type=TemplateType.SEASON
    )

    # step 2.7: Save the season data to a file
    manager.save_yaml_file(
        save_path=season_file_path,
        yaml_data=season_template
    )

    # step 2.8: Move onto the next step of creating a new season
    next_step.step_3(ai_model, season_file_path)