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

def create_images(ai_model, prompt, master_file_path, num_images):
    # 4.1 Setup model details
    model_details = json.loads(open("asset_generation/leonard_anime_styles.json", "r").read())
    model_id = model_details["models"][0]["modelId"]
    anime_general_style = next(
        style for style in model_details["models"][0]["styles"] 
        if style["style name"] == "Anime General"
    )

    # 4.2 Setup style UUID
    style_uuid = anime_general_style["styleUUID"]

    # 4.3 Setup number of images
    num_images = 4

    # 4.4 Create image descriptions
    # If prompt is None, we need to create image descriptions automatically
    if prompt is None or prompt == "":
        # # 4.4 Create image descriptions
        # image_descriptions = image_post_description(ai_model, master_file_path, num_images)

        # # 4.5 loop through image descriptions and create profile images
        # for image_description in image_descriptions["profile_image_descriptions"]:
        #     print(image_description["description"] + "\n")    
        #     # 4.6 Create profile images
        #     create_profile_images(image_description, master_file_path, model_id, style_uuid, num_images, consistent=True, max_retries=10, delay=5) 
         
        # Simple fix for now is to feed in the agents concept into the prompt
        agent_master_json = None    
        with open(master_file_path, 'r', encoding='utf-8') as file:
            agent_master_json = json.load(file)  

        prompt = agent_master_json['agent']['concept']
        create_profile_images(prompt, master_file_path, model_id, style_uuid, num_images, consistent=False, max_retries=10, delay=5)    
    
    # 4.7 Create profile images based on users prompt
    else:
        create_profile_images(prompt, master_file_path, model_id, style_uuid, num_images, consistent=False, max_retries=10, delay=5)    

def image_post_description(ai_model, master_file_path, num_images):
    manager = ContentGenerator()
    image_descriptions = None

    # step 4.2: load the agent json file
    agent_master_json = None    
    with open(master_file_path, 'r', encoding='utf-8') as file:
        agent_master_json = json.load(file)  

    # step 4.3: extract agent from master json
    agent_details = agent_master_json['agent']['agent_details']

    print("Crafting prompt for AI to create a new profile image descriptions")
    prompt_4_vars = {
        "agent_name": agent_details["name"],
        "agent_json": json.dumps(agent_details),        
        "number_of_images": num_images
    }

    # step 2.4: Run the prompt 
    print("Sending prompt to AI to create a new profile image descriptions")
    image_descriptions = manager.run_prompt(
        prompt_key="prompt_4 (Agent Profile Image)",
        template_vars=prompt_4_vars, 
        ai_model=ai_model,
    )

    # print(f"image_descriptions is: {image_descriptions}")
    return image_descriptions

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

    # step 4.3.1: check to make sure we have a profile image placeholder
    if agent_master_json['agent']['profile_image'] is None or agent_master_json['agent']['profile_image'] == {}:
        agent_master_json['agent']['profile_image'] = profile_image_template['profile_image']
    
    # step 4.4: generate the image
    if consistent:
        response = images_leonardo.generate_inconsistent_image_lambda(prompt, model_id, style_uuid, num_images)
    else:
        response = images_leonardo.generate_inconsistent_image_lambda(prompt, model_id, style_uuid, num_images)
    
    if not response['generations_by_pk']['generated_images']:
        raise Exception("No Images Generated")

    generations_by_pk = response['generations_by_pk'].get("generated_images")
    generated_url = generations_by_pk[0].get('url')
    generated_id = generations_by_pk[0].get('id')
        
    # step 4.6: append new URL to the array
    profile_image_options_template["profile_image_options"].append(response)

    profile_image_template["profile_image"]["details"]["generationId"] = generated_id
    profile_image_template["profile_image"]["details"]["url"] = generated_url
    profile_image_template["profile_image"]["details"]["image_id"] = generated_id

    # step 4.7: create the save path, use 0 as we are not in a season or episode
    save_path = manager.create_filepath(agent_details["name"], 0, 0, TemplateType.PROFILE_IMAGE_OPTIONS)
    save_path_profile_image = manager.create_filepath(agent_details["name"], 0, 0, TemplateType.PROFILE_IMAGE)

    # step 4.8: save the profile image options to a file
    manager.save_json_file(save_path, profile_image_options_template)

    # if this is consistent, we will multiple genreation ids to track. So its better to store the generation id of the image the user picks.
    if not consistent:
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
    # 4.1 Setup number of images
    num_images = 4

    # 4.2 Setup AI model
    ai_model = GeminiModel()
    master_file_path = "configs/CipherCat/CipherCat_master.json"

    # 4.2.1 Setup prompt
    # prompt = "a pygmy marmoset who owns 30% of trumps meme coin"
    prompt = ""

    # 4.3 Create profile images
    create_images(ai_model, prompt, master_file_path, num_images)   
