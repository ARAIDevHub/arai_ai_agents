#
# Module: content_generator
#
# This module implements the ContentGenerator class for generating content for the agents.
#
# Title: Content Generator
# Summary: Content generator implementation.
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
import shutil
import yaml
import json
from jinja2 import Template
import copy

# custom ARAI code imports
from models.base_model import ModelInterface
from utils.template_types import TemplateType

class ContentGenerator:
    """
    Description:
        This class is responsible for generating content for the agents.

    Attributes:
        agents_config_dir (str): the directory to save the agent configurations
        templates_dir (str): the directory to save the agent templates
        agent_template_path (str): the path to the agent template
        chain_prompts_path (str): the path to the chain prompts
    """

    def __init__(self):
        """Initialize the ContentGenerator class.

        Example:
            >>> content_generator = ContentGenerator()            
        """
        # use relative path to get to project root (two levels up from utils)
        project_root = os.path.dirname(os.path.dirname(__file__))
        
        # Set the directories relative to project root
        self.agents_config_dir = os.path.join(project_root, "configs")        
        self.prompts_dir = os.path.join(project_root, "prompts")        

        # Set the path for the chain prompt
        self.chain_prompts_path = os.path.join(self.prompts_dir, "prompt_chaining.yaml")       
        
        # Set the paths for the templates
        self.templates_dir = os.path.join(project_root, "templates")
        self.master_template_path = os.path.join(self.templates_dir, "master.json")
        self.tracker_template_path = os.path.join(self.templates_dir, "tracker.json")
        self.agent_template_path = os.path.join(self.templates_dir, "agent.json")
        self.season_template_path = os.path.join(self.templates_dir, "season.json")
        self.episode_template_path = os.path.join(self.templates_dir, "episode.json")
        self.profile_image_template_path = os.path.join(self.templates_dir, "profile_image.json")        
        self.profile_image_options_template_path = os.path.join(self.templates_dir, "profile_image_options.json")
        self.chat_template_path = os.path.join(self.templates_dir, "chat_log.json")

    # -------------------------------------------------------------------
    # Helper to create a new agent yaml file
    # -------------------------------------------------------------------
    def create_new_template_json(self, template_type: TemplateType) -> dict:
        """Create a new agent configuration based on the template configuration file.

        Args:
            template_type (TemplateType): the type of template to create

        Returns:
            dict: the new agent configuration

        Raises:
            ValueError: If the template type is invalid

        Example:
            >>> agent_config = create_new_template_json(TemplateType.MASTER)
            >>> print(agent_config)
        """
        # 1. Ensure directory exist
        os.makedirs(self.templates_dir, exist_ok=True)

        # 2. Load the template configuration file
        if template_type == TemplateType.MASTER:
            template_path = self.master_template_path
        elif template_type == TemplateType.TRACKER:
            template_path = self.tracker_template_path
        elif template_type == TemplateType.AGENT:
            template_path = self.agent_template_path
        elif template_type == TemplateType.SEASON:
            template_path = self.season_template_path
        elif template_type == TemplateType.EPISODE:
            template_path = self.episode_template_path
        elif template_type == TemplateType.PROFILE_IMAGE:
            template_path = self.profile_image_template_path
        elif template_type == TemplateType.PROFILE_IMAGE_OPTIONS:
            template_path = self.profile_image_options_template_path
        elif template_type == TemplateType.CHAT:
            template_path = self.chat_template_path
        else:
            raise ValueError(f"Invalid template type: {template_type}")

        # 3. Load the template configuration file
        with open(template_path, "r") as f:
            template = json.load(f)
        
        # 4. Return new configuration
        return template

    # -------------------------------------------------------------------
    # Helper to safely parse YAML from the LLM's response
    # -------------------------------------------------------------------
    def process_and_save_agent_response(self, response) -> dict:
        """Attempts to parse JSON from LLM text. 
        
        Args:
            response (str): the response from the LLM
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            dict: the parsed JSON

        Raises:
            Exception: If there's an error parsing the JSON

        Example:
            >>> response = "```yaml\nname: John Doe\nage: 30\n```"
            >>> parsed = process_and_save_agent_response(response)
            >>> print(parsed)
        """
        
        # 1. response = self.fix_yaml_from_response(response, debug)
        raw_save_path = self.save_raw_response(response)
        print(f"raw_save_path is: {raw_save_path}")

        # 2. response = self.save_processed_response(response, debug)
        save_path = self.create_json_from_response(response)       
        print(f"save_path is: {save_path}")

        # 3. load the yaml file into a dict
        with open(save_path, "r", encoding="utf-8") as f:
            try:
                # 3.1 load the yaml file into a dict
                response = json.load(f)                               
            except Exception as e:
                print(f"process_and_save_agent_response. Error loading json file: {str(e)}")                
                return None        
    
        # 4. Agent directory
        file_dir = os.path.join(self.agents_config_dir, "temporary")
        print(f"file_dir is: {file_dir}")

        # 5. Make sure the agent directory exists
        os.makedirs(file_dir, exist_ok=True)

        # 6. Move files to agent directory                
        saved_raw_path = self.move_file(raw_save_path, file_dir)
        saved_processed_path = self.move_file(save_path, file_dir)
        
        # 8. return the response
        return response

    # -------------------------------------------------------------------
    # Helper to save the raw response to a file
    # -------------------------------------------------------------------
    def save_raw_response(self, response) -> str:
        """Saves the raw response to a file.

        Args:
            response (str): the response from the LLM
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            str: the path to the saved yaml file

        Raises:
            Exception: If there's an error saving the response

        Example:
            >>> response = "```yaml\nname: John Doe\nage: 30\n```"
            >>> save_path = save_raw_response(response)
            >>> print(save_path)
        """
        # 1. create a file to save the response
        save_path = os.path.join(self.agents_config_dir, "raw_response.json")
        
        # 2. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 3. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:
                f.write(response)                
                return save_path
            except Exception as e:
                print(f"Error saving raw response to file: {str(e)}")
                return None

    # -------------------------------------------------------------------
    # Helper to create a yaml file from LLM text
    # -------------------------------------------------------------------
    def create_json_from_response(self, response) -> str:
        """Attempts to create a yaml file from LLM text. 
        
        Args:
            response (str): the response from the LLM

        Returns:
            str: the path to the saved yaml file

        Raises:
            Exception: If there's an error saving the response

        Example:
            >>> response = "```json\nname: John Doe\nage: 30\n```"
            >>> save_path = create_json_from_response(response)
            >>> print(save_path)
        """
        # 1. strip out '''yaml and ''' 
        # remove new lines and leading and trailing whitespace
        response = response.replace("```json", "").replace("```", "").strip()
        
        # 2. create a file to save the response
        save_path = os.path.join(self.agents_config_dir, "processed_response.json")

        # 3. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 4. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:                
                # yaml_string = yaml.dump(response, allow_unicode=True, default_flow_style=False)
                # f.write(yaml_string)
                f.write(response)
            except Exception as e:
                print(f"Error creating json file from response: {str(e)}")      

        return save_path

    # -------------------------------------------------------------------
    # Helper to rename file
    # -------------------------------------------------------------------
    def rename_file(self, old_path, new_name) -> str:
        """Renames a file.

        Args:
            old_path (str): the old path to the file
            new_name (str): the new name of the file

        Returns:
            str: the new path to the file

        Raises:
            Exception: If there's an error renaming the file

        Example:
            >>> rename_file("tests/test.json", "test_new.json")
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
        """Moves a file.

        Args:
            old_path (str): the old path to the file
            new_dir (str): the new directory to move the file to

        Returns:
            str: the new path to the file after moving

        Raises:
            Exception: If there's an error moving the file

        Example:
            >>> move_file("tests/test.json", "agents/test")
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
        """Adds new agent data to the current agent data.

        Args:
            new_data (dict): the new data
            current_data (dict): the current data

        Returns:
            dict: the updated agent data

        Raises:
            Exception: If there's an error adding the data

        Example:
            >>> new_data = {"name": "John Doe", "age": 30}
            >>> current_data = {"name": "Jane Doe", "age": 25}
            >>> updated_data = add_data_to_template(new_data, current_data)
            >>> print(updated_data)
        """
        # 1. ensure we have a dictionary to work with
        if isinstance(current_data, str):
            existing_data = json.loads(current_data)
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
        """Creates a filepath for the agent data.

        Args:
            agent_name (str): the name of the agent
            season_number (str): the number of the season
            episode_number (str): the number of the episode
            template_type (TemplateType): the type of template

        Returns:
            str: the filepath

        Raises:
            Exception: If there's an error creating the filepath

        Example:
            >>> create_filepath("John Doe", "0", TemplateType.AGENT)
        """
        # Fixing the space in the agent name and in the file paths
        agent_name = agent_name.replace(" ", "_")

        # 1. create the filepath based on the template type
        if template_type == TemplateType.MASTER:            
            return os.path.join(self.agents_config_dir, agent_name, agent_name + "_master.json")
        elif template_type == TemplateType.TRACKER:
            return os.path.join(self.agents_config_dir, agent_name, "tracker" + ".json")
        elif template_type == TemplateType.AGENT:            
            return os.path.join(self.agents_config_dir, agent_name, agent_name + ".json")
        elif template_type == TemplateType.SEASON:
            return os.path.join(self.agents_config_dir, agent_name, "season_" + str(season_number), "season_" + str(season_number) + ".json")
        elif template_type == TemplateType.EPISODE:
            return os.path.join(self.agents_config_dir, agent_name, "season_" + str(season_number), "s" + str(season_number) + "_episode_" + str(episode_number) + ".json")
        elif template_type == TemplateType.PROFILE_IMAGE:
            return os.path.join(self.agents_config_dir, agent_name, "profile_image.json")
        elif template_type == TemplateType.PROFILE_IMAGE_OPTIONS:
            return os.path.join(self.agents_config_dir, agent_name, "profile_image_options.json")
        elif template_type == TemplateType.CHAT:
            return os.path.join(self.agents_config_dir, agent_name, agent_name + "_chat_log.json")

    # -------------------------------------------------------------------
    # Helper to save the agent data to a yaml file
    # -------------------------------------------------------------------
    def save_json_file(self, save_path: str, json_data: dict):
        """Saves the agent data to a JSON file.

        Args:
            save_path (str): The path to save the JSON file
            json_data (dict): The data to save to the JSON file

        Returns:
            str: the path to the saved json file

        Raises:
            Exception: If there's an error saving the json file

        Example:
            >>> agent_data = {"name": "John Doe", "age": 30}
            >>> save_json_file(filepath="tests/test.json", json_data=agent_data)
        """              
        # 1. Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 2. Save the response to the file
        with open(save_path, "w", encoding="utf-8") as f:
            try:
                # Use json.dump() with the file object, not json.dumps()
                json.dump(json_data, f, ensure_ascii=False, indent=2)
                print(f"save_path is: {save_path}")
                return save_path
            except Exception as e:
                print(f"Error saving response to json file: {str(e)}")
                return None

    # -------------------------------------------------------------------
    # Generic prompt runner that works with any prompt template
    # -------------------------------------------------------------------
    def run_prompt(self, prompt_key, template_vars, ai_model, debug=False):
        """Generic prompt runner that works with any prompt template.
        
        Args:
            prompt_key (str): The key for the prompt template (e.g., "prompt_1", "prompt_2")
            template_vars (dict): dict of variables to pass to the template
            ai_model (ModelInterface): The AI model to use for generating responses
            debug (bool, optional): whether to print debug information. Defaults to False.

        Returns:
            dict: the parsed YAML

        Raises:
            Exception: If there's an error running the prompt

        Example:
            >>> prompt_key = "prompt_1"
            >>> template_vars = {"name": "John Doe", "age": 30}
            >>> ai_model = OpenAI(api_key="your_api_key")
            >>> parsed = run_prompt(prompt_key, template_vars, ai_model, debug=True)
            >>> print(parsed)
        """
        # 1. Load the chain prompts from the JSON file
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
        json_response = self.process_and_save_agent_response(response)

        if debug:
            print("--------------------------------")
            print(f"json_response is:")
            print(json_response)
            print("--------------------------------")
            print(f"json_response is a {type(json_response)}")
            print("--------------------------------")

        if json_response is None:
             # Handle parse error or fallback
             print(f"Error: LLM returned invalid JSON for {prompt_key}.")
             return None

        # 6. return json_response
        return json_response
        
    def merge_agent_details(self, master_data: dict, agent_data: dict) -> dict:
        """Merges agent details by replacing fields in master with agent data.
        
        Args:
            master_data (dict): The master template data
            agent_data (dict): The agent-specific data to merge
            
        Returns:
            dict: Updated master data with agent details
        """
        if isinstance(master_data, str):
            master_data = json.loads(master_data)
        
        # Deep copy to avoid modifying original
        result = copy.deepcopy(master_data)
        
        # Replace agent_details section
        if "agent" in agent_data and "agent_details" in agent_data["agent"]:
            result["agent"]["agent_details"] = agent_data["agent"]["agent_details"]
        else:
            print("Error: agent_details not found in agent_data")
            
        return result

    def append_seasons(self, master_data: dict, seasons_data: dict) -> dict:
        """Appends new seasons data to existing master data.
        
        Args:
            master_data (dict): The master template data
            seasons_data (dict): The seasons data to append
            
        Returns:
            dict: Updated master data with appended seasons
        """
        if isinstance(master_data, str):
            master_data = json.loads(master_data)
            
        result = copy.deepcopy(master_data)
        
        # Append new seasons to existing seasons list
        if "seasons" in seasons_data:
            if "seasons" not in result["agent"]:
                result["agent"]["seasons"] = []
            result["agent"]["seasons"].extend(seasons_data["seasons"])
            
        return result
        
    def initialize_seasons(self, master_data: dict, seasons_data: dict) -> dict:
        """Initializes the seasons array in the master data.
        
        Args:
            master_data (dict): The master template data
            seasons_data (dict): The seasons data to initialize
            
        Returns:
            dict: Updated master data with initialized seasons
        """

        if isinstance(master_data, str):
            master_data = json.loads(master_data)
        
        # Deep copy to avoid modifying original
        result = copy.deepcopy(master_data)

        if "agent" in master_data and "seasons" in master_data["agent"]:
            result["agent"]["seasons"] = seasons_data["seasons"]
            
        #print(f"result is: {result}")            
        return result

    def append_episodes(self, master_data: dict, posts_data: dict, season_index: int, episode_index: int) -> dict:
        """Appends new episodes data to existing season data.
        
        Args:
            master_data (dict): The master template data
            episodes_data (dict): The episodes data to append
            season_index (int): Index of the season to update
            episode_index (int): Index of the episode to update
            
        Returns:
            dict: Updated master data with appended episodes
        """
        if isinstance(master_data, str):
            master_data = json.loads(master_data)
            
        result = copy.deepcopy(master_data)
        
        # Validate the nested structure exists
        if "agent" not in result:
            result["agent"] = {}
        if "seasons" not in result["agent"]:
            result["agent"]["seasons"] = []
        if season_index >= len(result["agent"]["seasons"]):
            result["agent"]["seasons"].append({"episodes": []})
        if "episodes" not in result["agent"]["seasons"][season_index]:
            result["agent"]["seasons"][season_index]["episodes"] = []
        if episode_index >= len(result["agent"]["seasons"][season_index]["episodes"]):
            result["agent"]["seasons"][season_index]["episodes"].append({})
        
        # Replace posts array with new data
        if "posts" in posts_data:
            result["agent"]["seasons"][season_index]["episodes"][episode_index]["posts"] = posts_data["posts"]
        
        return result

    def append_profile_image_options(self, master_data: dict, profile_image_data: dict) -> dict:
        """Appends new profile image data to existing master data.
        
        Args:
            master_data (dict): The master template data
            profile_image_data (dict): The profile image data to append
            
        Returns:
            dict: Updated master data with appended profile image
        """

        if isinstance(master_data, str):
            master_data = json.loads(master_data)
        
        # Deep copy to avoid modifying original
        result = copy.deepcopy(master_data)

        # Append new profile image to existing profile image list
        if "profile_image_options" in profile_image_data:
            if "profile_image_options" not in result["agent"]:
                result["agent"]["profile_image_options"] = []
            
            # replace the profile image with the new profile image
            result["agent"]["profile_image_options"] = profile_image_data["profile_image_options"]
            
        #print(f"result is: {result}")            
        return result

    def append_profile_image(self, master_data: dict, profile_image_data: dict) -> dict:
        """Appends new profile image data to existing master data.
        
        Args:
            master_data (dict): The master template data
            profile_image_data (dict): The profile image data to append
            
        Returns:
            dict: Updated master data with appended profile image
        """

        if isinstance(master_data, str):
            master_data = json.loads(master_data)
        
        # Deep copy to avoid modifying original
        result = copy.deepcopy(master_data)

        # Append new profile image to existing profile image list
        if "profile_image" in profile_image_data:
            if "profile_image" not in result["agent"]:
                result["agent"]["profile_image"] = []
            
            # replace the profile image with the new profile image
            result["agent"]["profile_image"] = profile_image_data["profile_image"]
            
        #print(f"result is: {result}")            
        return result

    def get_agent_names_blacklist(self):
        """Get a list of agent names based on folder names in config folder."""
        return [name for name in os.listdir(self.agents_config_dir) if os.path.isdir(os.path.join(self.agents_config_dir, name))]