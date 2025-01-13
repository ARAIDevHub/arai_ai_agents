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

dotenv.load_dotenv()

# Define model_id and styles at module level
model_id = "e71a1c2f-4f80-4800-934f-2c68979d8cc8"
styles = {
    "Anime None": None,
    "anime background": "ANIME_BACKGROUND",
    "Anime Flat Illustration": "ANIME_FLAT_ILLUSTRATION",
    "Anime General": "ANIME_GENERAL",
    "Anime Illustration": "ANIME_ILLUSTRATION",
    "Anime Monoschrome": "ANIME_MONOSCHROME",
    "Anime Retro": "ANIME_RETRO",
    "Anime Screencap": "ANIME_SCREENCAP",
    "Anime Semi-Realism": "ANIME_SEMI_REALISM",
    "Character Sheet": "CHARACTER_SHEET",
    "Character Sheet Painterly": "CHARACTER_SHEET_PAINTERLY",
    "Manga": "MANGA"
}

#--------------------------------
# Generate an image from a prompt
#--------------------------------
def generated_image(prompt):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    payload = {
      "modelId": "e71a1c2f-4f80-4800-934f-2c68979d8cc8",
      "presetStyle": "DYNAMIC",
      "scheduler": "LEONARDO",
      "sd_version": "SDXL_LIGHTNING",
      "contrast": 1.3,
      "prompt": "Anime character Nicki. Generate a traditional looking anime character for me. I want her to be an anime girlfriend who is super into the crypto space. Make her attractive with big boobs. I want to see the big boobs clearly. Have her with hair green, eye color blue, skin color tan.",
      "num_images": 4,
      "width": 1024,
      "height": 1024,
      "alchemy": True,
      "styleUUID": "b2a54a51-230b-4d4f-ad4e-8409bf58645f",
      "enhancePrompt": False,
      "nsfw": True,
      "public": False,
      "collectionIds": ["9239334b-78d7-4aa5-98f7-043ba6b66f6d"],
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    except Exception as e:
        print("Error:", str(e))
        return None

#--------------------------------
# Get the image URL from a generation ID
#--------------------------------
def get_image_url(generation_id):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations/" + generation_id

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Get list of models
#--------------------------------
def get_models():
    url = "https://cloud.leonardo.ai/api/rest/v1/platformModels"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

# Get a list of model styles
#--------------------------------
def get_model_styles(model_id):
    url = "https://cloud.leonardo.ai/api/rest/v1/platformModels/" + model_id + "/styles"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Get list of elements
#--------------------------------
def get_elements():
    url = "https://cloud.leonardo.ai/api/rest/v1/elements"

    headers = {
        "accept": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.get(url, headers=headers)

    return response.json()

#--------------------------------
# Main
#--------------------------------
if __name__ == "__main__":
    #--------------------------------
    # Styles
    #--------------------------------
    model_id = "e71a1c2f-4f80-4800-934f-2c68979d8cc8"
    styles = {
        "Anime None": None,
        "anime background": "ANIME_BACKGROUND",
        "Anime Flat Illustration": "ANIME_FLAT_ILLUSTRATION",
        "Anime General": "ANIME_GENERAL",
        "Anime Illustration": "ANIME_ILLUSTRATION",
        "Anime Monoschrome": "ANIME_MONOSCHROME",
        "Anime Retro": "ANIME_RETRO",
        "Anime Screencap": "ANIME_SCREENCAP",
        "Anime Semi-Realism": "ANIME_SEMI_REALISM",
        "Character Sheet": "CHARACTER_SHEET",
        "Character Sheet Painterly": "CHARACTER_SHEET_PAINTERLY",
        "Manga": "MANGA"
    }

    # Generate the image
    response = generated_image("A majestic cat in the snow")

    print(response)

    generation_id = response["sdGenerationJob"]["generationId"]
    
    # Wait for the image to be generated (usually takes 10-20 seconds)
    print("Waiting for image generation...")
    time.sleep(20)  # Wait 20 seconds
    
    # Get the image URL
    response_url = get_image_url(generation_id)
    
    if response_url.get("generations_by_pk", {}).get("generated_images"):
        print(response_url["generations_by_pk"]["generated_images"][0]["url"])
    else:
        print("Image not ready yet. Try waiting longer or check the generation status.")

