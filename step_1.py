import yaml
from content_generator import ContentGenerator
import step_2 as next_step
# -------------------------------------------------------------------
# Step 1: Create a new agent
# -------------------------------------------------------------------
def step_1(ai_model, debug=False):
    # Create a new agent
    manager = ContentGenerator()
    agent = manager.create_new_agent_yaml()
    print("Agent created: with blank template")

    # prompt 1 Character Creation:
    # step 1.1: Generate a new agent name, topic, personality, and communication style with the prompt_1 template
    prompt_1_vars = {
        # "agent_name": "",
        # "personality": "",
        # "communication_style": "",
        # "topic": "",
        "concept": "alien drone pilot who is a sarcastic asshole visiting earth to report back his findings to his home planet",
        "agent_yaml": yaml.dump(agent)
    }

    # step 1.2: Run the prompt
    agent_data = manager.run_prompt(
        # prompt_key="prompt_1 (Character Creation)",
        prompt_key="promot_1 (Character Sheet Creation)",
        template_vars=prompt_1_vars, 
        ai_model=ai_model,
        debug=debug
    )

    debug = True
    if debug:
        print("--------------------------------")
        print(f"agent_data is:")
        print(agent_data)
        print("--------------------------------")
        print(f"agent_data is a {type(agent_data)}")
        print("--------------------------------")

    # step 1.3: Add the agent data to the agent template
    agent = manager.add_agent_data_to_template(
        current_agent_data=agent,
        new_agent_data=agent_data, 
    )

    if debug:
        print("--------------------------------")
        print(f"agent is:")
        print(agent)
        print("--------------------------------")

    # step 1.4: Save the agent data to a file
    # config_path = agent_data["name"]

    manager.save_agent_yaml(
        agent_data=agent,
    )

    # Move onto the next step
    next_step.step_2(ai_model)