import yaml
from jinja2 import Template
from models.base_model import ModelInterface
import os

class ContentGenerator:
    def __init__(self):
        pass  # You can add any initialization logic here if needed

    def create_new_agent_yaml(self, agent_name: str = None, topic: str = None, personality: str = None, communication_style: str = None) -> dict:
        # Load the template configuration file
        agent_template_path = os.path.join("configs", "agent_template.yaml")
        with open(agent_template_path, "r") as f:
            agent_template = yaml.safe_load(f)
        
        # Create a new configuration based on the template
        new_config = agent_template.copy()
        
        # Update the configuration with provided parameters only if they are not None
        if agent_name:
            new_config['name'] = agent_name
        if topic:
            new_config['topic'] = topic
        if personality:
            new_config['personality'] = personality
        if communication_style:
            new_config['communication_style'] = communication_style

        # Return new configuration to be processed by the agent_creator
        return new_config

    # -------------------------------------------------------------------
    # Helper to safely parse YAML from the LLM's response
    # -------------------------------------------------------------------
    @staticmethod
    def parse_yaml_from_response(response):
        """
        Attempts to parse YAML from LLM text. 
        You may need error-handling if the LLM returns invalid YAML.
        """
        
        # create a file to save the response
        save_path = os.path.join("tests", "response.yaml")
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Save the YAML file
        print("--------------------------------")
        print(f"saving response to file:")
        print(save_path)
        print("--------------------------------")
        with open(save_path, "w") as f:
            try:
                f.write(response)
            except Exception as e:
                print(f"Error saving response to file: {str(e)}")

        # strip out '''yaml and '''
        response = response.replace("```yaml", "").replace("```", "")
        print("--------------------------------")
        print(f"response stripped is:")
        print(response)
        print("--------------------------------")

        try:
            parsed = yaml.safe_load(response)
            return parsed
        except yaml.YAMLError:
            # You might prompt the LLM again to fix the format or handle errors here
            return None

    # -------------------------------------------------------------------
    # Helper to add new agent data to the current agent data
    # -------------------------------------------------------------------
    def add_agent_data_to_template(self, new_agent_data, current_agent_data) -> dict:
        # First, ensure we have a dictionary to work with
        if isinstance(current_agent_data, str):
            existing_data = yaml.safe_load(current_agent_data)
        elif isinstance(current_agent_data, dict):
            existing_data = current_agent_data.copy()
        else:
            existing_data = {}

        # Only update fields that already exist in existing_data
        for key in new_agent_data:
            if key in existing_data:
                existing_data[key] = new_agent_data[key]
        
        # Convert back to YAML string
        return existing_data

    # -------------------------------------------------------------------
    # Helper to save the agent data to a yaml file
    # -------------------------------------------------------------------
    def save_agent_yaml(self, agent_data, config_path="tests/test.yaml", debug=False):
        """
        Save agent data to a YAML file at the specified path or default location.
        
        Args:
            agent_data: Dictionary containing agent configuration
            config_path: Optional custom path to save the YAML file
        """
        # Use provided config_path if available, otherwise use default path
        # save_path = config_path if config_path else os.path.join(self.agents_config_dir, f"{agent_data['name']}.yaml")

        save_path = config_path if config_path else os.path.join("tests", f"{agent_data['name']}.yaml")

        # Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        if debug:
            print("--------------------------------")
            print(f"saving agent data to file:")
            print(save_path)
            print("--------------------------------")
            print(f"name in agent data is:")
            print(agent_data["name"])
            print("--------------------------------")

        # Save the YAML file
        with open(save_path, "w") as f:
            yaml.dump(agent_data, f)

    # -------------------------------------------------------------------
    # Generic prompt runner that works with any prompt template
    # -------------------------------------------------------------------
    def run_prompt(self, prompt_key, template_vars, ai_model, debug=False):
        """
        Generic prompt runner that works with any prompt template
        
        Args:
            prompt_key: The key for the prompt template (e.g., "prompt_1", "prompt_2")
            template_vars: dict of variables to pass to the template
            ai_model: The AI model to use for generating responses
        """
        # 1. Load the chain prompts from the YAML file
        with open("prompts/chain_prompts.yaml", "r", encoding="utf-8") as f:
            chain_prompts = yaml.safe_load(f)

        # 2. Grab the raw prompt template text
        prompt_template = chain_prompts[prompt_key]

        # 3. Use Jinja2 to fill placeholders
        template = Template(prompt_template)
        prompt_text = template.render(**template_vars)

        if debug:
            print("--------------------------------")
            print(f"prompt key is:")
            print (prompt_key)
            print("--------------------------------")
            print(f"prompt text is:")
            print (prompt_text)
            print("--------------------------------")

        # 4. Call the LLM
        response = ai_model.generate_response(prompt_text)

        if debug:
            print("--------------------------------")
            print(f"response is:")
            print(response)
            print("--------------------------------")

        # # 5. Parse the YAML from the LLM's response
        yaml_response = ContentGenerator.parse_yaml_from_response(response)

        if debug:
            print("--------------------------------")
            print(f"yaml_response is:")
            print(yaml_response)
            print("--------------------------------")
            print(f"yaml_response is a {type(yaml_response)}")
            print("--------------------------------")

        if yaml_response is None:
             # Handle parse error or fallback
             print(f"Error: LLM returned invalid YAML for {prompt_key}.")
             return None

        # return yaml_response
        return yaml_response