import os
import google.generativeai as genai
from .base_model import ModelInterface
from dotenv import load_dotenv
import yaml

load_dotenv()

class GeminiModel(ModelInterface):
    '''
    Gemini model implementation.
    '''

    def __init__(self, api_key=None, model_name="gemini-exp-1206"):
        '''
        Initialize the Gemini model.
        '''
        if api_key:
            genai.configure(api_key=api_key)
        else:
            genai.configure(api_key=os.environ.get('GOOGLE_GEMINI_API_KEY'))
        self.model = genai.GenerativeModel(model_name)

        # Load agent template configuration
        agent_template_path = os.path.join("templates", "agent_template.yaml")
        with open(agent_template_path, "r") as f:
            self.agent_template = yaml.safe_load(f)

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using the Gemini API.
    # -------------------------------------------------------------------
    def generate_response(self, prompt, **kwargs):
        if isinstance(prompt, str):
            return self.generate_response_from_string(prompt, **kwargs)       
        elif isinstance(prompt, list[dict]):
            return self.generate_response_dictionary(prompt)

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using a list of dictionaries
    # -------------------------------------------------------------------
    def generate_response_dictionary(self, prompt: list[dict]) -> str:
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error generating response: {str(e)}"

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using a string
    # -------------------------------------------------------------------
    def generate_response_from_string(self, prompt, **kwargs):
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