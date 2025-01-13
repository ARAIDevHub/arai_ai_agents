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
# Step 4: Generate a profile image
#--------------------------------
def step_4(prompt, model_id, style_uuid, num_images):
    # Setup prompt
    prompt = "Anime character Nicki. Generate a traditional looking anime character for me. I want her to be an anime girlfriend who is super into the crypto space. Make her attractive with big boobs. I want to see the big boobs clearly. Have her with hair green, eye color blue, skin color tan."
    
    # Setup model details
    model_details = json.loads(open("leonard_anime_styles.json", "r").read())
    model_id = model_details["models"][0]["modelId"]
    anime_general_style = next(
        style for style in model_details["models"][0]["styles"] 
        if style["style name"] == "Anime General"
    )
    style_uuid = anime_general_style["styleUUID"]

    # Setup number of images
    num_images = 1

    # Generate the image
    response = images_leonardo.generated_image_inconsistent(prompt, model_id, style_uuid, num_images)

    print(response)

    # Get the generation ID
    generation_id = response["sdGenerationJob"]["generationId"]
    
    # Wait for the image to be generated (usually takes 10-20 seconds)
    print("Waiting for image generation...")
    time.sleep(20)  # Wait 20 seconds
    
    # Get the image URL
    response_url = images_leonardo.get_image_url(generation_id)
    
    # Print the image URL
    if response_url.get("generations_by_pk", {}).get("generated_images"):
        new_image_url = response_url["generations_by_pk"]["generated_images"][0]["url"]
        
        # Load existing profile images from templates directory
        manager = ContentGenerator()
        profile_template = manager.create_new_template_json(TemplateType.PROFILE_IMAGE)
        # Load existing profile images from templates directory
        json_path = os.path.join("server", "templates", "profile_image.json")
        with open(json_path, "r") as f:
            profile_image = json.load(f)
        
        # Append new URL to the array
        profile_image["profile_image"].append(new_image_url)
        
        # Save updated profile images to configs/temporary directory
        save_path = os.path.join("server", "configs", "temporary", "profile_image.json")
        os.makedirs(os.path.dirname(save_path), exist_ok=True)  # Create directory if it doesn't exist
        with open(save_path, "w") as f:
            json.dump(profile_image, indent=4, fp=f)

    else:
        print("Image not ready yet. Try waiting longer or check the generation status.")


