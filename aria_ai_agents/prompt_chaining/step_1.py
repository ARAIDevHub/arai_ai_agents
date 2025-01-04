#
# Module: step_1
#
# This module implements the step_1 function for creating a new agent.
#
# Title: Step 1
# Summary: Step 1 implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://aria-ai.io
#     - https://github.com/ARIA-DevHub/aria-ai-agents
#     - https://x.com/TheBlockRhino

# standard imports
import yaml

# custom ARIA imports
from utils.content_generator import ContentGenerator
import prompt_chaining.step_2 as next_step
from utils.template_types import TemplateType

# -------------------------------------------------------------------
# Step 1: Create a new agent
# -------------------------------------------------------------------
def step_1(ai_model, concept: str):
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
    agent_template = manager.create_new_template_yaml(TemplateType.AGENT)

    # step 1.2: Generate a new agent name, topic, personality, and communication style with the prompt_1 template
    # prompt 1 Character Creation:
    prompt_1_vars = {
        # "agent_name": "",
        # "personality": "",
        # "communication_style": "",
        # "topic": "",
        # "concept": "alien drone pilot who is a sarcastic asshole visiting earth to report back his findings to his home planet",
        "concept": concept,
        "agent_yaml": yaml.dump(agent_template)        
    }

    # step 1.3: Run the prompt
    agent_data = manager.run_prompt(
        # prompt_key="prompt_1 (Character Creation)",
        prompt_key="prompt_1 (Character Sheet Creation)",
        template_vars=prompt_1_vars, 
        ai_model=ai_model
    )

    # step 1.4: Add the agent data to the agent template
    agent_template = manager.add_data_to_template(
        current_data=agent_template,
        new_data=agent_data
    )

    # step 1.5: store the concept in the agent template
    agent_template["concept"] = prompt_1_vars["concept"]

    # step 1.6: create the file path
    agent_file_path = manager.create_filepath(
        agent_name=agent_template["name"], 
        season_number=0,
        episode_number=0,
        template_type=TemplateType.AGENT
    )

    # step 1.7: Save the agent data to a file
    manager.save_yaml_file(
        save_path=agent_file_path,
        yaml_data=agent_template
    )

    return agent_file_path