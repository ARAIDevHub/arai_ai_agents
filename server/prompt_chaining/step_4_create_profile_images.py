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
from utils.content_generator_json import ContentGenerator
from utils.template_types import TemplateType
import asset_generation.images_leonardo as images_leonardo
dotenv.load_dotenv()

#--------------------------------
# Step 4: Generate a number of images for profile image
#--------------------------------
def create_profile_images(prompt, master_file_path, model_id, style_uuid, num_images, consistent=False, max_retries=10, delay=5):
    
    # step 4.1: load existing profile image options from templates directory
    manager = ContentGenerator()
    profile_image_options_template = manager.create_new_template_json(TemplateType.PROFILE_IMAGE_OPTIONS)
    profile_image_template = manager.create_new_template_json(TemplateType.PROFILE_IMAGE)

    # step 4.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # step 4.3: extract agent from master json
    agent_details = agent_master_json['agent']['agent_details']
    
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
            
    # step 4.6: append new URL to the array
    profile_image_options_template["profile_image_options"].append(response_url)
    profile_image_template["profile_image"]["payload"] = payload
    profile_image_template["profile_image"]["details"]["generationId"] = generation_id

    # step 4.7: create the save path, use 0 as we are not in a season or episode
    save_path = manager.create_filepath(agent_details["name"], 0, 0, TemplateType.PROFILE_IMAGE_OPTIONS)
    save_path_profile_image = manager.create_filepath(agent_details["name"], 0, 0, TemplateType.PROFILE_IMAGE)

    # step 4.8: save the profile image options to a file
    manager.save_json_file(save_path, profile_image_options_template)
    manager.save_json_file(save_path_profile_image, profile_image_template)

    # step 4.9: append to master file
    agent_master_json = manager.append_profile_image_options(agent_master_json, profile_image_options_template)
    agent_master_json = manager.append_profile_image(agent_master_json, profile_image_template)

    # step 4.10: save the master data to a file
    print("Saving the master data to a file")
    manager.save_json_file(
        save_path=master_file_path,
        json_data=agent_master_json
    )


if __name__ == "__main__":
    # Setup prompt
    prompt = "Anime character Nicki. Generate a traditional looking anime character for me. I want her to be an anime girlfriend who is super into the crypto space. Make her attractive with big boobs. I want to see the big boobs clearly. Have her with hair green, eye color blue, skin color tan."
    
    # Setup model details
    model_details = json.loads(open("asset_generation/leonard_anime_styles.json", "r").read())
    model_id = model_details["models"][0]["modelId"]
    anime_general_style = next(
        style for style in model_details["models"][0]["styles"] 
        if style["style name"] == "Anime General"
    )
    style_uuid = anime_general_style["styleUUID"]

    # Setup number of images
    num_images = 4

    # Generate the image
    create_profile_images(prompt, "configs/Aiko_The_Chain/Aiko_The_Chain_master.json", model_id, style_uuid, num_images, consistent=False, max_retries=10, delay=5)


    