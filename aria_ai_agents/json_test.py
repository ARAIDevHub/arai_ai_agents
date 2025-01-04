# standard imports
import os
import json

# custom imports
import models.gemini_model as model

if __name__ == "__main__":
    ai_model = model.GeminiModel()

    # use relative path to get to project root (two levels up from utils)
    project_root = os.path.dirname(os.path.dirname(__file__))
    
    # Set the directories relative to project root
    prompts_dir = os.path.join(project_root, "prompts")      

    # load json file
    with open(os.path.join(prompts_dir, "prompt_1.json"), "r") as f:
        prompt_1 = json.load(f)

    # replace {{ concept }} in the prompt_1
    

    response = ai_model.generate_response("Can you help me with json")
    print(response)
