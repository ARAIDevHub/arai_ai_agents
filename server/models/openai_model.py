import os # Os is used for interacting with the operating system
from openai import OpenAI # OpenAI is used for interacting with the OpenAI API
from .base_model import ModelInterface # Used for agent interface
from dotenv import load_dotenv # Used for loading environment variables
import chromadb # Used for interacting with the ChromaDB database
# from chromadb.config import Settings

load_dotenv() # Load environment variables from .env file

class OpenAIModel(ModelInterface): # OpenAIModel inherits from ModelInterface
    '''
    OpenAI model implementation.
    '''

    def __init__(self, model_name="gpt-4o"):
        '''
        Initialize the OpenAI model.
        '''
        # chromadb setup
        self.client = chromadb.PersistentClient(path=persist_dir) if persist_dir else chromadb.Client()

        # ai model setup
        self.model_name = model_name # Set the model type we want to use
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_response(self, prompt: str, personality: str = "", style: str = "", max_length: int = 277) -> str:
        '''
        Generate a response to a given prompt using the OpenAI API.
        '''
        try:
            # instructions being sent to the ai model
            messages = []

            # add personality and style to the instructions
            if personality or style:
                persona_prompt = f"{personality}\n{style}"
                messages.append({
                    "role": "system",
                    "content": persona_prompt
                })
            
            # user message
            length_constraints = f"The response should be no more than {max_length} characters."
            full_prompt = prompt + length_constraints
            messages.append({
                "role": "user",
                "content": full_prompt
            })

            # Make sure that what is being sent to the model is correct
            print(messages)

            # generate the response
            response = self.client.chat.completions.create( # Create a chat completion with the OpenAI API
                model=self.model_name, # Set the model type we want to use
                messages=messages, # Set the prompt we want to use
                temperature=0.7, # Set the temperature of the response
                max_tokens=400, # Set the maximum number of tokens to generate
            )
            
            return response.choices[0].message.content.strip() # reutrn the response as a string using strip() to remove any whitespace
        
        except Exception as e:
            return f"Error generating response: {str(e)}" # Return an error message if the response fails
