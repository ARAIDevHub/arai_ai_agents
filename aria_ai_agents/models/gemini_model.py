#
# Module: gemini_model
#
# This module implements the GeminiModel class for interacting with the Gemini API.
#
# Title: Gemini Model
# Summary: Gemini model implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-04
# URLs:
#     - https://aria-ai.io
#     - https://github.com/ARIA-DevHub/aria-ai-agents
#     - https://x.com/TheBlockRhino
import os
import google.generativeai as genai
from .base_model import ModelInterface
from dotenv import load_dotenv
import yaml

load_dotenv()

class GeminiModel(ModelInterface):
    """Gemini model implementation.

    Attributes:
        model (str): The name of the Gemini model to use.
    """

    def __init__(self, api_key=None, model_name="gemini-exp-1206"):
        """Initialize the Gemini model.

        Args:
            api_key (str): The API key to use for the Gemini model.
            model_name (str): The name of the Gemini model to use.

        Example:
            >>> gemini_model = GeminiModel()
        """
        if api_key:
            genai.configure(api_key=api_key)
        else:
            genai.configure(api_key=os.environ.get('GOOGLE_GEMINI_API_KEY'))
        self.model = genai.GenerativeModel(model_name)

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using the Gemini API.
    # -------------------------------------------------------------------
    def generate_response(self, prompt, **kwargs):
        """Generate a response to a given prompt using the Gemini API.

        Args:
            prompt (str): The prompt to generate a response to.
            **kwargs: Additional keyword arguments.

        Returns:
            str: The generated response.

        Example:
            >>> gemini_model = GeminiModel()
            >>> response = gemini_model.generate_response("What is the weather in Tokyo?")
        """
        if isinstance(prompt, str):
            return self.generate_response_from_string(prompt, **kwargs)       
        elif isinstance(prompt, list[dict]):
            return self.generate_response_dictionary(prompt)

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using a list of dictionaries
    # -------------------------------------------------------------------
    def generate_response_dictionary(self, prompt: list[dict]) -> str:
        """Generate a response to a given prompt using a list of dictionaries.

        Args:
            prompt (list[dict]): The prompt to generate a response to.

        Returns:
            str: The generated response.
        
        Example:
            >>> gemini_model = GeminiModel()
            >>> response = gemini_model.generate_response_dictionary([{"role": "user", "parts": "What is the weather in Tokyo?"}])
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error generating response: {str(e)}"

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using a string
    # -------------------------------------------------------------------
    def generate_response_from_string(self, prompt, **kwargs):
        """
        Description: 
            Generate a response to a given prompt using a string.

        Args:
            prompt (str): The prompt to generate a response to.
            **kwargs: Additional keyword arguments.

        Returns:
            str: The generated response.

        Example:
            >>> gemini_model = GeminiModel()
            >>> response = gemini_model.generate_response_from_string("What is the weather in Tokyo?")
        """
        # Extract personality and style from kwargs, or use defaults from agent_template
        if kwargs:
            if "personality" in kwargs:
                personality = kwargs.get("personality")
            if "communication_style" in kwargs:
                communication_style = kwargs.get("communication_style")
        else:
            personality = ""
            communication_style = ""        

        try:
            # instructions being sent to the ai model
            messages = []

            # add personality and style to the instructions
            if personality or communication_style:
                persona_prompt = f"{personality} {communication_style}"
                messages.append({
                    "role": "user",
                    "parts": [persona_prompt]
                })

            # user message
            messages.append({
                "role": "user",
                "parts": [prompt]
            })

            # Make sure that what is being sent to the model is correct
            # print(messages)

            # generate the response
            response = self.model.generate_content(messages)
            return response.text.strip()

        except Exception as e:
            return f"Error generating response: {str(e)}"

    # -------------------------------------------------------------------
    # Helper to fix a response that is not valid YAML
    # -------------------------------------------------------------------
    def fix_response(self, prompt, response):
        """Fix a response that is not valid YAML.

        Args:
            prompt (str): The prompt to generate a response to.
            response (str): The response to fix.

        Returns:
            str: The fixed response.

        Raises:
            Exception: If there's an error calling the API.

        Example:
            >>> gemini_model = GeminiModel()
            >>> response = gemini_model.fix_response("What is the weather in Tokyo?", "The weather in Tokyo is sunny.")
        """
        try:
            # instructions being sent to the ai model
            messages = []

            # add personality and style to the instructions            
            messages.append({
                "role": "user",
                "parts": [prompt]
            })

            # user message
            messages.append({
                "role": "user",
                "parts": [response]
            })

            # Make sure that what is being sent to the model is correct
            # print(messages)

            # generate the response
            response = self.model.generate_content(messages)
            return response.text.strip()

        except Exception as e:
            return f"Error generating response: {str(e)}"

    def generate_yaml_response(self):
        """Generate a YAML response.

        Args:
            None

        Returns:
            None

        Example:
            >>> gemini_model = GeminiModel()
            >>> gemini_model.generate_yaml_response()
        """
        messages = []

        messages.append({
            "role": "user",
            "parts": "Create me a YAML file with the following fields: name, personality, communication_style, topic, backstory, universe, hashtags, emojis. Start and end the file with ```yaml and ```"
        })

        response = self.model.generate_content(messages)
        print(response)

        # save the response to a file
        with open("response.txt", "w", encoding="utf-8") as f:
            f.write(response.text.strip())

        # save the response to a file
        with open("response.yaml", "w", encoding="utf-8") as f:
            f.write(response.text)

        # strip the response
        with open("response_stripped.yaml", "w", encoding="utf-8") as f:
            f.write(response.text.strip())


        # save the response to a yaml file
        with open("yaml_response.yaml", "w", encoding="utf-8") as f:
            yaml.dump(response.text, f)       

        # strip the response
        with open("yaml_response_stripped.yaml", "w", encoding="utf-8") as f:
            yaml.dump(response.text.strip(), f)    