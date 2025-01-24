import os # Os is used for interacting with the operating system
from openai import OpenAI # OpenAI is used for interacting with the OpenAI API
from .base_model import ModelInterface # Used for agent interface
from dotenv import load_dotenv # Used for loading environment variables

load_dotenv() # Load environment variables from .env file

class OpenAIModel(ModelInterface): # OpenAIModel inherits from ModelInterface
    '''
    OpenAI model implementation.
    '''

    def __init__(self, my_api_key=None, model_name="gpt-4o"):
        '''
        Initialize the OpenAI model.
        '''
        
        # ai model setup
        self.model_name = model_name # Set the model type we want to use
        if my_api_key:
            self.client = OpenAI(api_key=my_api_key)
        else:
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # -------------------------------------------------------------------
    # Helper to generate a response to a given prompt using the OpenAI API.
    # -------------------------------------------------------------------
    def generate_response(self, prompt, **kwargs):
        """Generate a response to a given prompt using the OpenAI API.

        Args:
            prompt (str): The prompt to generate a response to.
            **kwargs: Additional keyword arguments.

        Returns:
            str: The generated response.

        Example:
            >>> openai_model = OpenAIModel()
            >>> response = openai_model.generate_response("What is the weather in Tokyo?")
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
            >>> openai_model = OpenAIModel()
            >>> response = openai_model.generate_response_dictionary([{"role": "user", "parts": "What is the weather in Tokyo?"}])
        """
        try:
            response = self.client.chat.completions.create( # Create a chat completion with the OpenAI API
                model=self.model_name, # Set the model type we want to use
                messages=prompt # Set the prompt we want to use
            )

            return response.choices[0].message.content.strip()
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
            >>> openai_model = OpenAIModel()
            >>> response = openai_model.generate_response_from_string("What is the weather in Tokyo?")
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
                persona_prompt = f"{personality} {communication_style}".strip()
                messages.append({
                    "role": "system",
                    "content": persona_prompt
                })

            # User message
            messages.append({
                "role": "user",
                "content": prompt
            })

            # generate the response
            # generate the response
            # response = self.client.chat.completions.create( # Create a chat completion with the OpenAI API
            #     model=self.model_name, # Set the model type we want to use
            #     messages=messages, # Set the prompt we want to use
            #     temperature=0.7, # Set the temperature of the response
            #     max_tokens=400, # Set the maximum number of tokens to generate
            # )
            response = self.client.chat.completions.create( # Create a chat completion with the OpenAI API
                model=self.model_name, # Set the model type we want to use
                messages=messages # Set the prompt we want to use
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            return f"Error generating response: {str(e)}"


if __name__ == "__main__":
    openai_model = OpenAIModel()
    response = openai_model.generate_response("Tell me 10 one liners about crypto. put them as a json object")
    print(response)
