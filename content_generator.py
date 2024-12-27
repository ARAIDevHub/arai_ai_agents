import yaml
from jinja2 import Template
from models.base_model import ModelInterface
import os
import shutil
from template_types import TemplateType

class ContentGenerator:
    """
    Description:
        This class is responsible for generating content for the agents.

    Attributes:
        agents_config_dir (str): the directory to save the agent configurations
        templates_dir (str): the directory to save the agent templates
        agent_template_path (str): the path to the agent template
    """

    def __init__(self):
        """
        Description:
            Initialize the ContentGenerator class.

        Args:
            None

        Returns:
            None

        Example:
            content_generator = ContentGenerator()            
        """
        # 1. Set the directories
        # use relative path to the current file to get the directories
        self.agents_config_dir = os.path.join(os.path.dirname(__file__), "configs")
        self.templates_dir = os.path.join(os.path.dirname(__file__), "templates")
        self.prompts_dir = os.path.join(os.path.dirname(__file__), "prompts")

        # 2. Set the paths
        self.agent_template_path = os.path.join(self.templates_dir, "agent_template.yaml")
        self.season_template_path = os.path.join(self.templates_dir, "season_template.yaml")
        self.episode_template_path = os.path.join(self.templates_dir, "episode_template.yaml")
        self.chain_prompts_path = os.path.join(self.prompts_dir, "chain_prompts_v2.yaml")

    # -------------------------------------------------------------------
    # Helper to create a new agent yaml file
    # -------------------------------------------------------------------
    def create_new_template_yaml(self, template_type: TemplateType) -> dict:
        """
        Description:
            Create a new agent configuration based on the template configuration file.

        Args:
            None

        Returns:
            dict: the new agent configuration

        Example:
            agent_config = create_new_agent_yaml()
            print(agent_config)
        """
        # 1. Ensure directory exist
        os.makedirs(self.templates_dir, exist_ok=True)

        # 2. Load the template configuration file
        if template_type == TemplateType.AGENT:
            template_path = self.agent_template_path
        elif template_type == TemplateType.SEASON:
            template_path = self.season_template_path
        elif template_type == TemplateType.EPISODE:
            template_path = self.episode_template_path
        else:
            raise ValueError(f"Invalid template type: {template_type}")

        # 3. Load the template configuration file
        with open(template_path, "r") as f:
            template = yaml.safe_load(f)
        
        # 3. Create a new configuration based on the template
        new_config_file = template.copy()

        # 4. Return new configuration to be processed by the agent_creator
        return new_config_file

    # -------------------------------------------------------------------
    # Helper to safely parse YAML from the LLM's response
    # -------------------------------------------------------------------
    def process_and_save_agent_response(self, response) -> dict:
        """
        Description:
            Attempts to parse YAML from LLM text. 
        
        Future work: 
            May need error-handling if the LLM returns invalid YAML.

        Args:
            response (str): the response from the LLM
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            dict: the parsed YAML

        Example:
            response = "```yaml\nname: John Doe\nage: 30\n```"
            parsed = parse_yaml_from_response(response)
            print(parsed)
        """
        
        # 1. response = self.fix_yaml_from_response(response, debug)
        raw_save_path = self.save_raw_response(response)
        print(f"raw_save_path is: {raw_save_path}")

        # 2. response = self.save_processed_response(response, debug)
        save_path = self.create_yaml_from_response(response)       
        print(f"save_path is: {save_path}")

        # 3. load the yaml file into a dict
        with open(save_path, "r", encoding="utf-8") as f:
            try:
                # 3.1 load the yaml file into a dict
                response = yaml.safe_load(f)                               
            except Exception as e:
                print(f"process_and_save_agent_response. Error loading yaml file: {str(e)}")                
                return None        
    
        # 4. Agent directory
        file_dir = os.path.join(self.agents_config_dir, "temporary")
        print(f"file_dir is: {file_dir}")

        # 5. Make sure the agent directory exists
        os.makedirs(file_dir, exist_ok=True)

        # 6. Move files to agent directory                
        saved_raw_path = self.move_file(raw_save_path, file_dir)
        saved_processed_path = self.move_file(save_path, file_dir)

        # 7. Rename the files                
        # self.rename_file(saved_raw_path, response["name"] + "_raw.yaml")
        # self.rename_file(saved_processed_path, response["name"] + "_processed.yaml")
        # self.rename_file(saved_raw_path, "raw.yaml")
        # self.rename_file(saved_processed_path, "processed.yaml")
        
        # 8. return the response
        return response

    # -------------------------------------------------------------------
    # Helper to save the raw response to a file
    # -------------------------------------------------------------------
    def save_raw_response(self, response) -> str:
        """
        Description:
            Saves the raw response to a file.

        Args:
            response (str): the response from the LLM
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            str: the path to the saved yaml file

        Example:
            response = "```yaml\nname: John Doe\nage: 30\n```"
            save_path = save_raw_response(response)
            print(save_path)
        """
        # 1. create a file to save the response
        save_path = os.path.join(self.agents_config_dir, "raw_response.yaml")
        
        # 2. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 3. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:
                f.write(response)                
                return save_path
            except Exception as e:
                print(f"Error saving response to file: {str(e)}")
                return None

    # -------------------------------------------------------------------
    # Helper to create a yaml file from LLM text
    # -------------------------------------------------------------------
    def create_yaml_from_response(self, response) -> str:
        """
        Description:
            Attempts to create a yaml file from LLM text. 
        
        Future work: 
            May need error-handling if the LLM returns invalid YAML.

        Args:
            response (str): the response from the LLM
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            str: the path to the saved yaml file

        Example:
            response = "```yaml\nname: John Doe\nage: 30\n```"
            save_path = create_yaml_from_response(response)
            print(save_path)
        """
        # 1. strip out '''yaml and ''' 
        # remove new lines and leading and trailing whitespace
        response = response.replace("```yaml", "").replace("```", "").strip()
        
        # 2. create a file to save the response
        save_path = os.path.join(self.agents_config_dir, "processed_response.yaml")

        # 3. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 4. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:                
                # yaml_string = yaml.dump(response, allow_unicode=True, default_flow_style=False)
                # f.write(yaml_string)
                f.write(response)
            except Exception as e:
                print(f"Error saving response to file: {str(e)}")      

        return save_path

    # -------------------------------------------------------------------
    # Helper to rename file
    # -------------------------------------------------------------------
    def rename_file(self, old_path, new_name) -> str:
        """
        Description:
            Renames a file.

        Args:
            old_path (str): the old path to the file
            new_name (str): the new name of the file

        Returns:
            str: the new path to the file

        Example:
            rename_file("tests/test.yaml", "test_new.yaml")
        """
        # 1. Ensure directory exists
        os.makedirs(os.path.dirname(old_path), exist_ok=True)

        # 2. Rename the file
        try:
            new_path = os.path.join(os.path.dirname(old_path), new_name)
            os.rename(old_path, new_path)
            return new_path 
        except Exception as e:
            print(f"Error renaming file: {str(e)}")
            return None

    # -------------------------------------------------------------------
    # Helper to move file
    # -------------------------------------------------------------------
    def move_file(self, old_path, new_dir) -> str:
        """
        Description:
            Moves a file.

        Args:
            old_path (str): the old path to the file
            new_dir (str): the new directory to move the file to

        Returns:
            str: the new path to the file after moving

        Example:
            move_file("tests/test.yaml", "agents/test")
        """
        # 1. Ensure directory exists
        os.makedirs(new_dir, exist_ok=True)

        # 2. Move the file
        try:
            new_path = os.path.join(new_dir, os.path.basename(old_path))
            new_path = shutil.move(old_path, new_path)
            return new_path
        except Exception as e:
            print(f"Error moving file: {str(e)}")
            return None


    # -------------------------------------------------------------------
    # Helper to add new agent data to the current agent data
    # -------------------------------------------------------------------
    def add_data_to_template(self, current_data, new_data) -> dict:
        """
        Description:
            Adds new agent data to the current agent data.

        Args:
            new_data (dict): the new data
            current_data (dict): the current data

        Returns:
            dict: the updated agent data

        Example:
            new_data = {"name": "John Doe", "age": 30}
            current_data = {"name": "Jane Doe", "age": 25}
            updated_data = add_data_to_template(new_data, current_data)
            print(updated_data)
        """
        # 1. ensure we have a dictionary to work with
        if isinstance(current_data, str):
            existing_data = yaml.safe_load(current_data)
        elif isinstance(current_data, dict):
            existing_data = current_data.copy()
        else:
            existing_data = {}

        # 2. Only update fields that already exist in existing_data
        for key in new_data:
            if key in existing_data:
                existing_data[key] = new_data[key]
        
        # 3. return the updated data
        return existing_data

    # -------------------------------------------------------------------
    # Helper to create filepath
    # -------------------------------------------------------------------
    def create_filepath(self, agent_name: str, season_number: int, episode_number: int, template_type: TemplateType):
        """
        Description:
            Creates a filepath for the agent data.

        Args:
            agent_name (str): the name of the agent
            season_number (str): the number of the season
            episode_number (str): the number of the episode
            template_type (TemplateType): the type of template

        Returns:
            str: the filepath

        Example:
            create_filepath("John Doe", "0", TemplateType.AGENT)
        """
        # 1. create the filepath based on the template type
        if template_type == TemplateType.AGENT:            
            return os.path.join(self.agents_config_dir, agent_name, agent_name + ".yaml")
        elif template_type == TemplateType.SEASON:
            return os.path.join(self.agents_config_dir, agent_name, "season_" + str(season_number), "season_" + str(season_number) + ".yaml")
        elif template_type == TemplateType.EPISODE:
            return os.path.join(self.agents_config_dir, agent_name, "season_" + str(season_number), "s" + str(season_number) + "_episode_" + str(episode_number) + ".yaml")

    # -------------------------------------------------------------------
    # Helper to save the agent data to a yaml file
    # -------------------------------------------------------------------
    def save_yaml_file(self, save_path: str, yaml_data: dict):
        """
        Description:
            Save agent data to a YAML file at the specified path or default location.
        
        Args:
            filepath: The path to save the YAML file
            yaml_data: The data to save to the YAML file

        Returns:
            None

        Example:
            agent_data = {"name": "John Doe", "age": 30}
            save_yaml_file(filepath="tests/test.yaml", yaml_data=agent_data)
        """              
        # 1. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 2. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:
                # Convert dictionary to YAML string, then write directly to persver emoji images
                # Others will get unicodes instead of the emojis
                yaml_string = yaml.dump(yaml_data, allow_unicode=True, default_flow_style=False)
                f.write(yaml_string)
                print(f"save_path is: {save_path}")
                return save_path
            except Exception as e:
                print(f"Error saving response to file: {str(e)}")
                return None

    # -------------------------------------------------------------------
    # Generic prompt runner that works with any prompt template
    # -------------------------------------------------------------------
    def run_prompt(self, prompt_key, template_vars, ai_model, debug=False):
        """
        Description:
            Generic prompt runner that works with any prompt template
        
        Args:
            prompt_key: The key for the prompt template (e.g., "prompt_1", "prompt_2")
            template_vars: dict of variables to pass to the template
            ai_model: The AI model to use for generating responses
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            dict: the parsed YAML

        Example:
            prompt_key = "prompt_1"
            template_vars = {"name": "John Doe", "age": 30}
            ai_model = OpenAI(api_key="your_api_key")
            parsed = run_prompt(prompt_key, template_vars, ai_model, debug=True)
            print(parsed)
        """
        # 1. Load the chain prompts from the YAML file
        with open(self.chain_prompts_path, "r", encoding="utf-8") as f:
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
        yaml_response = self.process_and_save_agent_response(response)

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

        # 6. return yaml_response
        return yaml_response