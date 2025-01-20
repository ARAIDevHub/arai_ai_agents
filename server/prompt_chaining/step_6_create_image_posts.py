#
# Module: template_types
#
# This module implements the TemplateType class for defining the type of template.
#
# Title: Template Types
# Summary: Template types implementation.
# Authors:
#     - @TheBlockRhino
# Created: 2024-12-31
# Last edited by: @TheBlockRhino
# Last edited date: 2025-01-12
# URLs:
#     - https://arai-ai.io
#     - https://github.com/ARAI-DevHub/arai-ai-agents
#     - https://x.com/TheBlockRhino

import requests
import os
import dotenv
import time
import json
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# custom ARAI imports
from utils.content_generator import ContentGenerator
from utils.template_types import TemplateType
import asset_generation.images_leonardo as images_leonardo
from models.gemini_model import GeminiModel

dotenv.load_dotenv()


def create_image_posts(ai_model, master_file_path, num_images, season_number, episode_number):
    manager = ContentGenerator()
    image_descriptions = None

    # step 4.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # step 4.3: extract agent from master json
    agent_details = agent_master_json['agent']['agent_details']
    episode_details = agent_master_json['agent']['seasons'][season_number]['episodes'][episode_number]

    print("Crafting prompt for AI to create a new profile image descriptions")
    prompt_6_vars = {
        "agent_name": agent_details["name"],
        "agent_json": json.dumps(agent_details),
        "episode_json": json.dumps(episode_details),
        "number_of_images": num_images
    }

    # step 2.4: Run the prompt 
    print("Sending prompt to AI to create a new profile image descriptions")
    image_descriptions = manager.run_prompt(
        prompt_key="prompt_6 (Create Social Media Image Post)",
        template_vars=prompt_6_vars, 
        ai_model=ai_model,
    )

    # print(f"image_descriptions is: {image_descriptions}")
    return image_descriptions

def create_image_post(ai_model, prompt, model_id, style_uuid, num_images, consistent=False, max_retries=10, delay=5):
    manager = ContentGenerator()

    # step 4.4: generate the image
    if consistent:
        response, payload = images_leonardo.generated_image_consistent(prompt, model_id, style_uuid, num_images)
    else:
        response, payload = images_leonardo.generated_image_inconsistent(prompt, model_id, style_uuid, num_images)
    
    generation_id = response["sdGenerationJob"]["generationId"]

    # step 4.5: retry loop to check for image completion
    success = False  # Add flag to track success
    for attempt in range(max_retries):
        response_url = images_leonardo.get_image_url(generation_id)
        
        if response_url.get("generations_by_pk", {}).get("generated_images"):
            success = True  # Set flag when successful
            break  # Exit the loop when we have images
            
        print(f"Image not ready yet. Attempt {attempt + 1}/{max_retries}. Waiting {delay} seconds...")
        time.sleep(delay)
    
    if not success:
        print("Max retries reached. Image generation may have failed.")
        return None           

    # step 4.7: create the save path, use 0 as we are not in a season or episode
    save_path = os.path.join("configs", "temporary", "image_generations", f"generation_{generation_id}.json")

    # step 4.8: save the profile image options to a file
    manager.save_json_file(save_path, response_url)

if __name__ == "__main__":    
    # Setup model details
    model_details = json.loads(open("asset_generation/leonard_anime_styles.json", "r").read())
    model_id = model_details["models"][0]["modelId"]
    anime_general_style = next(
        style for style in model_details["models"][0]["styles"] 
        if style["style name"] == "Anime General"
    )

    # Setup parameters
    episode_number = 0
    season_number = 0
    style_uuid = anime_general_style["styleUUID"]    
    num_images = 2

    # Setup AI model
    ai_model = GeminiModel()
    master_file_path = "configs/LamboLara/LamboLara_master.json"

    #--------------------------------
    # Step 4.1: Create multiple profile images via multiple prompts using consistent images
    #--------------------------------
    image_descriptions = create_image_posts(
        ai_model=ai_model, 
        master_file_path=master_file_path, 
        num_images=num_images, 
        episode_number=episode_number, 
        season_number=season_number
    )

    print("\n\n")    
    print(f"image_descriptions is: {json.dumps(image_descriptions, indent=4)}")
    print("\n\n")
    
    # print the image descriptions
    for image_description in image_descriptions["image_post_descriptions"]:
        print(image_description["image_description"] + "\n")
        print(image_description["post_after"] + "\n")
        # Generate the image
        create_image_post(
            ai_model=ai_model, 
            prompt=image_description["image_description"], 
            model_id=model_id, 
            style_uuid=style_uuid, 
            num_images=1, 
            consistent=False, 
            max_retries=10, 
            delay=5
        )