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

dotenv.load_dotenv()

#--------------------------------
# Generate an image from a prompt
#--------------------------------
def generated_image(prompt):
    url = "https://cloud.leonardo.ai/api/rest/v1/generations"

    payload = {
        "alchemy": True,
        "height": 768,
        "modelId": "b24e16ff-06e3-43eb-8d33-4416c2d75876",
        "num_images": 4,
        "presetStyle": "DYNAMIC",
        "prompt": prompt,
        "width": 1024
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer " + os.getenv("LEONARDO_API_KEY", "")
    }

    response = requests.post(url, json=payload, headers=headers)

    return response.json()

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
    response = get_model_styles("4fc2c951-5a86-4fc1-9ff2-d72a2213bb14")
    print(response)

