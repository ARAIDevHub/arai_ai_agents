#
# Module: deepseek_model
#
# This module implements the DeepSeekModel class for interacting with the DeepSeek API.
#
# Title: DeepSeek Model
# Summary: DeepSeek model implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2025-01-22
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-22
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino
import os
import google.generativeai as genai
from .base_model import ModelInterface
from dotenv import load_dotenv
import yaml

load_dotenv()

class DeepSeekModel(ModelInterface):
    """DeepSeek model implementation.

    Attributes:
        model (str): The name of the DeepSeek model to use.
    """

    def __init__(self, api_key=None, model_name="deepseek-exp-1206"):
        """Initialize the DeepSeek model.

        Args:
            api_key (str): The API key to use for the DeepSeek model.
            model_name (str): The name of the DeepSeek model to use.

        Example:
            >>> deepseek_model = DeepSeekModel()
        """
        if api_key:
            genai.configure(api_key=api_key)
        else:
            genai.configure(api_key=os.environ.get('DEEPSEEK_API_KEY'))
        self.model = genai.GenerativeModel(model_name)

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using the DeepSeek API.
    # -------------------------------------------------------------------
    def generate_response(self, prompt, **kwargs):
        """Generate a response to a given prompt using the DeepSeek API.

        Args:
            prompt (str): The prompt to generate a response to.
            **kwargs: Additional keyword arguments.

        Returns:
            str: The generated response.

        Example:
            >>> deepseek_model = DeepSeekModel()
            >>> response = deepseek_model.generate_response("What is the weather in Tokyo?")
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
            >>> deepseek_model = DeepSeekModel()
            >>> response = deepseek_model.generate_response_dictionary([{"role": "user", "parts": "What is the weather in Tokyo?"}])
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
            >>> deepseek_model = DeepSeekModel()
            >>> response = deepseek_model.generate_response_from_string("What is the weather in Tokyo?")
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
